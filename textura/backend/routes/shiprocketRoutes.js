import express from "express";
import axios from "axios";
import Order from "../models/Order.js";

const router = express.Router();

/* ============================================================
   🔐 LOGIN TO SHIPROCKET (Get Token)
============================================================ */
router.get("/token", async (req, res) => {
  try {
    const response = await axios.post(
      "https://apiv2.shiprocket.in/v1/external/auth/login",
      {
        email: process.env.SHIPROCKET_EMAIL,
        password: process.env.SHIPROCKET_PASSWORD,
      }
    );

    res.json({ token: response.data.token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ============================================================
   🚚 CREATE SHIPMENT FOR AN ORDER
============================================================ */
router.post("/create-shipment/:id", async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];

    const order = await Order.findById(req.params.id);
    if (!order)
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });

    const payload = {
      order_id: order.orderId,
      order_date: order.createdAt,
      pickup_location: "warehouse",
      billing_customer_name: order.customerName,
      billing_address: order.address,
      billing_city: order.city || order.district,
      billing_pincode: order.pincode,
      billing_state: order.state,
      billing_phone: order.phone,

      billing_country: "India",

      order_items: order.items.map((item) => ({
        name: item.name,
        units: item.quantity,
        selling_price: item.price,
      })),

      payment_method: order.paymentMethod === "cod" ? "COD" : "Prepaid",
      sub_total: order.total,

      length: 10,
      breadth: 10,
      height: 10,
      weight: 0.5,
    };

    const shipRes = await axios.post(
      "https://apiv2.shiprocket.in/v1/external/orders/create/adhoc",
      payload,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    order.shipmentId = shipRes.data.shipment_id;
    order.awb = shipRes.data.awb_code;
    order.courierName = shipRes.data.courier_company;
    order.shippingLabel = shipRes.data.label_url;
    order.shippingStatus = "Shipped";

    await order.save();

    res.json({
      success: true,
      order,
      shiprocket: shipRes.data,
    });
  } catch (err) {
    console.log("Shipment Error:", err.response?.data || err.message);
    res.status(500).json({
      success: false,
      error: err.response?.data || err.message,
    });
  }
});

/* ============================================================
   📦 TRACK SHIPMENT
============================================================ */
router.get("/track/:shipmentId", async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];

    const trackRes = await axios.get(
      `https://apiv2.shiprocket.in/v1/external/courier/track/shipment/${req.params.shipmentId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    res.json({ success: true, tracking: trackRes.data });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.response?.data || err.message,
    });
  }
});

export default router;
