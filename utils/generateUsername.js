const User = require("../modal/User");

const generateUsername = async (firstname, lastname, mobile) => {
  const baseUsername = `${firstname.toLowerCase()}_${lastname.toLowerCase()}_${mobile.slice(
    -4
  )}`;
  let username = baseUsername;
  let count = 0;
  while (await User.findOne({ username })) {
    count++;
    username = `${baseUsername}_${count}`;
  }

  return username;
};

module.exports = generateUsername;
