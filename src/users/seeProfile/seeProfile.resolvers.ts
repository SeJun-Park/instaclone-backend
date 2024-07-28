import { Context } from "../../types";

export default {
    Query: {
                seeProfile: async (root:any, args:{ username:string }, context:Context, info:any) => {

                    const { client } = context;
                    const { username } = args;

                    // console.log(client);
                    const user = await client.user.findUnique({
                        where: {
                            username:username
                            //  기존 username과 args.username이 같은 게 있으면 뱉어냄, username 이라고만 해도 됨.
                        },
                        include: {
                            followers: true,
                            followings: true
                        }
                    })
        
                    return user;
                }
            }
}
