import { Context } from "../../types";
import { protectedResolver } from "../../users/users.utils";

const deletePhotoFn = async (root:any, args:{ photoId:number }, context:Context, info:any) => {

    const { loggedInUser, client } = context;
    const { photoId } = args;

    const photo = await client.photo.findUnique({
        where: {
            id:photoId
        },
        select: {
            userId: true
        }
    })

    if(!photo) {
        return {
            ok:false,
            error: "photo not found"
        }
    } else if(photo.userId !== loggedInUser.id) {
        return {
            ok:false,
            error: "Not authorized"
        }
    } else {
        await client.photo.delete({
            where: {
                id:photoId
            }
        })
    
        return {
            ok:true,
        }
    }
}

export default {
    Mutation: {
        deletePhoto: protectedResolver(deletePhotoFn)
    }
}