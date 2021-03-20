import client from "../../client";
import { protectedResolver } from "../../users/users.utils";

const resolverFn = async (_, { id }, { loggedInUser }) => {
  try {
    const photo = await client.photo.findUnique({
      where: {
        id,
      },
      select: {
        userId: true,
      },
    });

    if (!photo) {
      return {
        ok: false,
        error: "Photo not found.",
      };
    } else if (photo.userId !== loggedInUser.id) {
      return {
        ok: false,
        error: "Not authorized.",
      };
    }

    await client.photo.delete({
      where: {
        id,
      },
    });

    return {
      ok: true,
    };
  } catch (error) {
    console.log("Error @resolverFn_deletePhoto.resolvers: ", error.message);

    return {
      ok: false,
      error: "Can not delete photo.",
    };
  }
};

export default {
  Mutation: {
    deletePhoto: protectedResolver(resolverFn),
  },
};
