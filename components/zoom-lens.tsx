export function ZoomLens({ text }: { text: string }) {
    return (
        <span className="zoom-liquid-shell">
            <svg aria-hidden="true" className="zoom-filter-defs">
                <defs>
                    <filter
                        colorInterpolationFilters="sRGB"
                        height="180%"
                        id="zoom-lens-goo"
                        width="180%"
                        x="-40%"
                        y="-40%"
                    >
                        <feGaussianBlur
                            in="SourceGraphic"
                            result="blurred"
                            stdDeviation="2.4"
                        />
                        <feColorMatrix
                            in="blurred"
                            result="goo"
                            type="matrix"
                            values="1 0 0 0 0
                                    0 1 0 0 0
                                    0 0 1 0 0
                                    0 0 0 18 -8"
                        />
                        <feComposite in="SourceGraphic" in2="goo" operator="atop" />
                    </filter>
                </defs>
            </svg>
            <span className="zoom-liquid-group">
                <span className="zoom-liquid-blobs" aria-hidden="true">
                    <span className="zoom-liquid-blob zoom-liquid-blob-one" />
                    <span className="zoom-liquid-blob zoom-liquid-blob-two" />
                </span>
                <span className="zoom-liquid-lens">
                    <span className="zoom-lens-viewport">
                        <span className="zoom-lens-copy">{text}</span>
                    </span>
                    <span className="zoom-lens-sheen" />
                </span>
            </span>
        </span>
    )
}
