const axios = require("axios");
const Order = require("../models/order");
const Cart = require("../models/cart");
const base64 = require("base-64");

const auth = base64.encode(
  `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_SECRET}`
);

exports.generateAccessToken = async () => {
  try {
    const response = await axios.post(
      process.env.PAYPAL_BASE_URL + "/v1/oauth2/token",
      "grant_type=client_credentials",
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${auth}`,
        },
      }
    );

    // console.log("Access Token:", response.data.access_token);
    return response.data.access_token;
  } catch (error) {
    console.error(
      "Error fetching PayPal access token:",
      error.response?.data || error.message
    );
  }
};

exports.createOrder = async (cart) => {
  const accessToken = await this.generateAccessToken();

  // Extract items and calculate total price
  const items = cart.items.map((item) => ({
    name: item.name,
    description: item.description,
    quantity: item.quantity,
    unit_amount: {
      currency_code: "GBP",
      value: (item.price / 100).toFixed(2), // Convert price to pounds
    },
  }));

  // Calculate total amount
  const totalValue = (cart.bill / 100).toFixed(2);

  const response = await axios({
    url: process.env.PAYPAL_BASE_URL + "/v2/checkout/orders",
    method: "post",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + accessToken,
    },
    data: JSON.stringify({
      intent: "CAPTURE",
      purchase_units: [
        {
          items: items,
          amount: {
            currency_code: "GBP",
            value: totalValue,
            breakdown: {
              item_total: {
                currency_code: "GBP",
                value: totalValue,
              },
            },
          },
          custom_id: cart.owner,
          invoice_id: Math.round(Math.random() * 10000000),
        },
      ],

      application_context: {
        return_url: `${process.env.BASE_URL}/order/checkout/complete`,
        cancel_url: process.env.BASE_URL + "/order/checkout/cancel",
        shipping_preference: "NO_SHIPPING",
        // user_action: "PAY_NOW",
        // brand_name: "manfra.io",
      },
    }),
  });

  // console.log("Create order response: ", response.data);
  // return the "approve" link where the customer will make payment
  return response.data.links.find((link) => link.rel === "approve").href;
};

exports.capturePayment = async (orderId) => {
  const accessToken = await this.generateAccessToken();

  const response = await axios({
    url: process.env.PAYPAL_BASE_URL + `/v2/checkout/orders/${orderId}/capture`,
    method: "post",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + accessToken,
    },
  });

  return response.data;
};
