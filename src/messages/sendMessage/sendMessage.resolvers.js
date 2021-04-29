import client from "../../client";
import { NEW_MESSAGE } from "../../constants";
import pubsub from "../../pubsub";
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

      /* userId와 loggedInUser.id가 함께 있는 room이 이미 있는지 체크
          - 1:1 채팅일때만 가정 - 단체 채팅방의 경우 다른 로직 추가 */
      room = await client.room.findFirst({
        where: {
          AND: [
            {
              users: {
                some: {
                  id: userId,
                },
              },
            },
            {
              users: {
                some: {
                  id: loggedInUser.id,
                },
              },
            },
          ],
        },
      });

      if (!room) {
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
      }
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

    const message = await client.message.create({
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

    pubsub.publish(NEW_MESSAGE, { roomUpdates: message });

    return {
      ok: true,
      id: message.id,
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
