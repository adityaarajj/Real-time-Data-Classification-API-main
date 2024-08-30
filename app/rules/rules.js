const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//Schema for User
const RulesSchema = new Schema({
  ruleName: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("rule", RulesSchema);
