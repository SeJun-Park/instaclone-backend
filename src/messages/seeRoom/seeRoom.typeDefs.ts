import gql from "graphql-tag";

export default gql`

    type Query {
        seeRoom(roomId:Int!): Room!
    }

`