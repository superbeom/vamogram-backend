import jwt from "jsonwebtoken";
import client from "../client";

export const getUser = async (token) => {
  try {
    // token이 없는 경우도 처리
    if (!token) {
      return null;
    }

    const { id } = await jwt.verify(token, process.env.SECRET_KEY);
    const user = await client.user.findUnique({
      where: {
        id,
      },
    });

    if (user) {
      return user;
    } else {
      return null;
    }
  } catch (error) {
    console.log("Error @getUser_users.utils: ", error.message);
    return null;
  }
};

export const protectedResolver = (ourResolver) => (
  root,
  args,
  context,
  info
) => {
  if (!context.loggedInUser) {
    const query = info.path.typename === "Query";

    if (query) {
      return null;
    } else {
      return {
        ok: false,
        error: "Please log in to perform this action.",
      };
    }
  }

  return ourResolver(root, args, context, info);
};
