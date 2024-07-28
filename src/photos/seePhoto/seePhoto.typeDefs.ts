import gql from "graphql-tag";

export default gql`

    type Query {
        seePhoto(photoId:Int!): Photo
    }

`