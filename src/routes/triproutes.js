const express = require("express");
const {
  createTrip,
  getTrips,
  getTripById,
  updateTrip,
  deleteTrip,
  generateTrip,
  updateTripBudget,
  updateTripHotels,
  addActivity,
  updateActivity,
  deleteActivity
} = require("../controllers/tripcontroller");
const protect = require("../middleware/authmiddleware");

const router = express.Router();

router.use(protect);

router
  .route("/")
  .post(createTrip)
  .get(getTrips);

router.post("/:id/generate", generateTrip);
router.put("/:id/budget", updateTripBudget);
router.put("/:id/hotels", updateTripHotels);

router.post("/:id/days/:dayId/activities", addActivity);
router.put(
  "/:id/days/:dayId/activities/:activityId",
  updateActivity
);
router.delete(
  "/:id/days/:dayId/activities/:activityId",
  deleteActivity
);

router
  .route("/:id")
  .get(getTripById)
  .put(updateTrip)
  .delete(deleteTrip);

module.exports = router;
