import client from "../../client";
import { uploadToS3 } from "../../shared/shared.utils";
import { protectedResolver } from "../../users/users.utils";
import { processHashtags } from "../photos.utils";

const resolverFn = async (_, { file, caption }, { loggedInUser }) => {
  try {
    let hashtagObj = [];

    if (caption) {
      hashtagObj = processHashtags(caption);
    }

    const fileUrl = await uploadToS3(file, loggedInUser.id, "uploads");
    const photo = await client.photo.create({
      data: {
        file: fileUrl,
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
