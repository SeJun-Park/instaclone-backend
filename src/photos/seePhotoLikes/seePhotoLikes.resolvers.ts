import { Context } from "../../types";

export default {
    Query: {
        seePhotoLikes: async (root:any, args:{ photoId:number, offset:number }, context:Context, info:any) => {

            const { client } = context;
            const { photoId, offset } = args;

            const likes = await client.like.findMany({
                where: {
                    photoId:photoId
                },
                select: {
                    user: true
                },
                orderBy: {
                    createdAt: "desc"
                },
                skip: offset,
                // skip: myCursor ? 1 : 0,
                    // myCursor 가 존재하면 1개를 스킵, 그렇지 않으면 0개를 스킵
                take: 10,
                // ...(myCursor && {cursor: {id:myCursor}}),
                // cursor : {id:cursor} --> cursor 값으로 id를 사용할 것이며 그 id 값은 인자로 받은 myCursor로 사용할 것.
                    // id 말고 unique 한 값 아무거나 됨.
            })

            // 여기에도 Pagination 가능할 듯?

            // console.log(likes);

            const likeUsers = likes.map((userObj) => userObj.user);

            // console.log(likeUsers);

            return likeUsers;

        }
    }
}