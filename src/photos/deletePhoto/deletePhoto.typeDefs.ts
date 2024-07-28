import gql from "graphql-tag";

export default gql`

    type Mutation {
        deletePhoto(photoId:Int!): MutationResponse!
    }

`