import { Context } from "../../types"
import { protectedResolver } from "../../users/users.utils"
import { createHashtagObjArray } from "../photos.utils";

const editPhotoFn = async (root:any, args:{ photoId:number, caption:string }, context:Context, info:any) => {

    const { loggedInUser, client } = context;
    const { photoId, caption } = args;

    console.log(`photoId:${photoId}, caption:${caption}`)

    const target = await client.photo.findUnique({
        where: {
            id:photoId,
            userId:loggedInUser.id
        },
        include: {
            // 이렇게 하면 targetPhoto가 가지고 있는 hashtag 들이 나오는데, id, hashtag, photos, createdAt... 중에 hashtag만 뽑아서 가져옴,.
            hashtags: {
                select: {
                    hashtag:true
                }
            }
        }
    })

    console.log(target);

    if(!target) {
        return {
            ok:false,
            error: "Not allowed"
        }   
    }

    const newHashtagObjArray = createHashtagObjArray(caption);

    const updated = await client.photo.update({
        where: {
            id:photoId
        },
        data: {
            caption:caption,
            hashtags: {
                disconnect: target.hashtags,
                // ...(newHashtagObjArray.length > 0 && {hashtags: {connectOrCreate: newHashtagObjArray}})
                connectOrCreate: newHashtagObjArray
            }
        }
    })


    return {
        ok:true,
    }

}


export default {
    Mutation: {
        editPhoto: protectedResolver(editPhotoFn)
    }
}