export const publicContactEmail = "hi@gibsonmurray.com"

export const notificationEmail =
    process.env.NOTIFICATION_EMAIL ??
    process.env.ORDER_NOTIFICATION_EMAIL ??
    publicContactEmail
