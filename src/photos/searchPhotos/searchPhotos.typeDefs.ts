import gql from "graphql-tag";

export default gql`
    type Query {
        searchPhotos(keyword:String!, offset:Int!): [Photo]
    }
`