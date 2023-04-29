// Error handling middleware
const handleError = (res, error) => {
  console.log(error);
  res.status(500).json({
    success: false,
    message: "Something went wrong! Try again later",
  });
};

module.exports = handleError;
