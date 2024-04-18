const express = require("express");
const {
  getAllOrders,
  getOrderById,
  getOrdersByStatus,
  addOrder,
  editOrder,
  deleteOrder,
} = require("../controllers/ordersController");
const router = express.Router();

router
  .route("/")
  .get(getAllOrders)
  .post(addOrder)
  .put(editOrder)
  .delete(deleteOrder);

router.get("/id/:id", getOrderById);
router.get("/status/:status", getOrdersByStatus);

module.exports = router;
