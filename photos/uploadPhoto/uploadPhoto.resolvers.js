import client from "../../client";
import { protectedResolver } from "../../users/users.utils";
import { processHashtags } from "../photos.utils";

const resolverFn = async (_, { file, caption }, { loggedInUser }) => {
  try {
    let hashtagObj = [];

    if (caption) {
      // extract hashtags from caption
      hashtagObj = processHashtags(caption);
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
        hashtags: {
          connectOrCreate: hashtagObj,
        },
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
