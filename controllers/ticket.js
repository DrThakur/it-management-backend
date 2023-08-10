const Ticket = require("../models/ticket");

// Get all tickets
const getAllTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find({});
    res.status(200).json(tickets);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch tickets" });
  }
};

// Ticket Counter Definition
let ticketCounter;

// Inside an asynchronous function, you can use await
async function initializeTicketCounter() {
  try {
    const count = await Ticket.countDocuments({});
    ticketCounter = count;
    console.log("Ticket count:", ticketCounter);
    return count;
  } catch (error) {
    console.error("Error fetching ticket count:", error);
  }
}

// Call the function to initialize the ticketCounter
initializeTicketCounter();

// Create a new ticket

const createTicket = async (req, res) => {
  const body = req.body;
  console.log("My Form Data", req.body);

  try {
    // Validate if requestType is provided
    if (!body.requestType) {
      return res
        .status(400)
        .json({ status: "error", message: "requestType is required" });
    }
    if (body.requestType === "Report Something") {
      // Validate the required fields for "Report an Issue" ticket type
      if (!body.issueType || !body.issueDescription) {
        return res.status(400).json({
          status: "error",
          message:
            "issueType and issueDescription are required for 'Report an Issue' ticket",
        });
      }
    } else if (body.requestType === "Request Something") {
      // validation for "Request Something" ticket type:
      if (
        !body.assetRequiredFor ||
        !body.requestFor ||
        !body.requirementDetails ||
        !body.approvedByManager ||
        !body.managerName
      ) {
        return res.status(400).json({
          status: "error",
          message:
            "assetRequiredFor, requestFor, requirementDetails, approvedByManager, and managerName are required for 'Request Something' ticket",
        });
      }
    } else {
      // Handle the case when an invalid requestType is provided
      return res
        .status(400)
        .json({ status: "error", message: "Invalid requestType" });
    }

    // Generate the ticket ID
    console.log(ticketCounter);
    const ticketId = `LFT-${ticketCounter + 1}`;
    const serialNumber = ticketCounter + 1;
    ticketCounter++;

    console.log(req.user);

    // create new ticket
    const newTicket = new Ticket({
      ticketId,
      serialNumber,
      ...req.body,
    });
    await newTicket.save();
    res.status(201).json({ msg: "success", id: newTicket.ticketId });
  } catch (error) {
    console.error("Error creating ticket:", error);
    if (error.name === "ValidationError") {
      // Validation error occurred due to schema validation
      const validationErrors = Object.values(error.errors).map(
        (err) => err.message
      );
      return res.status(400).json({
        status: "error",
        message: "Validation failed",
        errors: validationErrors,
      });
    }
    // Other error occured
    res.status(500).json({ error: "Failed to create ticket- Server Error" });
  }
};

// Get ticket by ID
const getTicketById = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) {
      return res.status(404).json({ error: "Ticket not found" });
    }
    res.status(200).json(ticket);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch ticket" });
  }
};

// Update ticket by ID
const updateTicketById = async (req, res) => {
  try {
    const ticket = await Ticket.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!ticket) {
      return res.status(404).json({ error: "Ticket not found" });
    }
    res.status(200).json({ status: "Success", id: req.params.id });
  } catch (error) {
    res.status(500).json({ error: "Failed to update ticket" });
  }
};

// Delete ticket by ID
const deleteTicketById = async (req, res) => {
  try {
    const ticket = await Ticket.findByIdAndDelete(req.params.id);
    if (!ticket) {
      return res.status(404).json({ error: "Ticket not found" });
    }
    res
      .status(200)
      .json({ message: "Ticket deleted successfully", id: req.param.id });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete ticket" });
  }
};

// Delete multiple tickets by IDs
const deleteMultipleTicketsByIds = async (req, res) => {
  const { ticketIds } = req.body;

  try {
    // Check if ticketIds array is provided
    console.log("Ticket Ids", ticketIds);
    if (!Array.isArray(ticketIds)) {
      return res.status(400).json({ error: "Invalid request body" });
    }

    // Delete the tickets
    const result = await Ticket.deleteMany({ _id: { $in: ticketIds } });

    // Check if any documents were deleted
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Tickets not found" });
    }

    res
      .status(200)
      .json({ status: "Success", deletedCount: result.deletedCount });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete tickets" });
  }
};

module.exports = {
  getAllTickets,
  createTicket,
  getTicketById,
  updateTicketById,
  deleteTicketById,
  deleteMultipleTicketsByIds,
};

// req.body, {
//   new: true,
//   runValidators: true,
// }

// {
//   requestType: req.body.requestType,
//   assetRequiredFor: req.body.assetRequiredFor,
//   requestFor: req.body.requestFor,
//   requirementDetails: req.body.requirementDetails,
//   approvedByManager: req.body.approvedByManager,
//   managerName: req.body.managerName,
//   issueType: req.body.issueType,
//   issueDescription: req.body.issueDescription,
// }
