import { withFilter } from "graphql-subscriptions";
import { NEW_MESSAGE } from "../../constants";
import { Context } from "../../types";
  

export default {
    Subscription: {
        updateRoom: {
            subscribe: async (root:any, args:{ roomId:number }, context:Context, info:any) => {

                const { loggedInUser, client, pubsub } = context;
                const { roomId } = args;

                const room = await client.room.findFirst({
                    where: {
                        id:roomId,
                        users: {
                            some: {
                                id: loggedInUser.id
                            }
                        }
                    },
                    select: {
                        id:true
                    }
                })

                if(!room) {
                    throw new Error("You shall not see this")
                    // null 을 반환하면 안됨, subscription 함수는 Iterator 을 반환해야 함.
                }

                // console.log("context는", context);
                // console.log("hehe", loggedInUser);

                
                return withFilter(
                    (root, args, context, info) => pubsub.asyncIterator([NEW_MESSAGE]),
                        // NEW_MESSAGE 에 관한 이벤트를 리스닝한다는 뜻, 이벤트 이름의 배열로 작성해야 함.
                        // 우리는 sendMessage Mutation을 구독할 것. -->sendMessage.resolvers.ts 확인.
                    
                    (payload, variables, context) => {
                        // payload 에는 pubsub을 publish 할 때 넘어온 객체가 들어있음 {updateRoom:newMessage}
                        // variables 에는 updateRoom의 args가 담겨있음.
                        // withfilter의 두 번쨰 인자 함수는 Publish 될 때 작동함. 유저가 리스닝을 시작하기 전. newMessage가 발생할 때만!
                        return (payload.updateRoom.roomId === variables.roomId)
                    }
                )(root, args, context, info);
                // subscribe는 resolver를 Return 해야 함. 
                // async 함수 안에서 Withfilter를 호출하지 않는다면, subscribe: withFilter() 로 끝낼 수 있음. 그치만 async 안에서 호출할 경우 return withfilter(...)(root,args,context,info) 의 형태로 반환해야함.
            }
            
        }
    }
}