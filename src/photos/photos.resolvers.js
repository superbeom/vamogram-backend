import client from "../client";

export default {
  Photo: {
    user: ({ userId }) =>
      client.user.findUnique({
        where: {
          id: userId,
        },
      }),

    hashtags: ({ id }) =>
      client.hashtag.findMany({
        where: {
          photos: {
            some: {
              id,
            },
          },
        },
      }),

    likes: ({ id }) =>
      client.like.count({
        where: {
          photoId: id,
        },
      }),

    comments: ({ id }) =>
      client.comment.findMany({
        where: {
          photoId: id,
        },
      }),

    commentNumber: ({ id }) =>
      client.comment.count({
        where: {
          photoId: id,
        },
      }),

    isMine: ({ userId }, _, { loggedInUser }) => {
      if (!loggedInUser) {
        return false;
      }

      return userId === loggedInUser.id;
    },

    isLiked: async ({ id }, _, { loggedInUser }) => {
      if (!loggedInUser) {
        return false;
      }

      const existLike = await client.like.findUnique({
        where: {
          photoId_userId: {
            photoId: id,
            userId: loggedInUser.id,
          },
        },
        select: {
          id: true,
        },
      });

      return Boolean(existLike);
    },
  },

  Hashtag: {
    photos: async ({ id }, { page }) =>
      client.photo.findMany({
        where: {
          hashtags: {
            some: {
              id,
            },
          },
        },
        skip: (page - 1) * 5,
        take: 5,
      }),

    totalPhotos: ({ id }) =>
      client.photo.count({
        where: {
          hashtags: {
            some: {
              id,
            },
          },
        },
      }),
  },
};
