# ShopCart - Full-Stack E-Commerce Application

A full-stack e-commerce platform built with React, Node.js/Express, and MongoDB.

## Features

- **User Authentication** – Register, login, and JWT-protected routes
- **Product Catalog** – Browse, search, and filter products by category
- **Product Details** – View product info and submit reviews
- **Shopping Cart** – Add, update, and remove items
- **Checkout & Orders** – Place orders with shipping and payment details
- **User Profile** – Update personal info and view order history
- **Admin Support** – Role-based access for product/order management

## Tech Stack

| Layer     | Technology                  |
|-----------|-----------------------------|
| Frontend  | React 18, Vite, React Router |
| Backend   | Node.js, Express.js          |
| Database  | MongoDB, Mongoose            |
| Auth      | JWT (JSON Web Tokens)        |
| HTTP      | Axios                        |

## Project Structure

```
ecommerce-fullstack/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── ProductCard.jsx
│   │   │   ├── Cart.jsx
│   │   │   ├── Checkout.jsx
│   │   │   └── PrivateRoute.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Products.jsx
│   │   │   ├── ProductDetail.jsx
│   │   │   ├── Cart.jsx
│   │   │   ├── Checkout.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   └── Profile.jsx
│   │   ├── services/
│   │   │   ├── api.js
│   │   │   ├── auth.js
│   │   │   ├── product.js
│   │   │   └── order.js
│   │   ├── context/
│   │   │   ├── AuthContext.jsx
│   │   │   └── CartContext.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── productController.js
│   │   ├── orderController.js
│   │   └── cartController.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── errorHandler.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Product.js
│   │   ├── Order.js
│   │   └── Cart.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── products.js
│   │   ├── orders.js
│   │   ├── cart.js
│   │   └── users.js
│   ├── server.js
│   ├── .env.example
│   └── package.json
└── README.md
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas))
- npm or yarn

### 1. Clone the Repository

```bash
git clone https://github.com/ManaliBhosale/ecommerce-fullstack.git
cd ecommerce-fullstack
```

### 2. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env` with your values:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/ecommerce
JWT_SECRET=your_super_secret_key
JWT_EXPIRE=30d
NODE_ENV=development
```

Start the backend:

```bash
npm run dev    # development (nodemon)
npm start      # production
```

The API will be available at `http://localhost:5000`.

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The frontend will be available at `http://localhost:3000`.

## API Endpoints

### Auth (`/api/auth`)

| Method | Endpoint       | Description              | Auth     |
|--------|----------------|--------------------------|----------|
| POST   | /register      | Register a new user      | Public   |
| POST   | /login         | Login and get JWT token  | Public   |
| GET    | /me            | Get current user         | Private  |
| PUT    | /profile       | Update user profile      | Private  |
| PUT    | /password      | Change password          | Private  |

### Products (`/api/products`)

| Method | Endpoint           | Description              | Auth          |
|--------|--------------------|--------------------------|---------------|
| GET    | /                  | Get all products         | Public        |
| GET    | /:id               | Get product by ID        | Public        |
| POST   | /                  | Create product           | Admin only    |
| PUT    | /:id               | Update product           | Admin only    |
| DELETE | /:id               | Delete product           | Admin only    |
| POST   | /:id/reviews       | Add product review       | Private       |

### Cart (`/api/cart`)

| Method | Endpoint           | Description              | Auth     |
|--------|--------------------|--------------------------|----------|
| GET    | /                  | Get user cart            | Private  |
| POST   | /                  | Add item to cart         | Private  |
| PUT    | /:productId        | Update item quantity     | Private  |
| DELETE | /:productId        | Remove item from cart    | Private  |
| DELETE | /                  | Clear cart               | Private  |

### Orders (`/api/orders`)

| Method | Endpoint           | Description              | Auth          |
|--------|--------------------|--------------------------|---------------|
| POST   | /                  | Create an order          | Private       |
| GET    | /myorders          | Get user's orders        | Private       |
| GET    | /:id               | Get order by ID          | Private       |
| PUT    | /:id/pay           | Mark order as paid       | Private       |
| PUT    | /:id/status        | Update order status      | Admin only    |
| GET    | /all               | Get all orders           | Admin only    |

### Users (`/api/users`)

| Method | Endpoint | Description     | Auth       |
|--------|----------|-----------------|------------|
| GET    | /        | Get all users   | Admin only |
| GET    | /:id     | Get user by ID  | Admin only |
| DELETE | /:id     | Delete user     | Admin only |

## Environment Variables

See `backend/.env.example` for all required environment variables.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/my-feature`)
3. Commit your changes (`git commit -m 'Add some feature'`)
4. Push to the branch (`git push origin feature/my-feature`)
5. Open a Pull Request

## License

MIT
