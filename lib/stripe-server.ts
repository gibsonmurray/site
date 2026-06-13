import "server-only"
import Stripe from "stripe"

export const getCheckoutStripe = () => {
    const key =
        process.env.STRIPE_CHECKOUT_SECRET_KEY ??
        process.env.STRIPE_LIVE_KEY ??
        process.env.STRIPE_SECRET_KEY

    if (!key) {
        throw new Error("Stripe checkout secret key is not configured")
    }

    return new Stripe(key)
}
