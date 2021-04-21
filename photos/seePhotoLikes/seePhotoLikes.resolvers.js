import client from "../../client";

export default {
  Query: {
    seePhotoLikes: async (_, { id }) => {
      try {
        const users = await client.like.findMany({
          where: {
            photoId: id,
          },
          select: {
            user: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        });

        const userArray = users.map((item) => item.user);

        return {
          ok: true,
          users: userArray,
        };
      } catch (error) {
        console.log("Error @seePhotoLikes.resolvers: ", error.message);

        return {
          ok: false,
          error: "Can not see users who like photo.",
        };
      }
    },
  },
};
