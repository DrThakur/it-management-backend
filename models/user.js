const mongoose = require("mongoose");
const { createHmac, randomBytes } = require("crypto");
const { createTokenForUser } = require("../services/authentication");
const { roles } = require("../services/constants");
//Schema
const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    salt: {
      type: String,
    },
    password: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },
    profileImageURL: {
      type: String,
      default: "/images/profile_image.jpg",
    },
    employeeCode: {
      type: String,
      required: true,
    },
    designation: {
      type: String,
      required: true,
    },
    reportingManager: {
      type: String,
      required: true,
    },
    department: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    notes: {
      type: String,
    },
    role: {
      type: String,
      enum: [roles.superAdmin, roles.admin, roles.staff],
      default: roles.staff,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", function (next) {
  const user = this;

  if (!user.isModified("password")) return;

  const salt = randomBytes(16).toString();
  const hashedPassword = createHmac("sha256", salt)
    .update(user.password)
    .digest("hex");

  this.salt = salt;
  this.password = hashedPassword;
  if (this.email === process.env.ADMIN_EMAIL.toLowerCase()) {
    this.role = roles.superAdmin;
  }

  next();
});

userSchema.static(
  "matchPasswordAndGenerateToken",
  async function (email, password) {
    const user = await this.findOne({ email });
    if (!user) throw new Error("user not found");

    const salt = user.salt;
    const hashedPassword = user.password;

    const userProvidedHash = createHmac("sha256", salt)
      .update(password)
      .digest("hex");

    if (hashedPassword !== userProvidedHash)
      throw new Error("Incorrect Password");

    const token = createTokenForUser(user);
    return token;
  }
);

// Model
const User = mongoose.model("user", userSchema);

module.exports = User;
