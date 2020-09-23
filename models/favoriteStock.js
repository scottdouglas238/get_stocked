// Model for favoriteStock table
module.exports = function (sequelize, DataTypes) {
    const FavoriteStock = sequelize.define("FavoriteStock", {
        emails: {
            type: DataTypes.STRING,
            unique: false
        },
        symbol: {
            type: DataTypes.STRING, 
        },
        stockName: {
            type: DataTypes.STRING,
        },
        stockType: {
            type: DataTypes.STRING,
        },
        stockCurrency: {
            type: DataTypes.STRING,
        }
    });
    // Method stored on favoriteStock model checks if currently logged-in user (email) matches the "email" field of the current row
    FavoriteStock.prototype.isCurrentUser = (user) => {
        return this.email === user;
    }

    return FavoriteStock;
};
