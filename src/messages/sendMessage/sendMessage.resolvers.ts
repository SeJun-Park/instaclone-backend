import { NEW_MESSAGE } from "../../constants";
import { Context } from "../../types";
import { protectedResolver } from "../../users/users.utils";

const sendMessageFn = async (root:any, args:{ payload:string, roomId?:number, userId?:number }, context:Context, info:any) => {

    const { loggedInUser, client, pubsub } = context;
    const { payload, roomId, userId } = args;

    // 대화방이 이미 존재하면 만들지 않는 기능, --> 해당 대화방으로 이동하여 메시지 추가
    // 팔로우 관계에서만 가능하게 하는 기능. 등 추가 가능.

    let roomIdObj : {id:number} | null = null;

    if(userId) {
        const user = await client.user.findUnique({
            where: {
                id:userId
            },
            select: {
                id:true
            }
        })

        if(!user) {
            return {
                ok:false,
                error: "This user does not exist"
            }
        }

        roomIdObj = await client.room.create({
            data: {
                users: {
                    connect: [
                        {
                            id: userId
                        },
                        {
                            id: loggedInUser.id
                        }
                    ]
                }
            },
            select: {
                id: true
            }
        })

    } else if(roomId) {
        roomIdObj = await client.room.findUnique({
            where: {
                id:roomId
            },
            select: {
                id:true
            }
        })

        if(!roomIdObj) {
            return {
                ok:false,
                error: "This room does not exist"
            }
        }
    }

    if(!roomIdObj) {
        return {
            ok:false,
            error: "Room Id Object does not exist"
        }
    }

    const newMessage = await client.message.create({
        data: {
            payload:payload,
            user: {
                connect: {
                    id: loggedInUser.id
                }
            },
            room: {
                connect: {
                    id: roomIdObj.id
                }
            }
        }
    })

    pubsub.publish(NEW_MESSAGE, { updateRoom:newMessage });

    return {
        ok:true,
    } 
}


export default {
    Mutation: {
        sendMessage: protectedResolver(sendMessageFn)
    }
}