const db = require(".");

module.exports = function(sequelize, DataTypes) {
    const Profile = sequelize.define("Profile", {
      
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        },
  
      highestGraduation: {
        type: DataTypes.STRING,
        allowNull: false
      },
      school:{
          type: DataTypes.STRING,
          allowNull:false
      },

      skills:{
          type: DataTypes.STRING,
          allowNull:false,

      },
      TotalYearsOfexp:{
          type: DataTypes.INTEGER,
          allowNull: false
      },
      currentPosition:{
          type: DataTypes.STRING,
          allowNull: false
      },
      companyName:{
          type: DataTypes.STRING,
          allowNull: false
      }, 
      from:{
          type: DataTypes.DATE,
          allowNull: false,
          validate:{
              isDate: true
          }
      },
      to:{
          type: DataTypes.DATE,
          allowNull: false,
          validate: {
              isDate: true
          }
      },
      gitUserName:{
          type: DataTypes.STRING,
          allowNull: false
      }
      
    });
    Profile.associate = (models) => {
        // We're saying that a Post should belong to an User
        // A Profile can't be created without a User due to the foreign key constraint
        Profile.belongsTo(models.Users, {
          foreignKey: {
            allowNull: false,
          },
        });
      };
 return Profile;
};