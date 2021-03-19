import { gql } from "apollo-server-express";

export default gql`
  type Query {
    seeHashtag(keyword: String!): Hashtag
  }
`;
