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

    const likeWhere = {
      where: {
        photoId_userId: {
          photoId: id,
          userId: loggedInUser.id,
        },
      },
    };

    const like = await client.like.findUnique(likeWhere);

    if (like) {
      await client.like.delete(likeWhere);
    } else {
      await client.like.create({
        data: {
          user: {
            connect: {
              id: loggedInUser.id,
            },
          },
          photo: {
            connect: {
              id: photo.id,
            },
          },
        },
      });
    }

    return {
      ok: true,
    };
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
