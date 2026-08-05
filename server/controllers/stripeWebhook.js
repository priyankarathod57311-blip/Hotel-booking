import Stripe from "stripe";
import Booking from "../models/Booking.js";

// API to handle Stripe Webhooks

export const stripeWebhooks = async (request, response)=>{
    // Stripe GateWay Initialize
    const stripInstance = new stripe(process.env.STRIPE_SECRET_KEY);
    const sig = request.headers['stripe-signature'];
    let event;

    try {
        event = stripeInstance.webhooks.constructEvent(request.body, sig, process.env.STRIPE_WEBHOOK_SECRET)

    } catch (error) {
        response.status(400).send(`Webhook Error: ${error.message}`)

    }
    // Handle the event
    if(event.type === "payment_intent.succeeded"){
        const paymentIntent = event.data.object;
        const paymentIntentId = paymentIntent.id;

        // Getting Session Metadata
        const session = await stripeInstance.checkout.session.list({
            payment_intent: paymentIntentId,

        });

        const { bookingId } = session.data[0].metadata;
        // Mark Payment as Paid
        await Booking.findByIdAndUpdate(bookingId, {isPaid: true, paymentMethod:"Stripe"})
    }else{
        console.log("Unhandled even type:", event.type)

    }
    response.json({ received: true });
}