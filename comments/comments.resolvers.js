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

    isMine: ({ userId }, _, { loggedInUser }) => {
      if (!loggedInUser) {
        return false;
      }

      return userId === loggedInUser.id;
    },
  },
};
