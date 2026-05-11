import { DataTypes } from "sequelize";

const RefreshTokenModel = (sequelize) => {
  const RefreshToken = sequelize.define(
    "refresh_token",
    {
      id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      token: {
        type: DataTypes.TEXT,
        allowNull: false,
        unique: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      expires_at: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      tableName: "refresh_tokens",
      timestamps: true,
      updatedAt: false,
    }
  );

  return RefreshToken;
};

export default RefreshTokenModel;