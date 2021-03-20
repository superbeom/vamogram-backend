import { gql } from "apollo-server-express";

export default gql`
  # User가 로그인 상태가 아니거나 또는 Room이 없을 수도 있어 - 필수 x
  type Query {
    seeRooms: [Room]
  }
`;
