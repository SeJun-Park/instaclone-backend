import { Context } from "../types";

export default {
    Room: {
        users: async (root:any, args:any, context:Context, info:any) => {
            
            const { client } = context;
            
            const users = await client.room.findUnique({
                where: {
                    id: root.id
                }
            }).users()

            return users;

        },

        messages: async (root:any, args:{ myCursor?:number }, context:Context, info:any) => {

            const { client } = context;
            const { myCursor } = args;

            const messages = await client.message.findMany({
                where: {
                    roomId: root.id
                },
                orderBy: {
                    createdAt: "desc"
                },
                skip: myCursor ? 1 : 0,
                // myCursor 가 존재하면 1개를 스킵, 그렇지 않으면 0개를 스킵
                take: 5,
                ...(myCursor && {cursor: {id:myCursor}}),
                // cursor : {id:cursor} --> cursor 값으로 id를 사용할 것이며 그 id 값은 인자로 받은 myCursor로 사용할 것.
                // id 말고 unique 한 값 아무거나 됨.

            })

            return messages;

        },

        totalUnread: async (root:any, args:any, context:Context, info:any) => {

            const { loggedInUser, client } = context;

            if(!loggedInUser) {
                return 0;
            }

            const totalUnread = await client.message.count({
                where: {
                    read:false,
                    roomId: root.id,
                    // NOT: {
                    //     userId: loggedInUser.id
                    // }
                    // 아래와 같은 방식, 내가 보내지 않은 메시지들만 확인하고 있음.
                    id: {
                        not:loggedInUser.id
                    }
                }
            })

            return totalUnread;
        }
    },

    Message: {
        user: async (root:any, args:any, context:Context, info:any) => {
            
            const { client } = context;

            // include 대신 이렇게 Computed Field로 구현 중
            
            // const user = await client.user.findUnique({
            //     where: {
            //         id: root.userId
            //     }
            // })

            const user = await client.message.findUnique({
                where: {
                    id: root.id
                }
            }).user()

            return user;
        },

        room: async (root:any, args:any, context:Context, info:any) => {
            
            const { client } = context;

            // include 대신 이렇게 Computed Field로 구현 중
            
            // const room = await client.room.findUnique({
            //     where: {
            //         id: root.roomId
            //     }
            // })

            const room = await client.message.findUnique({
                where: {
                    id:root.id
                }
            }).room()

            return room;
        }
    }
}