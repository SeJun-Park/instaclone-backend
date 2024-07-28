import { Context } from "../../types";

export default {
    Query: {
        seeFollowers: async(root:any, args:{ username:string, page:number }, context:Context, info:any) => {

            const { client } = context;
            const { username, page } = args;

            const ok = await client.user.findUnique({where:{username:username}, select:{id:true}});

            // select 는 특정 값만 가져올 수 있또록 해줌, 단지 유저 존재 여부를 판단할 때 모든 값을 가져오는 건 비효율적이기 때문.

            if(!ok) {
                return {
                    ok: false,
                    error: "user Not Found"
                }
            }

            const followers = await client.user
                .findUnique({where:{username:username}})
                .followers({
                    skip: (page-1)*5,
                    take:5,
                })


            // const bFollower = await client.user.findMany({
            //     where: {
            //         followings: {
            //             some: {
            //                 username:username
            //             }
            //             // prisma 는 세 개의 operator를 가지고 있음. 
            //             // some : 필터링되는 요소에 하나 이상이 부팝하는 값들을 리턴해줌, every : 필터되는 요소에 완전히 부합하는 값들을 리턴해줌, none : 필터 조건에 매치되는 모든 관계된 값을 제외하고 return 해 줌.
            //             // 코드를 해석하자면, user 중에 (findMnay) 가지고 있는 following 안에 username이  args.username 이랑 같은 게 있는 user들을 찾고 있음.
            //         }
            //     }
            // })

            const totalFollowers = await client.user.count({
                where: {
                    followings: {
                        some: {
                            username:username
                        }
                    }
                }
            })

            return {
                ok:true,
                followers: followers,
                totalPages: Math.ceil(totalFollowers / 5)
            }
        }
    }
}