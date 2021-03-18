import client from "../../client";
import { protectedResolver } from "../users.utils";

const resolverFn = async (_, { username }, { loggedInUser }) => {
  try {
    const existFolloUser = await client.user.findUnique({
      where: {
        username,
      },
    });
    if (!existFolloUser) {
      return {
        ok: false,
        error: "That user does not exist.",
      };
    }

    const updatedUser = await client.user.update({
      where: {
        id: loggedInUser.id,
      },
      data: {
        following: {
          disconnect: {
            username,
          },
        },
      },
    });

    if (updatedUser.id) {
      return {
        ok: true,
      };
    } else {
      return {
        ok: false,
        error: "Can not unfollow user.",
      };
    }
  } catch (error) {
    console.log("Error @resolverFn_unfollowUser.resolvers: ", error.message);

    return {
      ok: false,
      error: "Can not unfollow user.",
    };
  }
};

export default {
  Mutation: {
    unfollowUser: protectedResolver(resolverFn),
  },
};
