import gql from "graphql-tag";

export default gql`

    type Mutation {
        readMessage(messageId:Int!): MutationResponse!
    }

`