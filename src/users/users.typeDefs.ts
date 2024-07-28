import gql from "graphql-tag";

export default gql`

        type User {
            id: Int!
            firstName: String!
            lastName: String
            username: String!
            email: String!
            bio: String
            avatar: String
            followings: [User]
            followers: [User]
            totalFollowers: Int!
            totalFollowings: Int!
            isFollowing: Boolean!
            isMe: Boolean!
            # photos(myCursor:Int): [Photo]
            photos(offset:Int!): [Photo]
            createdAt: String!
            updatedAt: String!
        }

`;