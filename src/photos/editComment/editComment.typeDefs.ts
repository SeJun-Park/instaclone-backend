import gql from "graphql-tag";

export default gql`

    type Mutation {
        editComment(commentId:Int!, payload:String!): MutationResponse!
    }

`