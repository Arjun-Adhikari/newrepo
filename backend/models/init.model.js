import _School from "./School.model.js";
import _Student from "./Student.model.js";
import _Subject from "./Subject.model.js";
import _Teacher from "./Teacher.model.js";
import _User from "./User.model.js";
import _RefreshToken from "./RefreshToken.model.js";

export default function initModels(sequelize) {
  if (sequelize.models.school) {
    return {
      School: sequelize.models.school,
      Student: sequelize.models.student,
      Subject: sequelize.models.subject,
      Teacher: sequelize.models.teacher,
      User: sequelize.models.user,
      RefreshToken: sequelize.models.refresh_token,
    };
  }

  const School = _School(sequelize);
  const Student = _Student(sequelize);
  const Subject = _Subject(sequelize);
  const Teacher = _Teacher(sequelize);
  const User = _User(sequelize);
  const RefreshToken = _RefreshToken(sequelize);

  Student.belongsTo(School, { foreignKey: "school_id", as: "school" });
  School.hasMany(Student, { foreignKey: "school_id", as: "students" });

  Teacher.belongsTo(School, { foreignKey: "school_id", as: "workplace" });
  School.hasMany(Teacher, { foreignKey: "school_id", as: "staff" });

  Teacher.belongsTo(Subject, { foreignKey: "subject_id", as: "specialty" });
  Subject.hasMany(Teacher, { foreignKey: "subject_id", as: "teachers" });

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

  User.hasMany(RefreshToken, { foreignKey: "user_id", as: "refreshTokens" });
  RefreshToken.belongsTo(User, { foreignKey: "user_id", as: "user" });

  return { School, Student, Subject, Teacher, User, RefreshToken };
}