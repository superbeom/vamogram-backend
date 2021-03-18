import client from "../../client";
import { protectedResolver } from "../users.utils";

const resolverFn = async (_, { username }, { loggedInUser }) => {
  try {
    const existFollowUser = await client.user.findUnique({
      where: {
        username,
      },
    });
    if (!existFollowUser) {
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
          connect: {
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
        error: "Can not follow user.",
      };
    }
  } catch (error) {
    console.log("Error @resolverFn_followUser.resolvers: ", error.message);

    return {
      ok: false,
      error: "Can not follow user.",
    };
  }
};

export default {
  Mutation: {
    followUser: protectedResolver(resolverFn),
  },
};
