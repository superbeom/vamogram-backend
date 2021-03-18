import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export default {
  Mutation: {
    login: async (_, { username, password }, { client }) => {
      try {
        // Find user with args,username
        const user = await client.user.findUnique({
          where: {
            username,
          },
        });

        if (!user) {
          return {
            ok: false,
            error: "User not found.",
          };
        }

        // Check password with args.password
        const passwordOk = await bcrypt.compare(password, user.password);

        if (!passwordOk) {
          return {
            ok: false,
            error: "Incorrect password.",
          };
        }

        // Issue a token and send it to the user
        const token = await jwt.sign({ id: user.id }, process.env.SECRET_KEY);

        return {
          ok: true,
          token,
        };
      } catch (error) {
        console.log("Error @login.resolvers: ", error.message);

        return {
          ok: false,
          error: "Can not login.",
        };
      }
    },
  },
};
