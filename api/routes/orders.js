const express = require("express");
const router = express.Router();
const OrdersController = require("../controllers/order");

/**
 * @swagger
 * /orders/:
 *   get:
 *     tags:
 *       - Orders
 *     description: Returns multiple orders
 *     produces:
 *       - application/json     
 *     responses:
 *       200:
 *         description: Orders list
 */
router.get("/", OrdersController.orders_get_all);


/**
 * @swagger
 * /orders/:
 *   post:
 *     tags:
 *       - Orders
 *     description: Creates a new order
 *     produces:
 *       - application/json
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:      # Request body contents
 *             type: object
 *             properties:
 *               quantity:
 *                 type: integer
 *               productId:
 *                 type: string
 *             example:   # Sample object
 *               quantity: 10
 *               productId: 5fd8ad0d79ff8901d0a38085     
 *     responses:
 *       200:
 *         description: Successfully created 
 */
router.post("/", OrdersController.order_post);


router.get("/:orderId", OrdersController.order_getById);


router.delete("/:orderId", OrdersController.order_deleteOne);


module.exports = router;
