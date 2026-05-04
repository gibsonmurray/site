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
        <div className="app-panel">
            {submitted ? (
                <div className="flex flex-1 flex-col justify-center gap-4">
                    <div className="bg-primary/10 text-primary flex size-12 items-center justify-center rounded-full">
                        <Check className="size-5" />
                    </div>
                    <div>
                        <p className="text-foreground text-3xl font-semibold tracking-tight">
                            You&apos;re subscribed.
                        </p>
                        <p className="text-muted-foreground mt-3 text-base leading-7">
                            Thanks for signing up. I&apos;ll send the next note
                            your way.
                        </p>
                    </div>
                </div>
            ) : (
                <div className="flex flex-1 flex-col">
                    <div>
                        <h2 className="app-eyebrow">Newsletter</h2>
                        <p className="app-panel-title">Notes from the desk.</p>
                        <p className="app-panel-copy">
                            Book updates, biblical reflections, essays, and
                            occasional dispatches. No spam, ever.
                        </p>
                    </div>
                    <form
                        onSubmit={handleSubmit}
                        className="mt-auto flex flex-col gap-4 pt-10 sm:flex-row sm:gap-3 sm:pt-8"
                    >
                        <Input
                            ref={inputRef}
                            type="email"
                            required
                            placeholder="your@email.com"
                            className="h-14 flex-1 rounded-full px-6 text-lg sm:h-12 sm:px-5 sm:text-base"
                        />
                        <Button
                            type="submit"
                            size="lg"
                            disabled={mutation.isPending}
                            className="h-16 gap-3 rounded-full px-6 text-lg sm:h-12 sm:shrink-0 sm:gap-2 sm:px-5 sm:text-base"
                        >
                            <Mail className="size-5 sm:size-4" />
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
