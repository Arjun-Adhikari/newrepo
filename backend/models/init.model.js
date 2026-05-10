import _School from "./School.model.js";
import _Student from "./Student.model.js";
import _Subject from "./Subject.model.js";
import _Teacher from "./Teacher.model.js";

export default function initModels(sequelize) {
  if (sequelize.models.School) {
    return sequelize.models;
  }

  // Capture the returned models directly — don't rely on sequelize.models registration
  const School   = _School(sequelize);
  const Student  = _Student(sequelize);
  const Subject  = _Subject(sequelize);
  const Teacher  = _Teacher(sequelize);

  // Associations
  Student.belongsTo(School, { foreignKey: "school_id", as: "school" });
  School.hasMany(Student,   { foreignKey: "school_id", as: "students" });

  Teacher.belongsTo(School, { foreignKey: "school_id", as: "workplace" });
  School.hasMany(Teacher,   { foreignKey: "school_id", as: "staff" });

  Teacher.belongsTo(Subject, { foreignKey: "subject_id", as: "specialty" });
  Subject.hasMany(Teacher,   { foreignKey: "subject_id", as: "teachers" });

  Student.belongsToMany(Subject, {
    through: "student_subjects",
    foreignKey: "student_id",
    as: "enrolledSubjects",
  });
  Subject.belongsToMany(Student, {
    through: "student_subjects",
    foreignKey: "subject_id",
    as: "enrolledStudents",
  });

  return { School, Student, Subject, Teacher };
}