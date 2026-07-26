import User from "../models/User.js";
import { Webhook } from "svix";

const clerkWebhooks = async (req, res) => {
    console.log("Webhook reached")
    try {
        // Create a Svix instance with Clerk webhook secret
        const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

        // Getting Headers
        const headers = {
            "svix-id": req.headers["svix-id"],
            "svix-timestamp": req.headers["svix-timestamp"],
            "svix-signature": req.headers["svix-signature"],
        };

        // Verifying Headers
        await whook.verify(JSON.stringify(req.body), headers);

        // Getting Data from request body
        const { data, type } = req.body
        console.log("Webhook Data:", data);
        console.log("Request Body:", JSON.stringify(req.body, null, 2));
        
                const userData = {
            _id: data.id,
            email: data.email_addresses[0].email_address,
            username: data.first_name + " " + data.last_name,
            image: data.image_url,
        };

console.log("User Data:", userData);
        
        switch (type) {
            case "user.created":
    try {
        const user = await User.create(userData);
        console.log("User saved:", user);
    } catch (err) {
        console.log("MongoDB Error:", err);
    }
    break;
            
            case "user.updated":
                await User.findByIdAndUpdate(data.id, userData);
                break;

            case "user.deleted":
                await User.findByIdAndDelete(data.id);
                break;

            default:
                break;
        }

        res.json({ success: true, message: "Webhook Received" });

    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
}

export default clerkWebhooks;
