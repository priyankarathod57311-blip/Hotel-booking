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

    try {
        if (event.type === "checkout.session.completed") {
            const session = event.data.object;

            console.log("Session metadata:", session.metadata);

            const bookingId = session.metadata?.bookingId;

            console.log("Booking ID:", bookingId);

            if (!bookingId) {
                console.error("Booking ID is missing from Stripe metadata");
                return response.status(400).json({
                    success: false,
                    message: "Booking ID missing"
                });
            }

            const updatedBooking = await Booking.findByIdAndUpdate(
                bookingId,
                {
                    isPaid: true,
                    paymentMethod: "Stripe",
                },
                { new: true }
            );

            console.log("Updated booking:", updatedBooking);

            if (!updatedBooking) {
                console.error("Booking not found:", bookingId);

                return response.status(404).json({
                    success: false,
                    message: "Booking not found"
                });
            }
        } else {
            console.log("Unhandled event type:", event.type);
        }

        return response.json({ received: true });

    } catch (error) {
        console.error("Stripe webhook processing error:", error);

        return response.status(500).json({
            success: false,
            message: error.message
        });
    }
};