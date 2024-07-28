import gql from "graphql-tag";

export default gql`

        type SeeFollowingsResult {
            ok: Boolean!
            error: String
            followings: [User]
        }

    type Query {
        seeFollowings(username:String! myCursor:Int): SeeFollowingsResult!
    }

`