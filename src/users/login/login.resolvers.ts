import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Context } from "../../types";

export default {
    Mutation: {

        login: async (root:any, args:any, context:Context, info:any) => {
            // find user with args.username

            const { client } = context;

            const user = await client.user.findFirst({
                where: {
                    username:args.username
                }
            })

            if(!user) {
                return {
                    ok: false,
                    error: "User not found"
                }
            }

            // check password with args.password

            const passwordCheck = await bcrypt.compare(args.password, user.password);
                // 여기서 user.password 는 hash된 password
                // console.log(passwordCheck)
            if(!passwordCheck) {
                return {
                    ok: false,
                    error: "Incorrect Password"
                }
            }

            // issue a token and send it to the user
                // jsonwebtoken --> token 의 한 종류, 모든 곳에 사용 가능한 유명한 패키지.
                // npm i jsonwebtoken
                // 핵심은 유저는 토큰을 저장해놓고, 유저가 뭘 원할 때마다 우리한테 토큰을 보낼 것. 우리가 토큰을 받으면 그 토큰이 가지고 있는 id를 확인하고, 토큰이 우리가 서명한 토큰인 지 확인해야 함.
                // 쿠키, 세션과는 다른 개념. 토큰은 서버가 프론트엔드에 연결되어 있지 않을 때 혹은 따로 떨어져있는 경우 사용함. 쿠키나 세션은 서버와 프론트엔드가 같은 곳에 있을 때 사용하기 적합함.

            const token = await jwt.sign({id:user.id}, process.env.SECRET_KEY as string)
                // jwt.sign 안에는 Payload, secretOrPrivatekey가 들어감.
                // private key는 말 그대로 비공개 상태의 어떤 키, env에 작성해야 함.
                // password generator 의 도움을 받을 수도 있음. (패스워드 만들어주는 사이트)
                // expires 등 더 많은 조건을 설정하거나 정보가 궁금하다면 jwt.io 확인.
                // 토큰은 비밀이 아니라 유저가 누군 지 알수 있도록 하는 것이고, 토큰은 누구나 만들 수 있음. 단, 우리가 우리의 시그니처로 서명을 해서 나중ㅇ에 우리한테 온 이 토큰이 우리가 서명한 것이 맞고 다른 사람이 변경하지 않았다는 걸 확인헤야 함.

            return {
                ok:true,
                token:token
                // token 이라고만 써도 됨.
            }

        }
    }
}