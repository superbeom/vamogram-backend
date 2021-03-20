import client from "../../client";
import { protectedResolver } from "../../users/users.utils";

const resolverFn = async (_, { id }, { loggedInUser }) => {
  try {
    const photo = await client.photo.findUnique({
      where: {
        id,
      },
    });

    if (!photo) {
      return {
        ok: false,
        error: "Photo not found.",
      };
    }
  } catch (error) {
    console.log("Error @resolverFn_toggleLike.resolvers: ", error.message);

    return {
      ok: false,
      error: "Can not like/unlike photo.",
    };
  }
};

export default {
  Mutation: {
    toggleLike: protectedResolver(resolverFn),
  },
};
