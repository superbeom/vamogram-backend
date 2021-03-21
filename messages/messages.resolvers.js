import client from "../client";

export default {
  Room: {
    users: ({ id }) =>
      client.user.findMany({
        where: {
          rooms: {
            some: {
              id,
            },
          },
        },
        select: {
          username: true,
          avatar: true,
        },
      }),

    /* Pagination 추가하기!! */
    messages: ({ id }) =>
      client.message.findMany({
        where: {
          roomId: id,
        },
        select: {
          payload: true,
        },
      }),

    unreadTotal: ({ id }, _, { loggedInUser }) => {
      if (!loggedInUser) {
        return 0;
      }

      return client.message.count({
        where: {
          roomId: id,
          read: false,
          user: {
            id: {
              not: loggedInUser.id,
            },
          },
        },
      });
    },
  },

  Message: {
    user: ({ id }) =>
      client.user.findFirst({
        where: {
          messages: {
            some: {
              id,
            },
          },
        },
        select: {
          username: true,
          avatar: true,
        },
      }),
  },
};
