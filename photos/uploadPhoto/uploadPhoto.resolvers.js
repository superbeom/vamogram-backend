import { protectedResolver } from "../../users/users.utils";

const resolverFn = async (_, { file, caption }, { loggedInUser }) => {
  if (caption) {
    // parse caption
    // get or create Hashtags if hashtags in caption
  }
  // save the photo WITH the parsed hashtags
  // add the photo to the Hashtags
};

export default {
  Mutation: {
    uploadPhoto: protectedResolver(resolverFn),
  },
};
