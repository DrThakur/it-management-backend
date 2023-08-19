const express = require("express");
const router = express.Router();
const {
  getAllTickets,
  createTicket,
  getTicketById,
  updateTicketById,
  deleteTicketById,
  deleteMultipleTicketsByIds,
  getTicketsByUserId,
} = require("../controllers/ticket");

router
  .route("/")
  .get(getAllTickets)
  .post(createTicket)
  .delete(deleteMultipleTicketsByIds);

router
  .route("/:id")
  .get(getTicketById)
  .patch(updateTicketById)
  .delete(deleteTicketById);



module.exports = router;
