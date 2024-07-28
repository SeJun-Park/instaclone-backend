import gql from "graphql-tag";

export default gql`

    type Mutation {
        editPhoto(photoId:Int!, caption:String!): MutationResponse!
    }

`