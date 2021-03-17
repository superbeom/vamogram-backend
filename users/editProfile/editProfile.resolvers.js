import bcrypt from "bcrypt";
import { protectedResolver } from "../users.utils";

const resolverFn = async (
  _,
  { firstName, lastName, username, email, password: newPassword, bio },
  { loggedInUser, client }
) => {
  try {
    let uglyPassword = null;
    if (newPassword) {
      uglyPassword = await bcrypt.hash(newPassword, 10);
    }

    const updatedUser = await client.user.update({
      where: {
        id: loggedInUser.id,
      },
      data: {
        firstName,
        lastName,
        username,
        email,
        ...(uglyPassword && { password: uglyPassword }),
        bio,
      },
    });

    if (updatedUser.id) {
      return {
        ok: true,
      };
    } else {
      return {
        ok: false,
        error: "Could not update profile.",
      };
    }
  } catch (error) {
    console.log("Error @resolverFn_editProfile.resolvers: ", error.message);
    return error;
  }
};

export default {
  Mutation: {
    editProfile: protectedResolver(resolverFn),
  },
};
