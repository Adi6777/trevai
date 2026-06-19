const express = require("express");
const {
  createTrip,
  getTrips,
  getTripById,
  updateTrip,
  deleteTrip,
  generateTrip
} = require("../controllers/tripcontroller");
const protect = require("../middleware/authmiddleware");

const router = express.Router();

router.use(protect);

router
  .route("/")
  .post(createTrip)
  .get(getTrips);

router.post("/:id/generate", generateTrip);

router
  .route("/:id")
  .get(getTripById)
  .put(updateTrip)
  .delete(deleteTrip);

module.exports = router;
