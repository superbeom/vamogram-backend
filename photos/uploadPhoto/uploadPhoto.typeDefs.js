import { gql } from "apollo-server-express";

export default gql`
  type UploadPhotoResult {
    ok: Boolean!
    error: String
    photo: Photo
  }

  type Mutation {
    uploadPhoto(file: String!, caption: String): UploadPhotoResult!
  }
`;
