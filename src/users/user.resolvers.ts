import { Context } from "../types";

export default {
    User: {
        totalFollowings: async (root:any, args:any, context:Context, info:any) => {

            const { client } = context;

            const totalFollowings = await client.user.count({
                where: {
                    followers: {
                        some: {
                            id:root.id
                        }
                    }
                }
            })

            return totalFollowings;
        },

            // return 에 집어넣을 때는 async, await 안해도 됨

        totalFollowers: async (root:any, args:any, context:Context, info:any) => {

            const { client } = context;

            const totalFollowers = await client.user.count({
                where: {
                    followings: {
                        some: {
                            id: root.id
                        }
                    }
                }
            })

            return totalFollowers;
        },

        isMe: (root:any, args:any, context:Context, info:any) => {

            const { loggedInUser } = context;

            if(!loggedInUser) {
                return false
            }

            return (root.id === loggedInUser.id)
        },

        isFollowing: async (root:any, args:any, context:Context, info:any) => {

            const { loggedInUser, client } = context;

            if(!loggedInUser) {
                return false;
            }

            const following = await client.user.findUnique({
                where: {
                    username:loggedInUser.username
                }
            }).followings({where:{id:root.id}})
            // loggedInUser 의 user를 찾고, 그 user의 following 안에 현재 보고 있는 User의 이름이 들어가 있는 지 확인하고 있음.
            // 이럴거면 count를 써도 됨.

            return (following?.length !== 0)
        },
        photos: async (root:any, args:{ offset:number }, context:Context, info:any) => {

            const { client } = context;
            const { offset } = args;

            // console.log("work")
            // console.log("cursor:", myCursor);

            const photos = await client.user.findUnique({where:{id:root.id}}).photos({
                skip: offset,
                    // myCursor 가 존재하면 1개를 스킵, 그렇지 않으면 0개를 스킵
                take: 3,
                // ...(myCursor && {cursor: {id:myCursor}}),
                // cursor : {id:cursor} --> cursor 값으로 id를 사용할 것이며 그 id 값은 인자로 받은 myCursor로 사용할 것.
                // id 말고 unique 한 값 아무거나 됨.
                orderBy: {
                    createdAt: 'desc'
                }
            })

            return photos;

        }
    }
}