import { gql } from "apollo-server-express";

export default gql`
  type SeePhotoLikesResult {
    ok: Boolean!
    error: String
    users: [User]
  }

  type Query {
    seePhotoLikes(id: Int!): SeePhotoLikesResult!
  }
`;
