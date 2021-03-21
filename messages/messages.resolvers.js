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
          user: {
            select: {
              username: true,
              avatar: true,
            },
          },
        },
      }),
  },
};
