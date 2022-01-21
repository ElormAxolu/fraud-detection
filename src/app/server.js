import express from 'express';
import 'dotenv/config'
import morgan from 'morgan'
import cors from 'cors'
import mongoSanitize from 'express-mongo-sanitize'
import helmet from 'helmet'
import xss from 'xss-clean'
import hpp from 'hpp'
import bodyParser from 'body-parser';
import Stripe from 'stripe'

const stripe = new Stripe(process.env.API_KEY)
// import fs from 'fs'
// import path from 'path'
const app = express();


app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(express.raw())
app.use(express.text())
app.use(morgan('dev'))
app.use(cors())
app.use(mongoSanitize()) //Use for security to prevent NoSql injections
app.use(helmet()) //Adds extra headers to protect the routes
app.use(xss()) //To prevent a harmful script being sent with the POST request
app.use(hpp()) //To prevent HTTP Parameter Pollution.


/**
 * Initiate the Routes
 * All Routes to begin with /api/v1/{the routes}
 */
 const router = express.Router()
 app.use('/api/v1', router)
 
;

// Default Route
router.get('/', (req, res, next) => {
    res.status(200).json({
        success: true,
        message: 'Welcome to Fraud Detection - API',
        author: 'Wonchunii Ltd',
        website: 'www.wonchunii.com',
    })
})
/**
 * The Routes
 */
// Error Route
app.get('/', (req, res, next) => {
    res.status(200).json({
        success: true,
        message: 'Oops you have missed your way',
        author: 'Isichei Phelim',
        website: '',
    })
})

// Match the raw body to content type application/json
app.post('/webhook', bodyParser.raw({type: 'application/json'}),async (req, res) => {
    const event = req.body;
  
    // Handle the event
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object;
        console.log('PaymentIntent was successful!');
        break;
      case 'payment_method.attached':
        const paymentMethod = event.data.object;
        console.log('PaymentMethod was attached to a Customer!');
        break;
      // ... handle other event types
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    // Return a 200 response to acknowledge receipt of the event
    res.json({received: true,});
  });

  app.get('/v1/events', bodyParser.raw({type: 'application/json'}),async (req, res) => {
    const events = await stripe.events.list({
        limit: 10,
      });

    // Return a 200 response to acknowledge receipt of the event
    res.json({received: true, lists: events});
  });

export { app }
