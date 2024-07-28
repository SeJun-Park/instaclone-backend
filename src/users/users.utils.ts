import jwt from "jsonwebtoken";
import client from "../client";
import { Context, Resolver } from "../types";


export const getUser = async (token:string) => {
    try {

        if(!token) {
            return null;
        }

        const jwtPayload = await jwt.verify(token, process.env.SECRET_KEY as string) as any;
        console.log(jwtPayload);
        const user = await client.user.findUnique({
            where: {
                id: jwtPayload["id"]
            }
        });
    
        if(user) {
            return user;
        }
    
        return null;

    } catch {
        return null;
    }
}

// export const protectedResolver = (user) => {
//     if(!user) {
//         throw new Error("you need to login");
//     }
// }


// export const protectedResolver = (resolver) => (root, args, context, info) => {
//     if(!context.loggedInUser) {
//         return {
//             ok:false,
//             error: "Please Log in to perform this action"
//         }
//     }

//     return resolver;
// }

// [resolver 함수]를 인자로 받은 후, [(root, args, context, info) 를 받고 조건에 따라 {} 객체 또는 resolver 함수를 리턴하는 함수] 를 리턴하는 함수.
// 를 설정하여 보호해야 할 graphQL resolver를 감싸줌.



export function protectedResolver(resolver:Resolver) {

    console.log("protectedResolve is calleed")

    return function(root:any, args:any, context:Context, info:any) {

        console.log("protectedResolve is calleed2")

        if(!context.loggedInUser) {
            const isQuery = (info.operation.operation === "query")

            if(isQuery) {
                console.log("isQuery")
                return null;
            } else {
                return {
                    ok:false,
                    error: "Please Log in to perform this action"
                }
            }
                }
            
        return resolver(root, args, context, info);
    }
}