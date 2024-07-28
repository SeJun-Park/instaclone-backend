import bcrypt from "bcrypt";
import { Context } from "../../types";

export default {
    Mutation: {
        createAccount: async (root:any, args:{
                                                firstName:string, 
                                                lastName?:string, 
                                                username:string, 
                                                email:string, 
                                                password:string, 
                                                }, 
                                context:Context, info:any) => {

            const { client } = context;
            const { firstName, lastName, username, email, password } = args;
        
           try {
                // check username or email unique -- findUnique or findFirst -- findUnique는 unique한 필드만 찾음.
                const existingUser = await client.user.findFirst({
                    where: {
                        // AND, OR, NOT 과 같은 연산자를 조건으로 사용할 수 있음.
                        OR: [
                            {
                                username:username,
                                // 기존 username과 args.username이 같은 게 있으면 true, username 이라고만 써도 됨.
                            },
                            {
                                email:email,
                                // 기존 email과 args.email이 같은 게 있으면 true, email 이라고만 써도 됨.
                            }
                        ]
                    }
                })

                if(existingUser) {
                    throw new Error("This username/email is already taken");
                }

                // hash password -- 10은 saltRound, 얼마나 이 함수를 돌릴 건지.

                const uglyPassword = await bcrypt.hash(password, 10);

                // save and return the user

                const creatingUser = await client.user.create({
                    data: {
                        username:username,
                        email:email,
                        firstName:firstName,
                        lastName:lastName, 
                        password:uglyPassword
                        
                    }
                })

                return {
                    ok: true
                }

           } catch(error) {
            
            // console.log(error);
            return {
                ok: false,
                error: "Can't create account"
            }


           }
        },
    }
}