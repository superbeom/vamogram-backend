import client from "../../client";
import { protectedResolver } from "../../users/users.utils";

const resolverFn = async (_, { id }, { loggedInUser }) => {
  try {
    const message = await client.message.findFirst({
      where: {
        id,
        userId: {
          not: loggedInUser.id,
        },
        room: {
          users: {
            some: {
              id: loggedInUser.id,
            },
          },
        },
      },
      select: {
        id: true,
      },
    });

    if (!message) {
      return {
        ok: false,
        error: "Message not found.",
      };
    }

    await client.message.update({
      where: {
        id,
      },
      data: {
        read: true,
      },
    });

    return {
      ok: true,
    };
  } catch (error) {
    console.log("Error @resolverFn_readMessage.resolvers: ", error.message);

    return {
      ok: false,
      error: "Can not read message.",
    };
  }
};

export default {
  Mutation: {
    readMessage: protectedResolver(resolverFn),
  },
};
