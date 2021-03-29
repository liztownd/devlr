const db = require('.');

module.exports = function (sequelize, DataTypes) {
    const Profile = sequelize.define('Profile', {

        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        highestGraduation: {
            type: DataTypes.STRING,
            allowNull: false
        },
        school: {
            type: DataTypes.STRING,
            allowNull: false
        },

        skills: {
            type: DataTypes.STRING,
            allowNull: false,

        },
        TotalYearsOfexp: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        currentPosition: {
            type: DataTypes.STRING,
            allowNull: false
        },
        companyName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        from: {
            type: DataTypes.DATE,
            allowNull: false,
            validate: {
                isDate: true
            }
        },
        to: {
            type: DataTypes.DATE,
            allowNull: false,
            validate: {
                isDate: true
            }
        },
        gitUserName: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        uniqueOne: {
            type: DataTypes.STRING,
            unique: 'compositeIndex'
        },
        languages: {
            type: DataTypes.JSON,
            allowNull: true,
        },
        themePref: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        profilePic: {
            type: DataTypes.STRING,
            allowNull: true
        }

    });
    Profile.associate = (models) => {
        // We're saying that a Profile should belong to an User
        // A Profile can't be created without a User due to the foreign key constraint
        Profile.belongsTo(models.Users, {
            onDelete: 'cascade'
        });
    };
    return Profile;
};