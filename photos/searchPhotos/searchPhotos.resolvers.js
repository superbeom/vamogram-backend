import client from "../../client";

export default {
  Query: {
    searchPhotos: async (_, { keyword }) => {
      try {
        if (keyword.length < 3) {
          return {
            ok: false,
            error: "Please write at least 3 characters.",
          };
        }

        /* Pagination 추가하기!! */
        const photos = await client.photo.findMany({
          where: {
            caption: {
              contains: keyword,
            },
          },
        });

        return {
          ok: true,
          photos,
        };
      } catch (error) {
        console.log("Error @searchPhotos.resolvers: ", error.message);

        return {
          ok: false,
          error: "Can not search photos.",
        };
      }
    },
  },
};
