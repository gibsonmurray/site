import { ImageResponse } from "next/og"

export const GET = async (request: Request) => {
    let url = new URL(request.url)
    let title = url.searchParams.get("title") || "Gibson Murray"
    let image = url.searchParams.get("image")

    let imageUrl = image
        ? /^https?:\/\//i.test(image)
            ? image
            : `${url.origin}${image.startsWith("/") ? "" : "/"}${image}`
        : null

    return new ImageResponse(
        <div tw="relative flex flex-col w-full h-full items-center justify-center bg-white overflow-hidden">
            {imageUrl && (
                <img
                    src={imageUrl}
                    alt=""
                    tw="absolute inset-0 w-full h-full object-cover"
                />
            )}
            <div
                tw="absolute inset-0"
                style={{
                    backgroundColor: imageUrl
                        ? "rgba(0, 0, 0, 0.45)"
                        : "rgba(255, 255, 255, 1)",
                }}
            />
            <div tw="relative flex flex-col md:flex-row w-full py-12 px-4 md:items-center justify-between p-8">
                <h2
                    tw="flex flex-col text-4xl font-bold tracking-tight text-left"
                    style={{ color: imageUrl ? "#fff" : "#000" }}
                >
                    {title}
                </h2>
            </div>
        </div>,
        {
            width: 1200,
            height: 630,
        },
    )
}
