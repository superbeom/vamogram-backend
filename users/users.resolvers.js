export default {
  User: {
    totalFollowers: (root) => {
      console.log("root: ", root);
      return 22;
    },
    totalFollowing: () => 555,
  },
};
