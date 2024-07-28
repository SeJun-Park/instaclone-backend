import { Context } from "../../types";
import { protectedResolver } from "../../users/users.utils";

const seeFeedFn = async (root:any, args:{ offset:number }, context:Context, info:any) => {

    const { loggedInUser, client } = context;
    const { offset } = args;

    const feeds = await client.photo.findMany({
        where: {
            OR: [
                {
                    user: {
                        followers: {
                            some: {
                                id:loggedInUser.id
                            }
                        }
                    }
                },
                {
                    user: {
                        id:loggedInUser.id
                    }
                    // userId:loggedInUser.id 로 작성할 수도 있음.
                }
            ]
        },
        orderBy: {
            createdAt: "desc"
        },
        // skip: myCursor ? 1 : 0,
        // myCursor 가 존재하면 1개를 스킵, 그렇지 않으면 0개를 스킵
        skip: offset,
        take: 3,
        // ...(myCursor && {cursor: {id:myCursor}}),
        // cursor : {id:cursor} --> cursor 값으로 id를 사용할 것이며 그 id 값은 인자로 받은 myCursor로 사용할 것.
        // id 말고 unique 한 값 아무거나 됨.
    })

    return feeds;

}

export default {
    Query: {
        seeFeed: protectedResolver(seeFeedFn)
    }
}