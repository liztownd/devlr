/* Requiring bcrypt for password hashing. Using the bcryptjs version as the regular
bcrypt module sometimes causes errors on Windows machines */
var bcrypt = require("bcryptjs");
// Creating our Users model
module.exports = function(sequelize, DataTypes) {
  var Users = sequelize.define("Users", {
    // The email cannot be null, and must be a proper email before creation
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    // The password cannot be null
    password: {
      type: DataTypes.STRING,
      allowNull: false
    }
  });
  /* Creating a custom method for our Users model. This will check if an un-hashed password
  entered by the user can be compared to the hashed password stored in our database */
  Users.prototype.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
  };
  // Hooks are automatic methods that run during various phases of the Users Model lifecycle
  // In this case, before a Users is created, we will automatically hash their password
  Users.addHook("beforeCreate", function(user) {
    user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(10), null);
  });
  return Users;
};
