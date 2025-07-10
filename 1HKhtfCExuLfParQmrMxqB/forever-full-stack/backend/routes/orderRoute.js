import express from 'express'
import {placeOrder,  placeOrderRazorpay, allOrders, userOrders, updateStatus, verifyRazorpay, getAnalytics} from '../controllers/orderController.js'
import adminAuth  from '../middleware/adminAuth.js'
import authUser from '../middleware/auth.js'

const orderRouter = express.Router()

// Admin Features
orderRouter.post('/list',adminAuth,allOrders)
orderRouter.post('/status',adminAuth,updateStatus)
orderRouter.get('/analytics',adminAuth,getAnalytics)

// Payment Features
orderRouter.post('/place',authUser,placeOrder)
orderRouter.post('/razorpay',authUser,placeOrderRazorpay)

// User Feature 
orderRouter.post('/userorders',authUser,userOrders)

// verify payment
orderRouter.post('/verifyRazorpay',authUser, verifyRazorpay)

export default orderRouter