import { Context } from "../../types";
import { protectedResolver } from "../users.utils";

const meFn = async (root:any, args:any, context:Context, info:any) => {

    const { loggedInUser, client } = context;

    const user = await client.user.findUnique({
        where: {
            id: loggedInUser.id
        }
    })

    return user;

}

export default {
    Query: {
        me: protectedResolver(meFn)
    }
}