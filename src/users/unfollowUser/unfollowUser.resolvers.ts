import { Context } from "../../types";
import { protectedResolver } from "../users.utils";

const unfollowUserFn = async (root:any, args:{ username:string }, context:Context, info:any) => {

    const { loggedInUser, client } = context;
    const { username } = args;

    const ok = await client.user.findUnique({
        where: {
            username:username
        }
    })

    if(!ok) {
        return {
            ok:false,
            error: "That user does not exist",
        }
    }

    await client.user.update({
        where: { 
            id: loggedInUser.id
        },
        data: {
            followings: {
                disconnect: {
                    // many to many fields 인 관계에 대해서는 connect, disconnect 등의 옵션이 제공되는 듯.
                    // unique 한 필드로만 구별할 수 있음. id, username, email 등
                    // 팔로잉만 하면 팔로워는 자동으로 업데이트 됨. (many to many 관계로 설정했으므로)
                    username:username
                }
            }
        }
    })

    return {
        ok:true,
    }
}


export default {
    Mutation: {
        unfollowUser: protectedResolver(unfollowUserFn)
    }
}