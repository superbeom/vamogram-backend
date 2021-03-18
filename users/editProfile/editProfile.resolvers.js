import { createWriteStream } from "fs";
import bcrypt from "bcrypt";
import { protectedResolver } from "../users.utils";

const resolverFn = async (
  _,
  { firstName, lastName, username, email, password: newPassword, bio, avatar },
  { loggedInUser, client }
) => {
  try {
    let uglyPassword = null;
    if (newPassword) {
      uglyPassword = await bcrypt.hash(newPassword, 10);
    }

    let avatarUrl = null;
    if (avatar) {
      const { filename, createReadStream } = await avatar;
      const newFilename = `${loggedInUser.id}-${Date.now()}-${filename}`;

      const readStream = createReadStream();
      const writeStream = createWriteStream(
        /* process.cwd(): 현재 디렉터리 경로 */
        process.cwd() + "/uploads/" + newFilename
      );

      /* 업로드 받은 stream과 저장할 stream을 pipe로 연결 */
      readStream.pipe(writeStream);

      avatarUrl = `http://localhost:4000/static/${newFilename}`;
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
        ...(avatarUrl && { avatar: avatarUrl }),
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
