import { Context } from "../../types";

export default {
    Query: {
        seeHashtag: async (root:any, args:{ hashtag:string }, context:Context, info:any) => {
            const { client } = context;
            const { hashtag } = args;

            const hstg = await client.hashtag.findUnique({
                where: {
                    hashtag:hashtag
                }
            })

            return hstg;
        }
    }
}