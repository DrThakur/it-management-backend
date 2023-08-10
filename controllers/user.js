const User = require("../models/user");
// const csvParser = require("csv-parser");
// const fs = require("fs");
// Get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
};

// Create a new user
const createUser = async (req, res) => {
  const body = req.body;
  try {
    console.log("Body", body);
    if (
      !body.firstName ||
      !body.lastName ||
      !body.username ||
      !body.email ||
      !body.password ||
      !body.phoneNumber ||
      !body.status ||
      !body.employeeCode ||
      !body.designation ||
      !body.reportingManager ||
      !body.department ||
      !body.location ||
      !body.notes
    ) {
      return res.status(400).json({
        status: "error",
        message:
          "firstName, lastName, username, email,password,phoneNumber,active,employeeCode,designation are required",
      });
    }

    const newUser = await User.create(req.body);
    console.log("New user", newUser);
    res.status(201).json({ msg: "Success", id: newUser._id });
  } catch (error) {
    res.status(500).json({ error: "Failed to create user" });
  }
};

// Get user by ID
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch user" });
  }
};

// Update user by ID
const updateUserById = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json({ msg: "Success", id: user._id });
  } catch (error) {
    res.status(500).json({ error: "Failed to update user" });
  }
};

// Delete user by ID
const deleteUserById = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete user" });
  }
};

// Delete multiple users by IDs
const deleteMultipleUsersByIds = async (req, res) => {
  const { userIds } = req.body;

  try {
    // Check if userIds array is provided
    console.log("Asset Ids", userIds);
    if (!Array.isArray(userIds)) {
      return res.status(400).json({ error: "Invalid request body" });
    }

    // Delete the users
    const result = await User.deleteMany({ _id: { $in: userIds } });

    // Check if any documents were deleted
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Users not found" });
    }

    res
      .status(200)
      .json({ status: "Success", deletedCount: result.deletedCount });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete users" });
  }
};

// const handleCSVdataToDatabase = async (req, res) => {
//   try {
//     // const jsonArray = await csv().fromFile(req.file.path);
//     const jsonArray = [];
//     // Map the CSV column headers to the Mongoose field names
//     const fieldMappings = {
//       "Asset Type": "assetType",
//       "Financed By": "financedBy",
//       "Procured Under": "procuredUnder",
//       Location: "location",
//       System: "system",
//       "Asset Code": "assetCode",
//       "Service Tag No.": "serviceTag",
//       Make: "make",
//       Model: "model",
//       CPU: "cpu",
//       "CPU Generation": "cpuGeneration",
//       "CPU Version": "cpuVersion",
//       "CPU Speed": "cpuSpeed",
//       RAM: "ram",
//       "Hard Disk": "hardDisk",
//       "Hard Disk Type": "hardDiskType",
//       "Issued To": "issuedTo",
//       "Employee Code": "employeeCode",
//       "Employee Name": "employeeName",
//       "Intern Code": "internCode",
//       "Intern Name": "internName",
//       "Consultant Code": "consultantCode",
//       "Consultant Name": "consultantName",
//       "Project Name": "projectName",
//       "Project Owner": "projectOwner",
//       "Isolated To": "isolatedTo",
//       "Isolated Owner": "isolatedOwner",
//     };

//     fs.createReadStream(req.file.path)
//       .pipe(csvParser())
//       .on("data", (row) => {
//         const mappedRow = {};
//         for (const key in row) {
//           if (fieldMappings[key]) {
//             mappedRow[fieldMappings[key]] = row[key];
//           }
//         }
//         jsonArray.push(mappedRow);
//       })
//       .on("end", async () => {
//         for (const entry of jsonArray) {
//           const processedRow = setRequiredFields(entry);
//           await saveDataToDatabase(processedRow);
//         }
//       });
//     return res.json({ msg: "Added successfully to MongoDb" });
//   } catch (error) {
//     console.log(error);
//     return res.status(500).json({ error: "Failed to add data to MongoDb" });
//   }
// };

module.exports = {
  getAllUsers,
  createUser,
  getUserById,
  updateUserById,
  deleteUserById,
  deleteMultipleUsersByIds,
};

// if (!body) {
//   return res
//     .status(400)
//     .json({ status: "error", message: "no data is sent in body" });
// }
