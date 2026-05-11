import { loadEnvConfig } from "@next/env"
import { Resend } from "resend"
import { wallsPreorderBroadcast } from "@/lib/emails/walls-preorder-broadcast"

loadEnvConfig(process.cwd())

const apiKey = process.env.RESEND_API_KEY
const segmentId = process.env.RESEND_PREORDER_SEGMENT_ID

if (!apiKey) {
    throw new Error("Missing RESEND_API_KEY")
}

if (!segmentId) {
    throw new Error("Missing RESEND_PREORDER_SEGMENT_ID")
}

const resend = new Resend(apiKey)

const { data, error } = await resend.broadcasts.create({
    segmentId,
    ...wallsPreorderBroadcast,
    send: false,
})

if (error) {
    throw new Error(error.message)
}

console.log(`Created draft broadcast: ${data?.id}`)
