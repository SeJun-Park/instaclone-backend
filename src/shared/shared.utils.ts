// import AWS from "aws-sdk";
// import { FileUpload } from "graphql-upload/processRequest.mjs";

// AWS.config.update({
//     credentials: {
//         accessKeyId: process.env.AWS_ACCESS_KEY as string,
//         secretAccessKey: process.env.AWS_SECRET_KEY as string
//     }
// })

// export const uploadToS3 = async (file:Promise<FileUpload>, userId:number, folderName:string) => {

//     const { filename, createReadStream } = await file;
//     const readStream = createReadStream();
//     const keyName = `${folderName}/${userId}}-${Date.now()}-${filename}`
//     // 앞에 /uploads 같은 걸 추가하면 폴더를 생성하고 그 안에 파일을 저장해줌.

//     const { Location } = await new AWS.S3().upload({
//         Body: readStream,
//         //file (stream)
//         Bucket: "instaclone-uploads-sj",
//         Key: keyName,
//         ACL: "public-read"
//     }).promise();


//     return Location;
// }


// 아래가 최신 버전.


import { S3Client } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import { FileUpload } from "graphql-upload/processRequest.mjs";

const s3Client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY as string,
        secretAccessKey: process.env.AWS_SECRET_KEY as string
    }
});

export const uploadToS3 = async (file: Promise<FileUpload>, userId: number, folderName:string) => {
    const { filename, createReadStream } = await file;
    const readStream = createReadStream();
    const keyName = `${folderName}/${userId}-${Date.now()}-${filename}`;

    const upload = new Upload({
        client: s3Client,
        params: {
            Bucket: "instaclone-uploads-sj",
            Key: keyName,
            Body: readStream,
            ACL: "public-read",
        }
    });

    try {
        await upload.done();
        return `https://instaclone-uploads-sj.s3.${process.env.AWS_REGION}.amazonaws.com/${keyName}`;
    } catch (error) {
        console.error(error);
        throw new Error("Failed to upload photo");
    }
}
 