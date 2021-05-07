import pubsub from "../../pubsub";
import { NEW_MESSAGE } from "../../constants";
import { withFilter } from "graphql-subscriptions";
import client from "../../client";

export default {
  Subscription: {
    roomUpdates: {
      subscribe: async (_, { id }, { loggedInUser }) => {
        const room = await client.room.findFirst({
          where: {
            id,
            users: {
              some: {
                id: loggedInUser.id,
              },
            },
          },
          select: {
            id: true,
          },
        });

        if (!room) {
          throw new Error("Room not found");
        }

        return withFilter(
          () => pubsub.asyncIterator(NEW_MESSAGE),
          async ({ roomUpdates: { roomId } }, { id }) => {
            const userInRoom = await client.user.findFirst({
              where: {
                id: loggedInUser.id,
                rooms: {
                  some: {
                    id,
                  },
                },
              },
              select: {
                id: true,
              },
            });

            if (userInRoom) {
              return roomId === id;
            } else {
              return false;
            }
          }
        )(_, { id });
      },
    },
  },
};
