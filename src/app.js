const express = require("express");
const path = require("path");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const { SwaggerTheme, SwaggerThemeNameEnum } = require("swagger-themes");

const userRouter = require("./routes/user");
const itemRouter = require("./routes/item");
const cartRouter = require("./routes/cart");
const orderRouter = require("./routes/order");
require("./services/mongoose");

const port = process.env.PORT;

const app = express();

// Allow requests from frontend
app.use(
  cors({
    origin: process.env.FRONTEND_URL, // Allow frontend URL
    credentials: true, // Allow cookies & headers like "Authorization"
  })
);

// Allow all origins
// app.use(cors());

// Swagger documentation
const theme = new SwaggerTheme();
const swaggerOptions = {
  explorer: true,
  customCss: theme.getBuffer(SwaggerThemeNameEnum.DARK), // Dark mode
};
const swaggerDocs = require("./docs/swagger-output.json");
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs, swaggerOptions));

app.use(express.json());
app.use(userRouter);
app.use(itemRouter);
app.use(cartRouter);
app.use(orderRouter);

const publicDirectory = path.join(__dirname, "../public");
app.use(express.static(publicDirectory));

app.get("/", (req, res) => {
  res.sendFile("index.html");
});
app.listen(port, () => {
  console.log("Server listening on port " + port);
});
