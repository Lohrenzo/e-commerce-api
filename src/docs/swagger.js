const swaggerAutogen = require("swagger-autogen")();

const doc = {
  info: {
    title: "E-commerce API",
    description: "An e-commerce web application API",
  },
  host: process.env.BASE_URL,
  tags: [
    {
      name: "Cart", // Tag name
      description: "Requests relating to the user's cart", // Tag description
    },
    {
      name: "Item", // Tag name
      description: "Requests relating to product items", // Tag description
    },
    {
      name: "Order", // Tag name
      description: "Requests relating to the user's orders", // Tag description
    },
    {
      name: "User", // Tag name
      description: "Requests relating to user authentication", // Tag description
    },
  ],
};

const outputFile = "./swagger-output.json";
const routes = ["../routes/*.js"];

swaggerAutogen(outputFile, routes, doc);
