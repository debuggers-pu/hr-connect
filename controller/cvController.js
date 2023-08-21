const cvSchema = require("../model/cv");

const createCv = async (req, res) => {
  const { name, phoneNumber, role } = req.body;
  try {
    if (!name || !phoneNumber || !role) {
      return res.status(500).json({ error: "Please fill all the fields" });
    }
    // Check if file was uploaded
    let cvFile = null;
    if (req.file) {
      cvFile = `http://${req.headers.host}/${req.file.path}`;
    }
    const url = cvFile?.split("/public").join("");

    const cv = await cvSchema.create({
      name: name,
      phoneNumber: phoneNumber,
      role: role,
      cv: url,
    });
    await cv.save();
    return res.status(200).json({ message: "CV created successfully", cv });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createCv,
};
