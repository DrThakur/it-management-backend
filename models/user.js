const mongoose = require("mongoose");
const { createHmac, randomBytes, createHash } = require("crypto");
const { createTokenForUser } = require("../services/authentication");
const { roles } = require("../services/constants");
//Schema
const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
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
      default: "N/A",
    },
    status: {
      type: String,
      enum: ["Active", "Left"],
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
      enum: [roles.administrator, roles.technician, roles.user],
      default: roles.user,
    },
    passwordResetToken:{ type:String},
    passwordResetTokenExpires:{ type: Date},
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
    this.role = roles.administrator;
  }

  next();
});

userSchema.static(
  "matchPasswordAndGenerateToken",
  async function (email, password) {
    console.log("user email", email);
    console.log("Password", password);
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
    console.log("My match password tokem", token);
    return token;
  }
);


const generateRandomCode = (length) => {
  const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let code = '';
  for (let i = 0; i < length; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};


 userSchema.methods.createResetPasswordToken = function() {
  const resetToken = generateRandomCode(16);

  this.passwordResetToken= createHash('sha256').update(resetToken).digest('hex');
  this.passwordResetTokenExpires = Date.now()+ 10*60*1000;

  console.log(resetToken, this.passwordResetToken)
  return resetToken;
}

// Model
const User = mongoose.model("user", userSchema);

module.exports = User;
