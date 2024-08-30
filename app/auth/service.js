const User = require("../Users/user");
const bcrypt = require("bcrypt");
const rule = require("../rules/rules");
const { evaluateDSL } = require("../logic");
//Helping functions
module.exports = {
  findByUsername: async (username) => {
    return await User.findOne({ username });
  },
  create: async (data) => {
    data.password = bcrypt.hashSync(data.password, 10);
    return await User.create(data);
  },
  isUsernameExists: async (username) => {
    return await User.exists({ username });
  },
  isEmailExists: async (email) => {
    return await User.exists({ email });
  },
  comparePassword: async (hashedpassword, password) => {
    const isCompared = await bcrypt.compare(password, hashedpassword);
    return isCompared;
  },
  createrule: async (data) => {
    return await rule.create(data);
  },
  readrule: async () => {
    return await rule.find().select("ruleName -_id");
  },
  updaterule: async (data) => {
    const filter = { ruleName: data.ruleName };
    const updateDoc = {
      $set: { ruleName: data.updatedRule },
    };
    return await rule.updateOne(filter, updateDoc);
  },
  deleterule: async (data) => {
    return await rule.findOneAndDelete({ ruleName: data.ruleName });
  },
  findbyRule: async (data) => {
    return await rule.exists({ ruleName: data.ruleName });
  },
  applyrules: async (data, rules) => {
    const results = [];
    for (let rule of rules) {
      const result = await evaluateDSL(rule, data);
      results.push({ rule, result });
    }
    return results;
  },
};
