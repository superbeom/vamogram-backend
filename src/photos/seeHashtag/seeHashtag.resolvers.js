import client from "../../client";

export default {
  Query: {
    seeHashtag: (_, { keyword }) =>
      client.hashtag.findUnique({
        where: {
          hashtag: keyword,
        },
      }),
  },
};
