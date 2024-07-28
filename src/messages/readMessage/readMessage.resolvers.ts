import { Context } from "../../types";
import { protectedResolver } from "../../users/users.utils";

const readMessageFn = async (root:any, args:{ messageId:number }, context:Context, info:any) => {

    const { loggedInUser, client } = context;
    const { messageId } = args; 

    const message = await client.message.findFirst({
        where: {
            id:messageId,

            userId: {
                not: loggedInUser.id
            },
            // 내가 보내지 않았고,
            room: {
                users: {
                    some: {
                        id: loggedInUser.id
                    }
                }
                // 내가 들어있는 방에 있는 메세지.
            }
            },
        select: {
            id:true
        }
    })

    if(!message) {
        return {
            ok:false,
            error: "Message Not found"
        }
    }

    await client.message.update({
        where: {
            id:messageId
        },
        data: {
            read:true
        }
    })

    return {
        ok:true
    }

    

}


export default {
    Mutation: {
        readMessage: protectedResolver(readMessageFn)
    }
}