import { Context } from "../types";

export default {
    Photo: {
        user: async (root:any, args:any, context:Context, info:any) => {
            const { client } = context;
            const user = await client.user.findUnique({
                where: {
                    id:root.userId
                }
            })
            return user;
        },

        hashtags: async (root:any, args:any, context:Context, info:any) => {
            const { client } = context;
            const hashtags = await client.hashtag.findMany({
                where: {
                    photos: {
                        some: {
                            id:root.id
                        }
                    }
                }
            })
            return hashtags;
        },
        totalLikes: async (root:any, args:any, context:Context, info:any) => {
            const { client } = context;

            const totalLikes = await client.like.count({
                where: {
                    photoId: root.id
                }
            })

            return totalLikes;

        },
        comments: async (root:any, args:any, context:Context, info:any) => {
            const { client } = context;

            // const comments = await client.photo.findUnique({
            //     where: {
            //         id: root.id
            //     }
            // }).comments();

            const comments = await client.comment.findMany({
                where: {
                    photoId: root.id
                },
                include: {
                    user:true
                }
            })

            return comments;

        },
        totalComments: async (root:any, args:any, context:Context, info:any) => {
            const { client } = context;

            const totalComments = await client.comment.count({
                where: {
                    photoId: root.id
                }
            })

            return totalComments;

        },
        isMine: async (root:any, args:any, context:Context, info:any) => {

            const { loggedInUser } = context;

            if(!loggedInUser) {
                return false
            }

            return (root.userId === loggedInUser.id)

        },
        isLiked: async (root:any, args:any, context:Context, info:any) => {

            const { loggedInUser, client } = context;

            if(!loggedInUser) {
                return false
            }

            const like = await client.like.findUnique({
                where: {
                    photoId_userId: {
                        photoId:root.id,
                        userId:loggedInUser.id
                    }
                },
                select: {
                    id:true
                }
            })

            if(like) {
                return true;
            } else {
                return false
            }
        },
    },
    Hashtag: {
        totalPhotos: async (root:any, args:any, context:Context, info:any) => {

            const { client } = context;

            const totalPhotos = await client.photo.count({
                where: {
                    hashtags: {
                        some: {
                            id:root.id
                        }
                    }
                }
            })

            return totalPhotos;
        },

        photos: async (root:any, args:{ page:number }, context:Context, info:any) => {

            const { client } = context;
            const { page } = args;

            // const photos = await client.photo.findMany({
            //     where: {
            //         hashtags: {
            //             some: {
            //                 id:root.id
            //             }
            //         }
            //     }
            // })

            const photos = await client.hashtag.findUnique({
                where: {
                    id:root.id
                }
            }).photos({
                skip: (page-1)*5,
                take:5,
            });

            return photos;

        }
    },
    Comment: {
        isMine: async (root:any, args:any, context:Context, info:any) => {
            
            const { loggedInUser } = context;

            if(!loggedInUser) {
                return false
            }

            return (root.userId === loggedInUser.id)
        }
    }
}