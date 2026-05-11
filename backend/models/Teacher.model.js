import { DataTypes } from "sequelize";

const TeacherModel = (sequelize) => {
  const Teacher = sequelize.define(
    "teacher",
    {
      teacher_id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      teacher_name: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      school_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      subject_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: "Teacher",
      timestamps: false,
      indexes: [
        {
          name: "PRIMARY",
          unique: true,
          using: "BTREE",
          fields: [{ name: "teacher_id" }],
        },
      ],
    },
  );

  return Teacher;
};

export default TeacherModel;