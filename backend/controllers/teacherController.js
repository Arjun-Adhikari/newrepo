import sequelize from "../DB/Db.js";
import initModels from "../models/init.model.js";
import { UniqueConstraintError } from "sequelize";

export const addTeacher = async (req, res) => {
  const { Teacher } = initModels(sequelize);
  try {
    const { teacher_name, subject_id, school_id } = req.body;

    if (!teacher_name || !subject_id || !school_id) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const teacher = await Teacher.create({
      teacher_name,
      subject_id: parseInt(subject_id),
      school_id: parseInt(school_id),
    });

    res.status(201).json({
      message: "Teacher added successfully",
      data: teacher,
    });
  } catch (error) {
    if (error instanceof UniqueConstraintError) {
      return res
        .status(409)
        .json({ message: "Teacher with this ID already exists" });
    }
    res
      .status(500)
      .json({ message: "Error adding teacher", error: error.message });
  }
};

export const getTeachers = async (req, res) => {
  const { Teacher, Subject, School } = initModels(sequelize);
  try {
    const teachers = await Teacher.findAll({
      include: [
        {
          model: Subject,
          as: "specialty",
        },
        {
          model: School,
          as: "workplace",
        },
      ],
    });
    res.status(200).json({
      message: "Teachers fetched successfully",
      data: teachers,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching teachers", error: error.message });
  }
};

export const getTeacher = async (req, res) => {
  const { Teacher, Subject, School } = initModels(sequelize);
  try {
    const { id } = req.params;
    const teacher = await Teacher.findOne({
      where: { teacher_id: parseInt(id) },
      include: [
        {
          model: Subject,
          as: "specialty",
        },
        {
          model: School,
          as: "workplace",
        },
      ],
    });

    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }
    res.status(200).json({
      message: "Teacher fetched successfully",
      data: teacher,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching teacher", error: error.message });
  }
};

export const updateTeacherInfo = async (req, res) => {
  const { Teacher } = initModels(sequelize);
  try {
    const { id } = req.params;
    const { teacher_name, subject_id, school_id } = req.body;

    if (isNaN(parseInt(id))) {
      return res.status(400).json({ message: "Invalid teacher ID provided" });
    }

    const teacher = await Teacher.findByPk(parseInt(id, 10));

    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    await Teacher.update(
      { teacher_name, subject_id, school_id },
      { where: { teacher_id: parseInt(id, 10) } },
    );

    res.status(200).json({
      message: "Teacher updated successfully",
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating teacher", error: error.message });
  }
};

export const removeTeacher = async (req, res) => {
  const { Teacher } = initModels(sequelize);
  try {
    const { id } = req.params;
    if (isNaN(parseInt(id))) {
      return res.status(400).json({ message: "Invalid teacher ID provided" });
    }

    const teacher = await Teacher.findByPk(parseInt(id, 10));
    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    await teacher.destroy();

    res.status(200).json({
      message: "Teacher deleted successfully",
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting teacher", error: error.message });
  }
};
