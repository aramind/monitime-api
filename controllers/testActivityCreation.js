const testActivityCreationController = {
  createActivity: async (req, res) => {
    // testing resource access
    // TODO:
    res
      .status(201)
      .json({ success: true, result: { id: 123, title: "test room" } });
  },
};

module.exports = testActivityCreationController;
