import bcrypt from "bcrypt";
import { protectedResolver } from "../users.utils";
import client from "../../client";
import { uploadToS3 } from "../../shared/shared.utils";

const resolverFn = async (
  _,
  { firstName, lastName, username, email, password: newPassword, bio, avatar },
  { loggedInUser }
) => {
  try {
    let uglyPassword = null;
    if (newPassword) {
      uglyPassword = await bcrypt.hash(newPassword, 10);
    }

    let avatarUrl = null;
    if (avatar) {
      avatarUrl = await uploadToS3(avatar, loggedInUser.id, "avatars");

      /*
      // 서버에 사진을 저장하는 코드

      const { filename, createReadStream } = await avatar;
      const newFilename = `${loggedInUser.id}-${Date.now()}-${filename}`;

      const readStream = createReadStream();
      const writeStream = createWriteStream(
        // process.cwd(): 현재 디렉터리 경로
        process.cwd() + "/uploads/" + newFilename
      );

      // 업로드 받은 stream과 저장할 stream을 pipe로 연결
      readStream.pipe(writeStream);

      avatarUrl = `http://localhost:4000/static/${newFilename}`;
      */
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

    return {
      ok: false,
      error: "Could not update profile.",
    };
  }
};

export default {
  Mutation: {
    editProfile: protectedResolver(resolverFn),
  },
};
