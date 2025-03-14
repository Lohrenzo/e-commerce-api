const express = require("express");
const axios = require("axios");
const Order = require("../models/order");
const Cart = require("../models/cart");
const Auth = require("../middleware/auth");
// const stripe = require("stripe")(process.env.STRIPE_SECRET);
const paypal = require("../services/paypal.js");

const router = new express.Router();

//get orders
router.get("/order", Auth, async (req, res) => {
  // #swagger.tags = ['Order']
  // #swagger.description = 'Get a user's orders'
  // #swagger.summary = 'This endpoint returns a list of a user's orders'
  const owner = req.user._id;
  try {
    const order = await Order.find({ owner: owner }).sort({ date: -1 });
    if (order) {
      return res.status(200).send(order);
    }
    res.status(404).send("No orders found");
  } catch (error) {
    res.status(500).send();
  }
});

//checkout
router.post("/order/checkout", Auth, async (req, res) => {
  // #swagger.tags = ['Order']
  // #swagger.description = 'Checkout a user's order'
  // #swagger.summary = "The endpoint returns a payment URL that leads to paypal's payment gateway"
  try {
    // let payload = req.body;
    // let { products } = req.body;

    //find cart and user
    const owner = req.user._id;
    let cart = await Cart.findOne({ owner });
    // let user = req.user;

    if (cart) {
      const paymentUrl = await paypal.createOrder(cart);
      // const lineItems = cart.items;

      // const session = stripe.checkout.sessions.create({
      //   line_items: lineItems,
      //   mode: "payment",
      //   success_url: `${YOUR_DOMAIN}/success.html`,
      //   cancel_url: `${YOUR_DOMAIN}/cancel.html`,
      // });

      res.send({ url: paymentUrl });
      // res.redirect(paymentUrl);
    } else {
      res.status(400).send({ message: "No cart found" });
    }
    // if (cart) {
    //   payload = { ...payload, amount: cart.bill, email: user.email };
    //   const response = await flw.Charge.card(payload);
    //   // console.log(response)
    //   if (response.meta.authorization.mode === "pin") {
    //     let payload2 = payload;
    //     payload2.authorization = {
    //       mode: "pin",
    //       fields: ["pin"],
    //       pin: 3310,
    //     };
    //     const reCallCharge = await flw.Charge.card(payload2);

    //     const callValidate = await flw.Charge.validate({
    //       otp: "12345",
    //       flw_ref: reCallCharge.data.flw_ref,
    //     });
    //     console.log(callValidate);
    //     if (callValidate.status === "success") {
    //       const order = await Order.create({
    //         owner,
    //         items: cart.items,
    //         bill: cart.bill,
    //       });
    //       //delete cart
    //       const data = await Cart.findByIdAndDelete({ _id: cart.id });
    //       return res.status(201).send({ status: "Payment successful", order });
    //     } else {
    //       res.status(400).send("payment failed");
    //     }
    //   }
    //   if (response.meta.authorization.mode === "redirect") {
    //     let url = response.meta.authorization.redirect;
    //     open(url);
    //   }

    //   // console.log(response)
    // } else {
    //   res.status(400).send("No cart found");
    // }
  } catch (error) {
    console.log(error);
    res.status(400).send({ message: error.message });
  }
});

router.get("/order/checkout/complete", async (req, res) => {
  // #swagger.tags = ['Order']
  // #swagger.description = 'Complete the order checkout'
  // #swagger.summary = 'The endpoint basically completes the checkout. It captures the paypal payment, creates a new order, deletes the cart cart after successful order placement then returns the new order that was created as well as a success message.'
  try {
    const { token } = req.query;
    if (!token) {
      return res.status(400).send({ error: "Missing PayPal order token" });
    }

    // //find cart and user
    // const owner = req.params.ownerId;
    // let cart = await Cart.findOne({ owner });

    // ✅ Fetch PayPal order details
    const accessToken = await paypal.generateAccessToken();
    const orderDetails = await axios.get(
      `${process.env.PAYPAL_BASE_URL}/v2/checkout/orders/${token}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    console.log("PayPal Order Details: ", orderDetails.data.purchase_units);

    // ✅ Retrieve user ID from PayPal order metadata
    const owner = orderDetails.data.purchase_units[0].custom_id;
    if (!owner) {
      return res
        .status(400)
        .send({ error: "User ID missing from PayPal order" });
    }

    // ✅ Find cart using user ID
    let cart = await Cart.findOne({ owner });
    if (!cart) {
      return res.status(400).send({ error: "Cart not found for this user" });
    }

    // capture/complete paypal payment
    await paypal.capturePayment(token);

    // create a new order
    const newOrder = await Order.create({
      owner,
      items: cart.items,
      bill: cart.bill,
    });

    // delete cart after successful order placement.
    await Cart.deleteOne({ owner });

    res.send({
      order: newOrder,
      message: "Your order has been placed successfully",
    });
  } catch (error) {
    console.log("Error completing order: ", error);
    res.send({ error: "Error completing order: " + error.message });
  }
});

router.get("/order/checkout/cancel", (req, res) => {
  // #swagger.tags = ['Order']
  // #swagger.description = 'Cancel an order checkout'
  // #swagger.summary = 'Cancel an order checkout'
  res.redirect("/");
});

module.exports = router;
