const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const { connectToMongoDb } = require("./connection");
const ticketRouter = require("./routes/ticket");
const userRouter = require("./routes/user");
const assetRouter = require("./routes/asset");
const multer = require("multer");
const { body, validationResult } = require("express-validator");
const { handleCSVdataToDatabase } = require("./controllers/asset");
const {
  checkForAuthenticationCookie,
} = require("./middlewares/authentication");
require("dotenv").config();
const cors = require("cors");

const app = express();
const PORT = 8002;
app.use(cors());

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    return cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    return cb(null, `${Date.now()} - ${file.originalname}`);
  },
});

//Multer filter
const multerFilter = (req, file, cb) => {
  if (
    file.mimetype.split("/")[1] === "jpeg" ||
    file.mimetype.split("/")[1] === "jpg" ||
    file.mimetype.split("/")[1] === "png" ||
    file.mimetype.split("/")[1] === "csv" ||
    file.mimetype.split("/")[1] ===
      "vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  ) {
    return cb(null, true);
  } else {
    return cb("Not a JPG file", false);
  }
};

// mongodb+srv://drankitkumarthakur:MtcJwiuDf27C4Ny8@cluster0.k8wu6dh.mongodb.net/?retryWrites=true&w=majority
// Connection
// connectToMongoDb("mongodb://127.0.0.1:27017").then(() =>
//   console.log("MongoDb Connected!")
// );
connectToMongoDb(
  "mongodb+srv://drankitkumarthakur:MtcJwiuDf27C4Ny8@cluster0.k8wu6dh.mongodb.net/?retryWrites=true&w=majority"
).then(() => console.log("MongoDb Connected!"));

// View Engine Declaration
app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

// MiddleWares
// Serve images from a specific directory
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json()); //parse json data middleware
app.use(express.urlencoded({ extended: false })); //parse url-endcoded data middleware
app.use(cookieParser());
app.use(checkForAuthenticationCookie("token"));
//
const upload = multer({ storage: storage, fileFilter: multerFilter });

// // Handle requests on Ticket submission
app.use("/tickets", ticketRouter);

// Handle requests on User
app.use("/users", userRouter);

// Handle requests on Assets
app.use("/assets", assetRouter);

// Upload file
app.post("/assets/importFile", upload.single("file"), handleCSVdataToDatabase);
app.post("/users/importFile", upload.single("file"), handleCSVdataToDatabase);

app.listen(PORT, () => console.log(`Server started at PORT : ${PORT}`));
