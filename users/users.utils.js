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

export const protectResolver = (user) => {
  if (!user) {
    return {
      ok: false,
      error: "You need to login.",
    };
  }
};
