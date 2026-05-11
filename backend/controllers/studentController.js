import sequelize from "../DB/Db.js";
import initModels from "../models/init.model.js";
import { UniqueConstraintError } from "sequelize";

export const addStudent = async (req, res) => {
  const { Student } = initModels(sequelize);
  try {
    const {
      first_name,
      last_name,
      address,
      class: className,
      school_id,
      subject_ids,
    } = req.body;

    if (
      !first_name ||
      !last_name ||
      !address ||
      !className ||
      !subject_ids ||
      !school_id
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const student = await Student.create({
      first_name,
      last_name,
      address,
      class: className,
      school_id: parseInt(school_id),
    });

    if (subject_ids && subject_ids.length > 0) {
      const numericIds = [subject_ids].flat().map((id) => parseInt(id, 10));

      await student.setEnrolledSubjects(numericIds);
    }

    res.status(201).json({
      message: "Student added successfully",
      data: student,
    });
  } catch (error) {
    if (error instanceof UniqueConstraintError) {
      return res
        .status(409)
        .json({ message: "Student with this ID already exists" });
    }
    res
      .status(500)
      .json({ message: "Error adding student", error: error.message });
  }
};

export const getStudents = async (req, res) => {
  const { Student, Subject, School } = initModels(sequelize);
  try {
    const students = await Student.findAll({
      include: [
        {
          model: Subject,
          as: "enrolledSubjects",
          through: {
            attributes: [],
          },
        },
        {
          model: School,
          as: "school",
        },
      ],
    });
    res.status(200).json({
      message: "Students fetched successfully",
      data: students,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching students", error: error.message });
  }
};

export const getStudent = async (req, res) => {
  const { Student, Subject, School } = initModels(sequelize);
  try {
    const { id } = req.params;
    const student = await Student.findOne({
      where: { student_id: parseInt(id) },
      include: [
        {
          model: Subject,
          as: "enrolledSubjects",
          through: {
            attributes: [],
          },
        },
        {
          model: School,
          as: "school",
        },
      ],
    });

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.status(200).json(student);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching student", error: error.message });
  }
};

export const updateStudentInfo = async (req, res) => {
  const { Student } = initModels(sequelize);
  try {
    const { id } = req.params;
    const {
      first_name,
      last_name,
      address,
      class: className,
      school_id,
      subject_ids,
    } = req.body;

    if (isNaN(parseInt(id))) {
      return res.status(400).json({ message: "Invalid student ID provided" });
    }

    const student = await Student.findOne({
      where: { student_id: parseInt(id) },
    });
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    await Student.update(
      {
        first_name,
        last_name,
        address,
        class: className,
        school_id: parseInt(school_id),
      },
      {
        where: { student_id: parseInt(id) },
      },
    );

    if (subject_ids !== undefined) {
      const numericIds = [subject_ids]
        .flat()
        .map((subjectId) => parseInt(subjectId));
      await student.setEnrolledSubjects(numericIds);
    }

    res.status(200).json({
      message: "Student updated successfully",
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating student", error: error.message });
  }
};

export const removeStudent = async (req, res) => {
  const { Student } = initModels(sequelize);
  try {
    const { id } = req.params;
    if (isNaN(parseInt(id))) {
      return res.status(400).json({ message: "Invalid student ID provided" });
    }
    const deleted = await Student.destroy({
      where: { student_id: parseInt(id) },
    });

    if (deleted === 0) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.status(200).json({
      message: "Student deleted successfully",
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting student", error: error.message });
  }
};
