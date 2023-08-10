const mongoose = require("mongoose");

// Schema
const ticketSchema = new mongoose.Schema(
  {
    serialNumber: {
      type: Number,
    },
    ticketId: {
      type: String,
    },
    requestType: {
      type: String,
      required: true,
      enum: ["Request Something", "Report Something"],
    },
    assetRequiredFor: {
      type: String,
      required: function () {
        return this.requestType === "Request Something";
      },
      enum: ["Self", "Project"],
    },
    requestFor: {
      type: String,
      required: function () {
        return (
          this.requestType === "Request Something" &&
          (this.assetRequiredFor === "Self" ||
            this.assetRequiredFor === "Project")
        );
      },
      enum: [
        "Laptop",
        "Desktop",
        "Accessories",
        "Consumables",
        "Licence",
        "Other",
      ],
    },
    requirementDetails: {
      type: String,
      required: function () {
        return (
          this.requestType === "Request Something" &&
          (this.assetRequiredFor === "Self" ||
            this.assetRequiredFor === "Project") &&
          (this.requestFor === "Laptop" ||
            this.requestFor === "Dekstop" ||
            this.requestFor === "Accessories" ||
            this.requestFor === "Consumables" ||
            this.requestFor === "Licence" ||
            this.requestFor === "Other")
        );
      },
    },
    approvedByManager: {
      type: String,
      required: function () {
        return (
          this.requestType === "Request Something" &&
          (this.assetRequiredFor === "Self" ||
            this.assetRequiredFor === "Project") &&
          (this.requestFor === "Laptop" ||
            this.requestFor === "Dekstop" ||
            this.requestFor === "Accessories" ||
            this.requestFor === "Consumables" ||
            this.requestFor === "Licence" ||
            this.requestFor === "Other") &&
          this.requirementDetails &&
          this.requirementDetails.trim() !== ""
        );
      },
      enum: ["Yes", "No"],
    },
    managerName: {
      type: String,
      required: function () {
        return (
          this.requestType === "Request Something" &&
          (this.assetRequiredFor === "Self" ||
            this.assetRequiredFor === "Project") &&
          (this.requestFor === "Laptop" ||
            this.requestFor === "Dekstop" ||
            this.requestFor === "Accessories" ||
            this.requestFor === "Consumables" ||
            this.requestFor === "Licence" ||
            this.requestFor === "Other") &&
          this.requirementDetails &&
          this.requirementDetails.trim() !== "" &&
          this.approvedByManager === "Yes"
        );
      },
    },
    issueType: {
      type: String,
      required: function () {
        return this.requestType === "Report Something";
      },
      enum: ["Software Related", "Network Related", "LFT Resource Related"],
    },
    issueDescription: {
      type: String,
      required: function () {
        return (
          this.requestType === "Report Something" &&
          (this.issueType === "Software Related" ||
            this.issueType === "Network Related" ||
            this.issueType === "LFT Resource Related")
        );
      },
    },
    priority: {
      type: String,
      enum: ["High Priority", "Medium Priority", "Low Priority"],
      required: true,
    },
    status: {
      type: String,
      enum: ["New", "Pending", "Resolved"],
      default: "New",
    },
    createdBy: {
      name: { type: String, default: "Ankit Kumar Thakur" },
      employeeId: { type: String, default: "000" },
      profilePicture: { type: String, default: "/images/profile_image.jpg" },
    },
    assignedTo: {
      name: { type: String, default: "UnAssigned" },
      employeeId: { type: String, default: "000" },
      profilePicture: { type: String, default: "/images/profile_image.jpg" },
    },
  },
  { timestamps: true }
);

// Model
const Ticket = mongoose.model("Ticket", ticketSchema);

module.exports = Ticket;
