import client from "../../client";

export default {
  Query: {
    seeFollowers: async (_, { username, page }) => {
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

        const followers = await client.user
          .findUnique({ where: { username } })
          .followers({
            skip: (page - 1) * 5,
            take: 5,
          });

        const numOfFollowers = await client.user.count({
          where: {
            following: {
              some: {
                username,
              },
            },
          },
        });

        return {
          ok: true,
          followers,
          totalPage: Math.ceil(numOfFollowers / 5),
        };
      } catch (error) {
        console.log("Error @seeFollowers.resolvers: ", error.message);

        return {
          ok: false,
          error: "Can not see followers.",
        };
      }
    },
  },
};
