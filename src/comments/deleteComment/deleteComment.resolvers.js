import client from "../../client";
import { protectedResolver } from "../../users/users.utils";

const resolverFn = async (_, { id }, { loggedInUser }) => {
  try {
    const comment = await client.comment.findUnique({
      where: {
        id,
      },
      select: {
        userId: true,
      },
    });

    if (!comment) {
      return {
        ok: false,
        error: "Comment not found.",
      };
    } else if (comment.userId !== loggedInUser.id) {
      return {
        ok: false,
        error: "Not authorized.",
      };
    }

    await client.comment.delete({
      where: {
        id,
      },
    });

    return {
      ok: true,
    };
  } catch (error) {
    console.log("Error @resolverFn_deleteComment.resolvers: ", error.message);

    return {
      ok: false,
      error: "Can not delete comment.",
    };
  }
};

export default {
  Mutation: {
    deleteComment: protectedResolver(resolverFn),
  },
};
