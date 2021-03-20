import client from "../../client";
import { protectedResolver } from "../../users/users.utils";

const resolverFn = async (_, { payload, roomId, userId }, { loggedInUser }) => {
  try {
    let room = null;
    if (userId) {
      const user = await client.user.findUnique({
        where: {
          id: userId,
        },
        select: {
          id: true,
        },
      });

      if (!user) {
        return {
          ok: false,
          error: "This user does not exist.",
        };
      }

      room = await client.room.create({
        data: {
          users: {
            connect: [
              {
                id: userId,
              },
              {
                id: loggedInUser.id,
              },
            ],
          },
        },
      });
    } else if (roomId) {
      room = await client.room.findUnique({
        where: {
          id: roomId,
        },
        select: {
          id: true,
        },
      });

      if (!room) {
        return {
          ok: false,
          error: "Room not found.",
        };
      }
    }

    await client.message.create({
      data: {
        payload,
        user: {
          connect: {
            id: loggedInUser.id,
          },
        },
        room: {
          connect: {
            id: room.id,
          },
        },
      },
    });

    return {
      ok: true,
    };
  } catch {
    console.log("Error @resolverFn_sendMessage.resolvers: ", error.message);

    return {
      ok: false,
      error: "Can not send message.",
    };
  }
};

export default {
  Mutation: {
    sendMessage: protectedResolver(resolverFn),
  },
};
