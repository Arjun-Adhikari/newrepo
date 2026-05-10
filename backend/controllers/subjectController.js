import sequelize from "../DB/Db.js";
import initModels from "../models/init.model.js";
import { UniqueConstraintError } from "sequelize";

const { Subject } = initModels(sequelize);

export const addSubject = async (req, res) => {
  console.log("Received request to add subject with data:", req.body);
  try {
    const { subject_name } = req.body;

    if (!subject_name) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const subject = await Subject.create({
      subject_name,
    });

    res.status(201).json({
      message: "Subject added successfully",
      data: subject,
    });
  } catch (error) {
    if (error instanceof UniqueConstraintError) {
      return res
        .status(409)
        .json({ message: "Subject with this ID already exists" });
    }
    res
      .status(500)
      .json({ message: "Error adding subject", error: error.message });
  }
};

export const getSubjects = async (req, res) => {
  try {
    const subjects = await Subject.findAll();
    res.status(200).json({
      message: "Subjects fetched successfully",
      data: subjects,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching subjects", error: error.message });
  }
};

export const getSubject = async (req, res) => {
  try {
    const { id } = req.params;
    const subject = await Subject.findByPk(id);

    if (!subject) {
      return res.status(404).json({ message: "Subject not found" });
    }
    res.status(200).json({
      message: "Subject fetched successfully",
      data: subject,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching subject", error: error.message });
  }
};

export const updateSubjectInfo = async (req, res) => {
  try {
    console.log(req.body);
    const { id } = req.params;
    const { subject_name } = req.body;

    if (isNaN(parseInt(id))) {
      return res.status(400).json({ message: "Invalid subject ID provided" });
    }
    const subject = await Subject.findByPk(parseInt(id));

    if (!subject) {
      return res.status(404).json({ message: "Subject not found" });
    }

    subject.subject_name = subject_name;
    await subject.save();
    res.status(200).json({
      message: "Subject updated successfully",
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating subject", error: error.message });
  }
};

export const removeSubject = async (req, res) => {
  try {
    const { id } = req.params;
    if (isNaN(parseInt(id))) {
      return res.status(400).json({ message: "Invalid subject ID provided" });
    }

    const subject = await Subject.findByPk(id);
    if (!subject) {
      return res.status(404).json({ message: "Subject not found" });
    }

    await subject.destroy();

    res.status(200).json({
      message: "Subject deleted successfully",
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting subject", error: error.message });
  }
};
