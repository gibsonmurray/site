"use client"

import { useRef, useState } from "react"
import { useMutation } from "@tanstack/react-query"
import { Check, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export const NewsletterSignup = () => {
    const [submitted, setSubmitted] = useState(false)
    const inputRef = useRef<HTMLInputElement>(null)

    const mutation = useMutation({
        mutationFn: async (email: string) => {
            const res = await fetch("/api/newsletter", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            })
            const data = await res.json()
            if (!res.ok) throw new Error(data.error ?? "Something went wrong")
        },
        onSuccess: () => setSubmitted(true),
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        const email = inputRef.current?.value.trim() ?? ""
        if (email) mutation.mutate(email)
    }

    return (
        <div className="border-border/65 bg-background/80 rounded-xl border p-4 sm:p-5">
            <h2 className="border-primary/45 text-muted-foreground mb-4 border-l-2 pl-3 text-xs font-semibold tracking-[0.12em] uppercase">
                Newsletter
            </h2>
            {submitted ? (
                <div className="flex items-center gap-2 text-sm">
                    <Check className="text-primary size-4 shrink-0" />
                    <span className="text-foreground font-medium">
                        {"You're subscribed! Thanks for signing up."}
                    </span>
                </div>
            ) : (
                <div className="flex flex-col gap-3">
                    <p className="text-muted-foreground text-sm leading-relaxed">
                        New posts, book updates, and occasional news — straight
                        to your inbox. No spam, ever.
                    </p>
                    <form
                        onSubmit={handleSubmit}
                        className="flex flex-col gap-2 sm:flex-row"
                    >
                        <Input
                            ref={inputRef}
                            type="email"
                            required
                            placeholder="your@email.com"
                            className="h-9 flex-1"
                        />
                        <Button
                            type="submit"
                            size="lg"
                            disabled={mutation.isPending}
                            className="gap-1.5 sm:shrink-0"
                        >
                            <Mail className="size-3.5" />
                            {mutation.isPending ? "..." : "Subscribe"}
                        </Button>
                    </form>
                    {mutation.isError && (
                        <p className="text-destructive text-xs">
                            {mutation.error?.message ??
                                "Something went wrong. Try again."}
                        </p>
                    )}
                </div>
            )}
        </div>
    )
}
