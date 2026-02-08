import Link from "next/link"
import Image, { ImageProps } from "next/image"
import { MDXRemote, MDXRemoteProps } from "next-mdx-remote/rsc"
import { highlight } from "sugar-high"
import React, { FC } from "react"

const Table: FC<{ data: { headers: string[]; rows: string[][] } }> = ({
    data,
}) => {
    let headers = data.headers.map((header, index) => (
        <th key={index}>{header}</th>
    ))
    let rows = data.rows.map((row, index) => (
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
        return <a {...props} />
    }

    return <a target="_blank" rel="noopener noreferrer" {...props} />
}

const RoundedImage: FC<{ alt: string } & ImageProps> = ({ alt, ...props }) => {
    return <Image alt={alt} className="rounded-lg" {...props} />
}

const Code: FC<{ children: React.ReactNode | string }> = ({
    children,
    ...props
}) => {
    let codeHTML = highlight((children as string) || "")
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
        let slug = slugify(children)
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

let components = {
    h1: createHeading(1),
    h2: createHeading(2),
    h3: createHeading(3),
    h4: createHeading(4),
    h5: createHeading(5),
    h6: createHeading(6),
    Image: RoundedImage,
    a: CustomLink,
    code: Code,
    Table,
}

export const CustomMDX: FC<MDXRemoteProps> = (props) => {
    return (
        <MDXRemote
            {...props}
            components={{ ...components, ...(props.components || {}) }}
        />
    )
}
