import { Context } from "../../types";
import { protectedResolver } from "../../users/users.utils";

const toggleLikeFn = async (root:any, args:{ photoId:number }, context:Context, info:any) => {

    const { loggedInUser, client } = context;
    const { photoId } = args;

    const photo = await client.photo.findUnique({
        where: {
            id:photoId
        }
    })

    if(!photo) {
        return {
            ok:false,
            error: "photo not found"
        }
    }

    // 
    const like = await client.like.findUnique({
        where: {
            photoId_userId: {
                photoId:photo.id,
                userId:loggedInUser.id
            }
        }
    })

    if(like) {
        await client.like.delete({
            where: {
                photoId_userId: {
                    photoId:photo.id,
                    userId:loggedInUser.id
                }
            }
        })
    } else {
        // await client.like.create({
        //     data: {
        //         userId: loggedInUser.id,
        //         photoId: photo.id
        //     }
        // })
        await client.like.create({
            data: {
                user: {
                    connect: {
                        id: loggedInUser.id
                    }
                },
                photo: {
                    connect: {
                        id: photo.id
                    }
                }
            }
        })
    }

    
    return {
        ok:true,
    }



}

export default {
    Mutation: {
        toggleLike: protectedResolver(toggleLikeFn)
    }
}