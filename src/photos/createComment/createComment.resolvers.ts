import { Context } from "../../types";
import { protectedResolver } from "../../users/users.utils";

const createCommentFn = async (root:any, args:{ photoId:number, payload:string }, context:Context, info:any) => {

    const { loggedInUser, client } = context;
    const { photoId, payload } = args;

    const photo = await client.photo.findUnique({
        where: {
            id:photoId
        },
        select: {
            id:true
        }
    })

    if(!photo) {
        return {
            ok:false,
            error: "photo not found"
        }
    }

    const comment = await client.comment.create({
        data: {
            photo: {
                connect: {
                    id: photo.id
                }
            },
            user: {
                connect: {
                    id: loggedInUser.id
                }
            },
            payload:payload
        }
    })

    return {
        ok:true, 
        id:comment.id
    }


}

export default {
    Mutation: {
        createComment: protectedResolver(createCommentFn)
    }
}