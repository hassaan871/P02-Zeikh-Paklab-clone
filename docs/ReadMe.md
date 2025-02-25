# E-Commerce API

## Overview
This is a Node.js-based e-commerce REST API built using Express.js and MongoDB. It provides user authentication, product management, cart functionality, order processing, and review system.

## Features
- **User Authentication:** Registration, login, password reset
- **Admin Management:** Promote/demote admins, manage users
- **Product Management:** Laptops and smartwatches
- **Cart System:** Add/remove items from cart
- **Order Processing:** Checkout, confirm, cancel orders
- **Review System:** Users can review purchased products

## Technologies Used
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- Multer (for image uploads)
- Cloudinary (for storing images)

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/https://github.com/hassaan871/P02-Zeikh-Paklab-clone.git
   ```
2. Navigate into the project directory:
   ```bash
   cd P02-Zeikh-Paklab-clone
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Create a `.env` file and configure it:
   ```env
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_secret_key
   CLOUDINARY_CLOUD_NAME=your_cloudinary_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_secret
   ```
5. Start the server:
   ```bash
   npm start
   ```

## API Endpoints

### User Routes
- `POST /v1/user/register` - Register a new user
- `POST /v1/user/login` - User login
- `POST /v1/user/forget-password` - Request password reset
- `PATCH /v1/user/reset-password` - Reset password
- `GET /v1/user/account-info` - Get user details (Auth required)
- `PATCH /v1/user/phone-number` - Update phone number (Auth required)
- `PATCH /v1/user/street-address` - Update street address (Auth required)
- `PATCH /v1/user/province` - Update province (Auth required)
- `PATCH /v1/user/city` - Update city (Auth required)
- `PATCH /v1/user/postal-code` - Update postal code (Auth required)
- `PATCH /v1/user/add-to-wishlist` - Add item to wishlist (Auth required)
- `DELETE /v1/user/remove-from-wishlist` - Remove item from wishlist (Auth required)

### Admin Routes
- `POST /v1/admin/login-admin` - Admin login
- `GET /v1/admin/get-all-users` - Retrieve all users (Admin required)
- `PATCH /v1/admin/make-admin` - Promote a user to admin (Super Admin required)
- `PATCH /v1/admin/remove-from-admin` - Remove admin privileges (Super Admin required)

### Product Routes
- `GET /v1/product/get-all-laptops` - Retrieve all laptops
- `GET /v1/product/get-all-smartwatches` - Retrieve all smartwatches
- `POST /v1/product/search-laptop` - Search for a laptop
- `POST /v1/product/search-smartwatch` - Search for a smartwatch
- `GET /v1/product/get-all-used-laptops` - Retrieve used laptops
- `GET /v1/product/get-all-new-laptops` - Retrieve new laptops
- `POST /v1/admin/create-laptop-product` - Add a laptop product (Admin required)
- `POST /v1/admin/create-smartwatch-product` - Add a smartwatch product (Admin required)
- `PATCH /v1/admin/upload-laptop-image` - Upload laptop image (Admin required)
- `PATCH /v1/admin/upload-smartwatch-image` - Upload smartwatch image (Admin required)
- `PATCH /v1/admin/delete-laptop` - Delete a laptop (Admin required)
- `PATCH /v1/admin/delete-smartwatch` - Delete a smartwatch (Admin required)

### Cart Routes
- `POST /v1/cart/add-to-cart` - Add an item to cart (Auth required)
- `DELETE /v1/cart/delete-from-cart` - Remove an item from cart (Auth required)
- `GET /v1/cart/get-cart` - Retrieve user's cart (Auth required)

### Order Routes
- `POST /v1/order/checkout` - Checkout (Auth required)
- `POST /v1/order/confirm-order` - Confirm order (Auth required)
- `PATCH /v1/order/cancel-order` - Cancel order (Auth required)

### Review Routes
- `POST /v1/review/add-review` - Add a review (Auth required)
- `POST /v1/review/update-review` - Update a review (Auth required)
- `DELETE /v1/review/delete-review` - Delete a review (Auth required)

## Running in Development Mode
Use nodemon to automatically restart the server on changes:
```bash
npm start
```

## Contribution
Feel free to contribute by submitting pull requests or reporting issues.

## License
This project is licensed under the MIT License.

