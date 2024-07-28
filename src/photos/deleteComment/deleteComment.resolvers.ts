import { Context } from "../../types";
import { protectedResolver } from "../../users/users.utils";

const deleteCommentFn = async (root:any, args:{ commentId:number }, context:Context, info:any) => {

    const { loggedInUser, client } = context;
    const { commentId } = args;

    const comment = await client.comment.findUnique({
        where: {
            id:commentId
        },
        select: {
            userId: true
        }
    })

    if(!comment) {
        return {
            ok:false,
            error: "comment not found"
        }
    } else if(comment.userId !== loggedInUser.id) {
        return {
            ok:false,
            error: "Not authorized"
        }
    } else {
        await client.comment.delete({
            where: {
                id:commentId
            }
        })
    
        return {
            ok:true,
        }
    }
}

export default {
    Mutation: {
        deleteComment: protectedResolver(deleteCommentFn)
    }
}