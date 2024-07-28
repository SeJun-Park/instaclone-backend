import gql from "graphql-tag";

export default gql`

    type Photo {
        id: Int!
        user: User!
        # userId: String!
        # userId는 GraphQL 사이드에서는 필요가 없음,
        comments: [Comment]
        hashtags: [Hashtag]
        file: String!
        caption: String
        totalLikes: Int!
        totalComments: Int!
        isMine:Boolean!
        isLiked:Boolean!
        createdAt: String!
        updatedAt: String!
    }

    type Hashtag {
        id: Int!
        hashtag: String!
        photos(page:Int!): [Photo]
        # 이렇게 필드 속에 변수를 전달해줄 수도 있음. photos.resolvers 확인.
        createdAt: String!
        updatedAt: String!
        totalPhotos: Int!

    }

    type Like {
        id: Int!
        photo: Photo!
        user: User!
        createdAt: String!
        updatedAt: String!
    }

    type Comment {
        id: Int!
        payload: String!
        photo: Photo!
        user: User!
        isMine:Boolean!
        createdAt: String!
        updatedAt: String!
    }

`