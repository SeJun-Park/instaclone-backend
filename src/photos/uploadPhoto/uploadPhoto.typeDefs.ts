import gql from "graphql-tag";

export default gql`

    scalar Upload

    type Mutation {
        UploadPhoto(file:Upload!, caption:String): Photo!
    }

`