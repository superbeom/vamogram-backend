import client from "../../client";

export default {
  Query: {
    seeFollowing: async (_, { username, lastId }) => {
      try {
        const existUser = await client.user.findUnique({
          where: { username },
          select: { id: true },
        });

        if (!existUser) {
          return {
            ok: false,
            error: "User not found",
          };
        }

        const following = await client.user
          .findUnique({ where: { username } })
          .following({
            skip: lastId ? 1 : 0,
            take: 5,
            ...(lastId && { cursor: { id: lastId } }),
          });

        return {
          ok: true,
          following,
        };
      } catch (error) {
        console.log("Error @seeFollowers.resolvers: ", error.message);

        return {
          ok: false,
          error: "Can not see following.",
        };
      }
    },
  },
};
