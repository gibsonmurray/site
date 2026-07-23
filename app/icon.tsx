import { ImageResponse } from "next/og"

export const size = {
    width: 64,
    height: 64,
}

export const contentType = "image/png"

export default function Icon() {
    return new ImageResponse(
        (
            <div
                style={{
                    alignItems: "center",
                    background: "#ffffff",
                    borderRadius: "50%",
                    color: "#171714",
                    display: "flex",
                    height: "100%",
                    justifyContent: "center",
                    width: "100%",
                }}
            >
                <svg
                    fill="none"
                    height="46"
                    viewBox="0 0 184 184"
                    width="46"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M32.6521 150.895C-28.6999 89.5427 32.6518 7.74029 94.0039 7.74021C155.356 7.74012 109.342 156.007 68.4408 115.106C27.5395 74.2046 175.806 28.1912 175.806 89.5432C175.806 150.895 94.0041 212.247 32.6521 150.895Z"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeWidth="14.4608"
                    />
                </svg>
            </div>
        ),
        size,
    )
}
