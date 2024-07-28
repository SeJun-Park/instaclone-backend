import { Context } from "../../types";
import { protectedResolver } from "../../users/users.utils";

const editCommentFn = async (root:any, args: { commentId:number,payload:string }, context:Context, info:any) => {

    const { loggedInUser, client } = context;
    const { commentId, payload } = args;

    const comment = await client.comment.findUnique({
        where: {
            id:commentId
        },
        select: {
            userId:true
        }
    })

    if(!comment) {
        return {
            ok:false,
            error: "Comment Not Found"
        }
    } else if(comment.userId !== loggedInUser.id) {
        return {
            ok:false,
            error: "Not authorized"
        }
    } else {
        await client.comment.update({
            where: {
                id:commentId
            },
            data: {
                payload:payload
            }
        })

        return {
            ok:true,
        }
    }

}

export default {
    Mutation: {
        editComment: protectedResolver(editCommentFn)
    }
}