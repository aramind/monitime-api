const Quote = require("../models/Quote");
const handleError = require("./utils/errorCatchers");

const quoteController = {
  getRandomQuote: async (req, res) => {
    try {
      // console.log("from random quote controller");
      const total = await Quote.countDocuments({});
      const randomIndex = Math.floor(Math.random() * total);
      const result = await Quote.findOne().skip(randomIndex);
      // result
      // console.log(randomQuote);
      res.status(200).json({
        success: true,
        message: "A quote successfully retrieved",
        result,
      });
    } catch (error) {
      handleError(res, error);
    }
  },
};

module.exports = quoteController;
