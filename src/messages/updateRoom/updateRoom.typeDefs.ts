import gql from "graphql-tag";

export default gql`

    type Subscription {
        updateRoom(roomId:Int!): Message
    }

`