import gql from "graphql-tag";

export default gql`

    type Mutation {
        unfollowUser(username:String!): MutationResponse!
    }

`