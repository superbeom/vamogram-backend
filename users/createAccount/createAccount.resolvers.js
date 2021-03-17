import bcrypt from "bcrypt";

export default {
  Mutation: {
    createAccount: async (
      _,
      { firstName, lastName, username, email, password },
      { client }
    ) => {
      try {
        // Check if username or email are already on DB
        const existingUser = await client.user.findFirst({
          where: {
            OR: [{ username }, { email }],
          },
        });

        if (existingUser) {
          throw new Error("This username or email is already taken.");
        }

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
      } catch (error) {
        return error;
      }
    },
  },
};
