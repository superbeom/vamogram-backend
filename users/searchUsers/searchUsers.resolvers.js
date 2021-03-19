import client from "../../client";

export default {
  Query: {
    searchUsers: async (_, { keyword }) => {
      try {
        if (keyword.length < 3) {
          return {
            ok: false,
            error: "Please write at least 3 characters.",
          };
        }

        /* Pagination 추가하기!! */
        const users = await client.user.findMany({
          where: {
            username: {
              contains: keyword.toLowerCase(),
            },
          },
        });

        return {
          ok: true,
          users,
        };
      } catch (error) {
        console.log("Error @searchUsers.resolvers: ", error.message);

        return {
          ok: false,
          error: "Can not search users.",
        };
      }
    },
  },
};
