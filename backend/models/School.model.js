import { DataTypes } from "sequelize";

const SchoolModel = (sequelize) => {
  const School = sequelize.define(
    "school",
    {
      school_id: {
        autoIncrement: true, // Let the database generate the ID
        type: DataTypes.INTEGER, // Changed to INTEGER to match Student and Teacher
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

  return School; // <--- DO NOT REMOVE THIS LINE! It is required to prevent the crash.
};

export default SchoolModel;