import gql from "graphql-tag";

export default gql`

    type Query {
        # seePhotoLikes(photoId:Int!, myCursor:Int): [User]
        seePhotoLikes(photoId:Int!, offset:Int!): [User]
    }

`