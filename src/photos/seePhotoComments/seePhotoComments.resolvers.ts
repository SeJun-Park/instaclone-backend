import { Context } from "../../types";

export default {
    Query: {
        seePhotoComments: async (root:any, args:{ photoId:number, myCursor?:number }, context:Context, info:any) => {

            const { client } = context;
            const { photoId, myCursor } = args;

            const comments = await client.comment.findMany({
                where: {
                    photoId:photoId
                },
                orderBy: {
                    createdAt: "asc"
                },
                skip: myCursor ? 1 : 0,
                    // myCursor 가 존재하면 1개를 스킵, 그렇지 않으면 0개를 스킵
                take: 5,
                ...(myCursor && {cursor: {id:myCursor}}),
                // cursor : {id:cursor} --> cursor 값으로 id를 사용할 것이며 그 id 값은 인자로 받은 myCursor로 사용할 것.
            })

            // const comments = await client.photo.findUnique({
            //     where: {
            //         id:photoId
            //     }
            // }).comments({
            //     skip: myCursor ? 1 : 0,
            //         // myCursor 가 존재하면 1개를 스킵, 그렇지 않으면 0개를 스킵
            //     take: 5,
            //     ...(myCursor && {cursor: {id:myCursor}}),
            //     // cursor : {id:cursor} --> cursor 값으로 id를 사용할 것이며 그 id 값은 인자로 받은 myCursor로 사용할 것.
            //     // id 말고 unique 한 값 아무거나 됨.
            // })

            return comments;

        }
    }
}