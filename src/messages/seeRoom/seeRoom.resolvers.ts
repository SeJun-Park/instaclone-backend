import { Context } from "../../types";
import { protectedResolver } from "../../users/users.utils";

const seeRoomFn = async (root:any, args:{ roomId:number }, context:Context, info:any) => {

    const { loggedInUser, client } = context;
    const { roomId } = args;

    const room = await client.room.findFirst({
        where: {
            id:roomId,
            users: {
                some: {
                    id: loggedInUser.id
                    // roomId 를 가지고 있고, 그 안에 있는 사용자가 LoggedInUser 인 방을 찾는다는 의미.
                }
            }
        }
    })

    return room;

}

export default {
    Query: {
        seeRoom: protectedResolver(seeRoomFn)
    }
}