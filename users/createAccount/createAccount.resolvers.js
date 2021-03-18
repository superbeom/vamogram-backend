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
        await client.user.create({
          data: {
            firstName,
            lastName,
            username,
            email,
            password: uglyPassword,
          },
        });

        return {
          ok: true,
        };
      } catch (error) {
        console.log("Error @createAccount.resolvers: ", error.message);

        return {
          ok: false,
          error: "Can not create account.",
        };
      }
    },
  },
};
