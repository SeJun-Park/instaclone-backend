import gql from "graphql-tag";

export default gql`

    type Room {
        id: Int!
        users: [User]
        messages(myCursor:Int): [Message]
        totalUnread: Int!
        createdAt: String!
        updatedAt: String!
    }

    type Message {
        id: Int!
        user: User!
        room: Room!
        payload: String!
        read: Boolean!
        createdAt: String!
        updatedAt: String!
    }

`