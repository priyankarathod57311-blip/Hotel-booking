import Stripe from "stripe";
import Booking from "../models/Booking.js";

// API to handle Stripe Webhooks
export const stripeWebhooks = async (request, response) => {
    console.log("Stripe webhook received");

    const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);
    const sig = request.headers["stripe-signature"];
    let event;

    try {
        event = stripeInstance.webhooks.constructEvent(
            request.body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET
        );
    } catch (error) {
        console.error("Webhook Error:", error.message);
        return response.status(400).send(`Webhook Error: ${error.message}`);
    }

    console.log("Event type:", event.type);

    if (event.type === "checkout.session.completed") {
        const session = event.data.object;
        console.log("Session metadata:", session.metadata);

        const { bookingId } = session.metadata;

        const updatedBooking = await Booking.findByIdAndUpdate(
            bookingId,
            {
                isPaid: true,
                paymentMethod: "Stripe",
            },
            { new: true }
        );

        console.log("Updated booking:", updatedBooking);
    } else {
        console.log("Unhandled event type:", event.type);
    }

    response.json({ received: true });
};