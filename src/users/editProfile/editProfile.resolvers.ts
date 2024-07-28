import bcrypt from "bcrypt";
import { createWriteStream } from "fs";
import { protectedResolver } from "../users.utils";
import GraphQLUpload, { FileUpload } from "graphql-upload/GraphQLUpload.mjs";
import { Context } from "../../types";
import { uploadToS3 } from "../../shared/shared.utils";


const editProfileFn = async (root:any, 
                            args:{ 
                                firstName?:string, 
                                lastName?:string, 
                                username?:string, 
                                email?:string, 
                                password?:string, 
                                bio?:string, 
                                avatar?:Promise<FileUpload>
                            }, 
                            context:Context, info:any) => {

                    const { loggedInUser, client } = context;
                    const { firstName, lastName, username, email, password, bio, avatar } = args;

                    // const { id } =  await jwt.verify(token, process.env.SECRET_KEY);
                    // 로그인 할 때 --> jwt.sign --> payload, SECRET_KEY 를 넣어줌 --> string token 이 됨.
                    // 검증 할 때 --> jwt.verify --> token, SECRET_KEY 를 넣어줌 --> payload, ... 를 포함하는 object 를 뱉어냄.

                    // console.log(loggedInUser);
                    // console.log(avatar)

                    // if(!loggedInUser) {
                    //     throw new Error("Need Login");
                    // }

                    // protectedResolver(loggedInUser);

                    // 유저가 로그인 되어있지 않을 때는 아래 코드를 실행하지 않도록.

                    const target = await client.user.findUnique({
                        where: {
                            username:username
                        },
                        select: {
                            id: true
                        }
                    })
                
                    if(!target) {
                        return {
                            ok:false,
                            error: "user not found"
                        }
                    } else if(target.id !== loggedInUser.id) {
                        return {
                            ok:false,
                            error: "Not authorized"
                        }
                    } 
                    

                    let avatarUrl = null;
                    if(avatar) {

                        avatarUrl = await uploadToS3(avatar, loggedInUser.id, "avatars");

                        // const { filename, createReadStream } = await avatar;
                        // const readStream = createReadStream();
                        
                        // const newFilename = `${loggedInUser.id}-${Date.now()}-${filename}`;

                        // const writeStream = createWriteStream(process.cwd() + "/uploads/" + newFilename );
                        // readStream.pipe(writeStream);
                        // avatarUrl = `http://localhost:4001/static/${newFilename}`;
                    }
                    // console.log(avatarUrl)

                    let uglyPassword = null;
                    if(password) {
                        uglyPassword = await bcrypt.hash(password, 10)
                    }
                    
                    const updatedUser = await client.user.update({
                        where: {
                            id: loggedInUser.id
                        },
                        data: {
                            firstName:firstName,
                            lastName:lastName,
                            username:username,
                            email:email,
                            bio:bio,
                            ...(uglyPassword && {password: uglyPassword}),
                            // ...(조건) --> 조건에 따라 해당 값이 있을 수도 없을 수도 있을 때. 조건에 맞으면 ..., {} 가 사라진다고 이해하면 됨.
                            // 위와 같은 경우 uglyPassword가 null이 아니면 {password:uglyPassword}를 리턴함.
                            ...(avatarUrl && {avatar: avatarUrl}),
                        }
                    })
                    
                    // console.log(updatedUser);
                    // 아래와 같이 검증할 수도 있지만 위와 같이 검증할 수도 있음. 지금은 두 번 검증하고 있는 상ㅌㅐ.

                    if(updatedUser.id) {
                        return {
                            ok: true,
                        }
                    } else {
                        return {
                            ok: false,
                            error: "Cannot Update Profile"
                        }
                    }
                }

export default {

    Upload: GraphQLUpload,

    Mutation: {
        editProfile: protectedResolver(editProfileFn)
    }
}