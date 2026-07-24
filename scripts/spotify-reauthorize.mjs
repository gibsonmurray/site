import { createServer } from "node:http"
import { randomBytes } from "node:crypto"
import { readFile, writeFile } from "node:fs/promises"

const redirectUri = "http://127.0.0.1:3000/api/spotify/callback"
const envPath = new URL("../.env.local", import.meta.url)
const envText = await readFile(envPath, "utf8")

function envValue(name) {
    const match = envText.match(new RegExp(`^${name}=(.*)$`, "m"))
    return match?.[1]?.replace(/^(['"])(.*)\1$/, "$2")
}

const clientId = envValue("SPOTIFY_CLIENT_ID")
const clientSecret = envValue("SPOTIFY_CLIENT_SECRET")

if (!clientId || !clientSecret) {
    throw new Error("SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET must be set in .env.local")
}

const state = randomBytes(24).toString("hex")
const authorizeUrl = new URL("https://accounts.spotify.com/authorize")
authorizeUrl.search = new URLSearchParams({
    client_id: clientId,
    response_type: "code",
    redirect_uri: redirectUri,
    scope: "user-read-recently-played",
    state,
    show_dialog: "true",
}).toString()

const completion = new Promise((resolve, reject) => {
    const server = createServer(async (request, response) => {
        const requestUrl = new URL(request.url ?? "/", redirectUri)
        if (requestUrl.pathname !== "/api/spotify/callback") {
            response.writeHead(404).end("Not found")
            return
        }

        try {
            if (requestUrl.searchParams.get("state") !== state) {
                throw new Error("OAuth state did not match")
            }

            const oauthError = requestUrl.searchParams.get("error")
            if (oauthError) throw new Error(`Spotify authorization failed: ${oauthError}`)

            const code = requestUrl.searchParams.get("code")
            if (!code) throw new Error("Spotify callback did not include an authorization code")

            const tokenResponse = await fetch("https://accounts.spotify.com/api/token", {
                method: "POST",
                headers: {
                    Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                body: new URLSearchParams({
                    code,
                    redirect_uri: redirectUri,
                    grant_type: "authorization_code",
                }),
            })
            const token = await tokenResponse.json()

            if (!tokenResponse.ok || !token.access_token || !token.refresh_token) {
                throw new Error(`Spotify token exchange failed: ${token.error_description ?? token.error ?? tokenResponse.status}`)
            }

            const recentResponse = await fetch(
                "https://api.spotify.com/v1/me/player/recently-played?limit=1",
                { headers: { Authorization: `Bearer ${token.access_token}` } },
            )
            const recent = await recentResponse.json()

            if (!recentResponse.ok) {
                throw new Error(`Recently played verification failed: ${recent.error?.message ?? recentResponse.status}`)
            }

            const nextEnvText = /^SPOTIFY_REFRESH_TOKEN=/m.test(envText)
                ? envText.replace(/^SPOTIFY_REFRESH_TOKEN=.*$/m, `SPOTIFY_REFRESH_TOKEN=${token.refresh_token}`)
                : `${envText.replace(/\s*$/, "\n")}SPOTIFY_REFRESH_TOKEN=${token.refresh_token}\n`
            await writeFile(envPath, nextEnvText, { mode: 0o600 })

            response.writeHead(200, { "Content-Type": "text/html; charset=utf-8" })
            response.end("<h1>Spotify reauthorized</h1><p>The new refresh token was verified and saved locally. You can close this tab.</p>")
            resolve({ refreshToken: token.refresh_token, itemCount: recent.items?.length ?? 0 })
        } catch (error) {
            response.writeHead(400, { "Content-Type": "text/plain; charset=utf-8" })
            response.end(error instanceof Error ? error.message : "Spotify authorization failed")
            reject(error)
        } finally {
            server.close()
        }
    })

    server.on("error", reject)
    server.listen(3000, "127.0.0.1", () => {
        console.log(`SPOTIFY_AUTHORIZE_URL=${authorizeUrl}`)
        console.log(`Waiting for Spotify callback at ${redirectUri}`)
    })
})

const timeout = setTimeout(() => {
    console.error("Timed out waiting for Spotify authorization")
    process.exit(1)
}, 15 * 60 * 1000)

try {
    const result = await completion
    clearTimeout(timeout)
    console.log(`Spotify authorization verified (${result.itemCount} recent item).`)
    console.log("Updated SPOTIFY_REFRESH_TOKEN in .env.local.")
} catch (error) {
    clearTimeout(timeout)
    console.error(error instanceof Error ? error.message : error)
    process.exitCode = 1
}
