import client from "../../client";
import { protectedResolver } from "../../users/users.utils";

const resolverFn = async (_, { file, caption }, { loggedInUser }) => {
  if (caption) {
    // parse caption
    const hashtags = caption.match(/#[\w]+/g);

    // get or create Hashtags if hashtags in caption
    await client.photo.create({
      data: {
        file,
        caption,
        hashtags: {
          connectOrCreate: [
            {
              where: {
                hashtag: "#food",
              },
              create: {
                hashtag: "#food",
              },
            },
          ],
        },
      },
    });
  }
  // save the photo WITH the parsed hashtags
  // add the photo to the Hashtags
};

export default {
  Mutation: {
    uploadPhoto: protectedResolver(resolverFn),
  },
};
