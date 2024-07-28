import gql from "graphql-tag";

export default gql`

    type Mutation {
        toggleLike(photoId:Int!): MutationResponse!
    }

`