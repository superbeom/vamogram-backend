import client from "../../client";
import { protectedResolver } from "../../users/users.utils";

const resolverFn = async (_, { photoId, payload }, { loggedInUser }) => {
  try {
    const photo = await client.photo.findUnique({
      where: {
        id: photoId,
      },
      select: {
        id: true,
      },
    });

    if (!photo) {
      return {
        ok: false,
        error: "Photo not found.",
      };
    }

    const newComment = await client.comment.create({
      data: {
        payload,
        user: {
          connect: {
            id: loggedInUser.id,
          },
        },
        photo: {
          connect: {
            id: photoId,
          },
        },
      },
    });

    return {
      ok: true,
      id: newComment.id,
    };
  } catch (error) {
    console.log("Error @resolverFn_createComment.resolvers: ", error.message);

    return {
      ok: false,
      error: "Can not create comment.",
    };
  }
};

export default {
  Mutation: {
    createComment: protectedResolver(resolverFn),
  },
};
