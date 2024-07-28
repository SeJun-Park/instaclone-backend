import { Context } from "../../types";

export default {
    Query: {
        searchPhotos: async (root:any, args:{ keyword:string, offset:number }, context:Context, info:any) => {
            
            const { client } = context;
            const { keyword, offset } = args;

            const photos = await client.photo.findMany({
                where: {
                    caption: {
                        contains: keyword
                    }
                },
                skip: offset,
                // skip: myCursor ? 1 : 0,
                        // myCursor 가 존재하면 1개를 스킵, 그렇지 않으면 0개를 스킵
                take: 5,
                // ...(myCursor && {cursor: {id:myCursor}})
                // cursor : {id:cursor} --> cursor 값으로 id를 사용할 것이며 그 id 값은 인자로 받은 myCursor로 사용할 것.
                // id 말고 unique 한 값 아무거나 됨.
            })

            return photos;
        }
    }
}