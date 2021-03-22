import pubsub from "../../pubsub";
import { NEW_MESSAGE } from "../../constants";
import { withFilter } from "apollo-server-express";
import client from "../../client";

export default {
  Subscription: {
    roomUpdates: {
      subscribe: async (_, { id }) => {
        const room = await client.room.findUnique({
          where: {
            id,
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
          ({ roomUpdates: { roomId } }, { id }) => roomId === id
        )(_, { id });
      },
    },
  },
};
