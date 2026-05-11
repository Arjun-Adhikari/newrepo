import { DataTypes } from "sequelize";

const SchoolModel = (sequelize) => {
  const School = sequelize.define(
    "school",
    {
      school_id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      school_name: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      school_address: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
    },
    {
      tableName: "School",
      timestamps: false,
    }
  );

  return School;
};

export default SchoolModel;