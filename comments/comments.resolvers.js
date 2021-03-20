import client from "../client";

export default {
  Comment: {
    user: ({ userId }) =>
      client.user.findUnique({
        where: {
          id: userId,
        },
        select: {
          username: true,
        },
      }),
  },
};
