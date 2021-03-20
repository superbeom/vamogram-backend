import client from "../../client";
import { protectedResolver } from "../../users/users.utils";

const resolverFn = async (_, { id, payload }, { loggedInUser }) => {
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

    await client.comment.update({
      where: {
        id,
      },
      data: {
        payload,
      },
    });

    return {
      ok: true,
    };
  } catch (error) {
    console.log("Error @resolverFn_editComment.resolvers: ", error.message);

    return {
      ok: false,
      error: "Could not update comment.",
    };
  }
};

export default {
  Mutation: {
    editComment: protectedResolver(resolverFn),
  },
};
