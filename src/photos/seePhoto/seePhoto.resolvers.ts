import { Context } from "../../types";

export default {
    Query: {
        seePhoto : async (root:any, args:{ photoId:number }, context:Context, info:any) => {
            const { client } = context;
            const { photoId } = args;

            const photo = await client.photo.findUnique({
                where: {
                    id:photoId
                }
            })

            return photo;
        }
    }
}