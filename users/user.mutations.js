import bcrypt from "bcrypt";
import client from "../client";

export default {
  Mutation: {
    createAccount: async (
      _,
      { firstName, lastName, username, email, password }
    ) => {
      // Check if username or email are already on DB
      const existingUser = await client.user.findFirst({
        where: {
          OR: [{ username }, { email }],
        },
      });

      // Hash password
      const uglyPassword = await bcrypt.hash(password, 10);

      // Save and return the user
      return client.user.create({
        data: {
          firstName,
          lastName,
          username,
          email,
          password: uglyPassword,
        },
      });
    },
  },
};
