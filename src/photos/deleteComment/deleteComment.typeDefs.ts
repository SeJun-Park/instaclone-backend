import gql from "graphql-tag";

export default gql`

    type Mutation {
        deleteComment(commentId:Int!): MutationResponse!
    }

`