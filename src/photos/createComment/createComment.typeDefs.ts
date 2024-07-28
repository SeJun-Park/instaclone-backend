import gql from "graphql-tag";

export default gql`

    type Mutation {
        createComment(photoId:Int!, payload:String!): MutationResponse!
    }

`