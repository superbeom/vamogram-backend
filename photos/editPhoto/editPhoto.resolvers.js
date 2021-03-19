import client from "../../client";
import { protectedResolver } from "../../users/users.utils";

const resolverFn = async (_, { id, caption }, { loggedInUser }) => {
  try {
    const photo = await client.photo.findFirst({
      where: {
        id,
        userId: loggedInUser.id,
      },
    });

    if (!photo) {
      return {
        ok: false,
        error: "Photo not found.",
      };
    }

    const updatedPhoto = await client.photo.update({
      where: {
        id,
      },
      data: {
        caption,
      },
    });

    console.log("updatedPhoto: ", updatedPhoto);

    // if (updatedPhoto.id) {
    //   return {
    //     ok: true,
    //   };
    // } else {
    //   return {
    //     ok: false,
    //     error: "Could not update profile.",
    //   };
    // }
  } catch (error) {
    console.log("Error @resolverFn_editPhoto.resolvers: ", error.message);

    return {
      ok: false,
      error: "Could not update photo.",
    };
  }
};

export default {
  Mutation: {
    editPhoto: protectedResolver(resolverFn),
  },
};
