import gql from "graphql-tag";

export default gql`

    type Query {
        seeHashtag(hashtag:String!): Hashtag
    }

`