import { Router } from "express";
import { requireAuth } from "../../middlewares/auth.middleware";
import {
  brokerCallbackController,
  brokerConnectController,
  getBrokerAccountsController,
} from "./broker.controller";

const router = Router();

/**
 * @swagger
 * /api/v1/broker/accounts:
 *   get:
 *     summary: Get connected broker accounts
 *     tags:
 *       - Broker
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of connected brokers
 *       401:
 *         description: Unauthorized
 */
router.get("/accounts", requireAuth, getBrokerAccountsController);

/**
 * @swagger
 * /api/v1/broker/{broker}/connect:
 *   get:
 *     summary: Redirect user to broker OAuth login
 *     tags:
 *       - Broker
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: broker
 *         required: true
 *         schema:
 *           type: string
 *           enum: [upstox]
 *         description: Broker name
 *     responses:
 *       302:
 *         description: Redirects to broker OAuth page
 *       401:
 *         description: Unauthorized
 */
router.get("/:broker/connect", brokerConnectController);

/**
 * @swagger
 * /api/v1/broker/{broker}/callback:
 *   get:
 *     summary: Broker OAuth callback
 *     tags:
 *       - Broker
 *     parameters:
 *       - in: path
 *         name: broker
 *         required: true
 *         schema:
 *           type: string
 *           enum: [upstox]
 *       - in: query
 *         name: code
 *         required: true
 *         schema:
 *           type: string
 *         description: OAuth authorization code
 *       - in: query
 *         name: state
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID passed during OAuth redirect
 *     responses:
 *       302:
 *         description: Redirects to frontend after successful connection
 *       400:
 *         description: Invalid request
 */
router.get("/:broker/callback", brokerCallbackController);

export default router;
