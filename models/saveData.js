// Model for Data table
module.exports = function (sequelize, DataTypes) {
    const SaveData = sequelize.define("SaveData", {
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true
            }
        },
        symbol: {
            type: DataTypes.STRING,
            allowNull: false
        },
        stockName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        date: {
            type: DataTypes.STRING,
            allowNull: false
        },
        open: {
            type: DataTypes.STRING,
            allowNull: false
        },
        close: {
            type: DataTypes.STRING,
            allowNull: false
        },
        volume: {
            type: DataTypes.STRING,
            allowNull: false
        }
    });
    // Method stored on Data model checks if currently logged-in user (email) matches the "email" field of the current row
    SaveData.prototype.isCurrentUser = (user) => {
        return this.email === user;
    }

    return SaveData;
};
