import sequelize from "../DB/Db.js";
import initModels from "../models/init.model.js";

const { School } = initModels(sequelize);

export const addSchool = async (req, res) => {
  try {
    const { school_name, school_address } = req.body;

    if (!school_name || !school_address) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const school = await School.create({
      school_name: school_name, // Key must match Model
      school_address: school_address, // Key must match Model
    });

    res.status(201).json({
      message: 'School added successfully',
      data: school,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error adding school', error: error.message });
  }
};

export const getSchools = async (req, res) => {
  try {
    const schools = await School.findAll();
    res.status(200).json({
      message: "Schools fetched successfully",
      data: schools,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching schools", error: error.message });
  }
};

export const getSchool = async (req, res) => {
  try {
    const { id } = req.params;
    const school = await School.findByPk(id);

    if (!school) {
      return res.status(404).json({ message: "School not found" });
    }
    res.status(200).json({
      message: "School fetched successfully",
      data: school,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching school", error: error.message });
  }
};

export const updateSchoolInfo = async (req, res) => {
  try {
    const { id } = req.params;
    const { school_name, school_address } = req.body;

    if (isNaN(parseInt(id))) {
      return res.status(400).json({ message: "Invalid school ID provided" });
    }

    const school = await School.findByPk(parseInt(id));

    if (!school) {
      return res.status(404).json({ message: "School not found" });
    }

    school.school_name = school_name || school.school_name;
    school.school_address = school_address || school.school_address;
    await school.save();

    res.status(200).json({
      message: "School updated successfully",
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating school", error: error.message });
  }
};

export const removeSchool = async (req, res) => {
  try {
    const { id } = req.params;
    if (isNaN(parseInt(id))) {
      return res.status(400).json({ message: "Invalid school ID provided" });
    }

    const school = await School.findByPk(parseInt(id));
    if (!school) {
      return res.status(404).json({ message: "School not found" });
    }
    await school.destroy();

    res.status(200).json({
      message: "School deleted successfully",
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting school", error: error.message });
  }
};
