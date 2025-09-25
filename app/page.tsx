"use client"

import { Input } from "@/components/ui/input"

const Home = () => {
    return (
        <main className="container mx-auto flex min-h-svh max-w-screen-md flex-col items-center justify-center gap-10 py-10">
            <h1 className="text-2xl font-semibold">ask me anything you want to know about gibson</h1>
            <Input className="w-full rounded-full " />
        </main>
    )
}

export default Home
