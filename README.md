# 🛒 E-commerce API

This is a **Node.js and Express.js** backend for an **E-commerce Web Application**. It provides API endpoints for user authentication, product management, cart operations, and order processing.

## 🚀 Features

- **User Authentication**: Register, login, logout, and session management.
- **Product Management**: Create, update, delete, and fetch product items.
- **Shopping Cart**: Add, remove, and view cart items.
- **Order Processing**: Checkout, complete orders, and integrate with PayPal.
- **Swagger API Documentation**: Accessible at `/docs`.
- **CORS Support**: Allows frontend requests from different origins.

---

## 📞 Project Structure

```
📺 e-commerce-api
├── 📁 public               # Static files
    ├── index.html               # Main application file
    ├── style.css                # Main application file
├── 📁 src                  # Database and service logic
    ├── 📁 docs                 # Swagger API Documentation
        ├── swagger-output.json
        ├── swagger.js
    ├── 📁 middleware           # Middlewares
        ├── auth.js
    ├── 📁 models               # Models for database
        ├── cart.js
        ├── category.js
        ├── item.js
        ├── order.js
        ├── user.js
    ├── 📁 routes               # API route handlers
        ├── cart.js
        ├── item.js
        ├── order.js
        ├── user.js
    ├── 📁 services             # Database and service logic
        ├── mongoose.js
        ├── paypal.js
    ├── app.js              # Main application file
├── .env.example            # Environment variables template
├── .gitignore              # Git ignore file
├── package.json            # Dependencies and scripts
├── package-lock.json       # Dependencies and scripts
└── README.md               # Project documentation
```

---

## 🔧 Installation & Setup

### 1️⃣ **Clone the Repository**

```sh
git clone https://github.com/Lohrenzo/e-commerce-api.git
cd e-commerce-api
```

### 2️⃣ **Install Dependencies**

```sh
npm install
```

### 3️⃣ **Set Up Environment Variables**

Rename `.env.example` to `.env` and configure the required variables:

```
PORT=3000
MONGODB_URI=mongodb://your_host_name/your_db_name
JWT_SECRET=your_secret_key
PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_SECRET=your_paypal_secret
```

### 4️⃣ **Start the Server**

```sh
npm run dev
```

The server will run on `http://localhost:3000`.

---

## 💜 API Documentation

Swagger documentation is available at:

```
http://localhost:3000/docs
```

Example API endpoints:

| Method   | Endpoint                   | Description                 |
| -------- | -------------------------- | --------------------------- |
| `POST`   | `/user`                    | Register a new user         |
| `POST`   | `/user/login`              | Login a user                |
| `POST`   | `/user/logout`             | Logout the current session  |
| `GET`    | `/item`                    | Fetch all products          |
| `POST`   | `/cart`                    | Add item to cart            |
| `DELETE` | `/cart`                    | Remove item from cart       |
| `POST`   | `/order/checkout`          | Initiate payment via PayPal |
| `GET`    | `/order/checkout/complete` | Complete the checkout       |

Refer to the **Swagger UI** for a detailed API reference.

---

## 🛠️ Technologies Used

- **Node.js & Express.js** - Backend framework
- **MongoDB & Mongoose** - Database management
- **JWT (JSON Web Tokens)** - Authentication
- **Swagger** - API Documentation
- **CORS** - Cross-origin request handling
- **PayPal API** - Payment gateway integration

---

## 📝 Contributing

Want to contribute? Follow these steps:

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature-name`)
3. **Commit your changes** (`git commit -m "Add feature"`)
4. **Push to your branch** (`git push origin feature-name`)
5. **Open a pull request**

---

## 📚 License

This project is licensed under the **MIT License**.

---
