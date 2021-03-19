import client from "../../client";
import { protectedResolver } from "../../users/users.utils";

const resolverFn = async (_, { file, caption }, { loggedInUser }) => {
  try {
    let hashtagObj = [];

    if (caption) {
      // parse caption
      const hashtags = caption.match(/#[\w]+/g);

      hashtagObj = hashtags
        ? hashtags.map((hashtag) => ({
            where: {
              hashtag,
            },
            create: {
              hashtag,
            },
          }))
        : [];
    }

    /*
      connect or create Hashtags if hashtags in caption
      save the photo WITH the parsed hashtags
      add the photo to the Hashtags
    */
    const photo = await client.photo.create({
      data: {
        file,
        caption,
        user: {
          connect: {
            id: loggedInUser.id,
          },
        },
        ...(hashtagObj.length > 0 && {
          hashtags: {
            connectOrCreate: hashtagObj,
          },
        }),
      },
    });

    return {
      ok: true,
      photo,
    };
  } catch (error) {
    console.log("Error @uploadPhoto.resolvers: ", error.message);

    return {
      ok: false,
      error: "Can not upload photo.",
    };
  }
};

export default {
  Mutation: {
    uploadPhoto: protectedResolver(resolverFn),
  },
};
