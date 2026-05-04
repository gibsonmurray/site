import { ImageResponse } from "next/og"

export const GET = async (request: Request) => {
    let url = new URL(request.url)
    let title = url.searchParams.get("title") || "Gibson Murray"
    let subtitle =
        url.searchParams.get("subtitle") ||
        "Christian author - Biblical fiction - Essays on faith and craft"
    let image = url.searchParams.get("image")

    let imageUrl = image
        ? /^https?:\/\//i.test(image)
            ? image
            : `${url.origin}${image.startsWith("/") ? "" : "/"}${image}`
        : null

    return new ImageResponse(
        <div
            style={{
                background: "#0f0f0f",
                color: "white",
                display: "flex",
                height: "100%",
                overflow: "hidden",
                position: "relative",
                width: "100%",
            }}
        >
            {imageUrl ? (
                <img
                    src={imageUrl}
                    alt={title}
                    style={{
                        height: "100%",
                        imageOrientation: "from-image",
                        objectFit: "cover",
                        opacity: 0.72,
                        position: "absolute",
                        width: "100%",
                    }}
                />
            ) : (
                <div
                    style={{
                        background:
                            "radial-gradient(circle at 72% 18%, #75401e 0, transparent 36%), linear-gradient(135deg, #111 0%, #2b2a27 100%)",
                        height: "100%",
                        position: "absolute",
                        width: "100%",
                    }}
                />
            )}
            <div
                style={{
                    background:
                        "linear-gradient(90deg, rgba(0,0,0,0.86) 0%, rgba(0,0,0,0.58) 48%, rgba(0,0,0,0.12) 100%)",
                    height: "100%",
                    position: "absolute",
                    width: "100%",
                }}
            />
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    height: "100%",
                    justifyContent: "space-between",
                    padding: "72px",
                    position: "relative",
                    width: "100%",
                }}
            >
                <div
                    style={{
                        color: "#5ad1a1",
                        fontSize: 24,
                        fontWeight: 700,
                        letterSpacing: 7,
                        textTransform: "uppercase",
                    }}
                >
                    Gibson Murray
                </div>
                <div style={{ display: "flex", flexDirection: "column" }}>
                    <div
                        style={{
                            fontSize: title.length > 34 ? 68 : 82,
                            fontWeight: 700,
                            letterSpacing: -2,
                            lineHeight: 1,
                            maxWidth: 850,
                        }}
                    >
                        {title}
                    </div>
                    <div
                        style={{
                            color: "rgba(255,255,255,0.72)",
                            fontSize: 30,
                            lineHeight: 1.35,
                            marginTop: 28,
                            maxWidth: 760,
                        }}
                    >
                        {subtitle}
                    </div>
                </div>
            </div>
        </div>,
        {
            width: 1200,
            height: 630,
        },
    )
}
