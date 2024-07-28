import { Context } from "../../types";

export default {
    Query: {
        seeFollowings: async (root:any, args:{ username:string, myCursor?:number }, context:Context, info:any) => {

            const { client } = context;
            const { username, myCursor } = args;

            const ok = await client.user.findUnique({where:{username:username}, select:{id:true}});

            // select 는 특정 값만 가져올 수 있또록 해줌, 단지 유저 존재 여부를 판단할 때 모든 값을 가져오는 건 비효율적이기 때문.

            if(!ok) {
                return {
                    ok: false,
                    error: "user Not Found"
                }
            }

            const followings = await client.user
                .findUnique({where:{username:username}})
                .followings({
                    skip: myCursor ? 1 : 0,
                    // myCursor 가 존재하면 1개를 스킵, 그렇지 않으면 0개를 스킵
                    take: 5,
                    ...(myCursor && {cursor: {id:myCursor}}),
                    // cursor : {id:cursor} --> cursor 값으로 id를 사용할 것이며 그 id 값은 인자로 받은 myCursor로 사용할 것.
                    // id 말고 unique 한 값 아무거나 됨.
                })

            return {
                ok:true,
                followings:followings
            }

        }
    }
}