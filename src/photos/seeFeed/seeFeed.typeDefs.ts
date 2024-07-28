import gql from "graphql-tag";

export default gql`

    type Query {
        # seeFeed(myCursor:Int): [Photo] --> web
        seeFeed(offset:Int!): [Photo]
    }

`