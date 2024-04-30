const bcrypt = require("bcrypt");

const Customer = require("../repositorie/Customer");

const customerService = {
  salt: bcrypt.genSaltSync(10),
  async changePassword(email, password) {
    const hashed_password = bcrypt.hashSync(password, this.salt);

    try {
      // Todo: password 정책 설정
      await Customer.updatePassword(email, hashed_password);
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  },
};

module.exports = customerService;
