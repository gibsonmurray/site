import Link from "next/link"
import Image, { ImageProps } from "next/image"
import { MDXRemote, MDXRemoteProps } from "next-mdx-remote/rsc"
import remarkGfm from "remark-gfm"
import { highlight } from "sugar-high"
import React, { FC } from "react"
import { Pre } from "@/components/mdx-pre"

const Table: FC<{ data: { headers: string[]; rows: string[][] } }> = ({
    data,
}) => {
    const headers = data.headers.map((header, index) => (
        <th key={index}>{header}</th>
    ))
    const rows = data.rows.map((row, index) => (
        <tr key={index}>
            {row.map((cell, cellIndex) => (
                <td key={cellIndex}>{cell}</td>
            ))}
        </tr>
    ))

    return (
        <table>
            <thead>
                <tr>{headers}</tr>
            </thead>
            <tbody>{rows}</tbody>
        </table>
    )
}

const CustomLink: FC<
    {
        children: React.ReactNode
        href: string
    } & React.HTMLAttributes<HTMLAnchorElement>
> = ({ children, href, ...props }) => {
    if (href.startsWith("/")) {
        return (
            <Link href={href} {...props}>
                {children}
            </Link>
        )
    }

    if (href.startsWith("#")) {
        return (
            <a href={href} {...props}>
                {children}
            </a>
        )
    }

    return (
        <a href={href} target="_blank" rel="noopener noreferrer" {...props}>
            {children}
        </a>
    )
}

type RoundedImageProps = Omit<ImageProps, "alt"> & {
    alt?: string
}

const RoundedImage: FC<RoundedImageProps> = ({
    alt = "",
    className,
    width,
    height,
    ...props
}) => {
    const mergedClassName = ["rounded-[0.25rem]", className]
        .filter(Boolean)
        .join(" ")

    if (typeof width === "number" && typeof height === "number") {
        return (
            <Image
                alt={alt}
                width={width}
                height={height}
                className={mergedClassName}
                {...props}
            />
        )
    }

    return (
        <span className="relative block aspect-4/3 w-full overflow-hidden rounded-[0.25rem]">
            <Image
                alt={alt}
                fill
                sizes="100vw"
                className={["object-cover", mergedClassName]
                    .filter(Boolean)
                    .join(" ")}
                {...props}
            />
        </span>
    )
}

const Code: FC<{ children: React.ReactNode | string }> = ({
    children,
    ...props
}) => {
    const codeHTML = highlight((children as string) || "")
    return <code dangerouslySetInnerHTML={{ __html: codeHTML }} {...props} />
}

const slugify = (str: string) => {
    return str
        .toString()
        .toLowerCase()
        .trim() // Remove whitespace from both ends of a string
        .replace(/\s+/g, "-") // Replace spaces with -
        .replace(/&/g, "-and-") // Replace & with 'and'
        .replace(/[^\w\-]+/g, "") // Remove all non-word characters except for -
        .replace(/\-\-+/g, "-") // Replace multiple - with single -
}

const createHeading = (level: number) => {
    const Heading = ({ children }) => {
        const slug = slugify(children)
        return React.createElement(
            `h${level}`,
            { id: slug },
            [
                React.createElement("a", {
                    href: `#${slug}`,
                    key: `link-${slug}`,
                    className: "anchor",
                }),
            ],
            children,
        )
    }

    Heading.displayName = `Heading${level}`

    return Heading
}

const components = {
    h1: createHeading(1),
    h2: createHeading(2),
    h3: createHeading(3),
    h4: createHeading(4),
    h5: createHeading(5),
    h6: createHeading(6),
    img: RoundedImage,
    a: CustomLink,
    code: Code,
    pre: Pre,
    Table,
}

export const CustomMDX: FC<MDXRemoteProps> = (props) => {
    return (
        <MDXRemote
            {...props}
            options={{
                mdxOptions: {
                    remarkPlugins: [remarkGfm],
                },
            }}
            components={{ ...components, ...(props.components || {}) }}
        />
    )
}
