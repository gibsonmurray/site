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
        imageUrl ? (
            <img
                src={imageUrl}
                alt={title}
                className="size-full object-cover"
                style={{ imageOrientation: "from-image" }}
            />
        ) : (
            <div className="flex size-full items-center justify-center text-6xl font-bold">
                {title}
            </div>
        ),
        {
            width: 1200,
            height: 630,
        },
    )
}
