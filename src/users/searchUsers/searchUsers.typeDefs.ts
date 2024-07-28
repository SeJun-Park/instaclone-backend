import gql from "graphql-tag";

export default gql`

    type Query {
        searchUsers(keyword:String! offset:Int!): [User]
    }
`