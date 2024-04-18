const Order = require("../model/Order");
const { handleNewUser } = require("./usersController");

const getAllOrders = async (req, res) => {
  const orders = await Order.find();
  if (!orders) return res.status(204).json({ message: "No orders found" });
  console.log(orders);
  res.json(orders);
};

const getOrderById = async (req, res) => {
  if (!req.params.id)
    return res.status(204).json({ message: "At least one param is required" });
  const order = await Order.findOne({ _id: req.params.id }).exec();
  if (!order)
    return res
      .status(204)
      .json({ message: `No order with ID ${req.params.id} found` });
  res.status(200).json(order);
};

const getOrdersByStatus = async (req, res) => {
  if (!req.params.status)
    return res.status(204).json({ message: "Status is required" });
  const orders = await Order.find({
    status: req.params.status,
  });
  if (!orders)
    return res
      .status(204)
      .json({ message: `No orders with status ${req.params.status} found` });
  res.status(200).json(orders);
};

const addOrder = async (req, res) => {
  const { code, customer, books, delivery, payment, sumUAH, status } = req.body;
  if (!customer || !books || !delivery || !payment || !sumUAH || !status) {
    return res.status(400).json({ message: "Required data is missing" });
  }
  try {
    const result = await Order.create({
      code,
      customer,
      books,
      delivery,
      payment,
      sumUAH,
      status,
    });
    if (books.length >= 4) {
      console.log(delivery);
      console.log(delivery.email);
      handleNewUser(
        customer.name ? customer.name : "",
        customer.surname ? customer.surname : "",
        customer.email
      );
    }
    res.sendStatus(201);
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

const editOrder = async (req, res) => {
  if (!req.body.id) return res.status(400).json({ message: "Id is required" });
  const order = await Order.findOne({ _id: req.body.id }).exec();
  if (!order)
    return res
      .status(204)
      .json({ message: `No order with id ${req.body.id} found` });
  if (req.body.status) order.status = req.body.status;
  if (req.body.code) order.code = req.body.code;
  const result = await order.save();
  res.status(200).json({ message: "Order has been updated" });
};

const deleteOrder = async (req, res) => {
  if (!req.body.id) return res.status(400).json({ message: "Id is required" });
  const order = await Order.findOne({ _id: req.body.id }).exec();
  if (!order)
    return res
      .status(204)
      .json({ message: `No order with id ${req.body.id} found` });
  const result = await Order.deleteOne({ _id: req.body.id });
  res.status(200).json({ message: "Order has been deleted" }, result);
};

module.exports = {
  getAllOrders,
  getOrderById,
  getOrdersByStatus,
  addOrder,
  editOrder,
  deleteOrder,
};
