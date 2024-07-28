import GraphQLUpload, { FileUpload } from "graphql-upload/GraphQLUpload.mjs";
import { Context } from "../../types";
import { protectedResolver } from "../../users/users.utils";
import { createWriteStream } from "fs";
import { createHashtagObjArray } from "../photos.utils";
import { uploadToS3 } from "../../shared/shared.utils";

const uploadPhotoFn = async (root:any, args:{ file:Promise<FileUpload>, caption?:string }, context:Context, info:any) => {

    const { loggedInUser, client } = context;
    const { file, caption } = args;




    
    const fileUrl = await uploadToS3(file, loggedInUser.id, "photos")


    // const { filename, createReadStream } = await file;
    // const readStream = createReadStream();
    
    // const newFilename = `${loggedInUser.id}-${Date.now()}-${filename}`;

    // const writeStream = createWriteStream(process.cwd() + "/uploads/" + newFilename );
    // readStream.pipe(writeStream);
    // const fileUrl = `http://localhost:4001/static/${newFilename}`;




    const hashtagObjArray = createHashtagObjArray(caption);

    // let hashtagObjArray : any[] = [];

    // if(caption) {
    //     // parse caption -- #이 붙은 단어들을 hashtag들로 추출하고 있음.
    //     const hashtags = caption.match(/#[\w]+/g);
    //     if(hashtags) {
    //         const hashtagObjArray = hashtags.map((hashtag) => ({where:{hashtag:hashtag}, create:{hashtag:hashtag}}));
    //     }
    // }

    // get or create Hashtags
    const photo = client.photo.create({
        data: {
            user: {
                connect: {
                    id: loggedInUser.id
                }
            },
            file:fileUrl,
            caption:caption,
            // ...(hashtagObjArray.length > 0 && {hashtags: {connectOrCreate: hashtagObjArray}})
            hashtags: {
                connectOrCreate: hashtagObjArray
            }

        }
    })

    // save the photo with the parsed hashtags
    // add the photo to the hashtags

    return photo;
}

export default {

    Upload: GraphQLUpload,

    Mutation: {
        UploadPhoto: protectedResolver(uploadPhotoFn)
    }
}