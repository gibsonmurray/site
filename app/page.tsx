import Dock from "@/components/dock"
import Logo from "@/components/logo"
import Image from "next/image"

const Home = () => {
    return (
        <div className="relative flex min-h-svh w-screen items-center justify-center overflow-hidden">
            <Image
                src="https://xs83fzgbku8yujf0.public.blob.vercel-storage.com/macOS-wallpaper.jpg"
                alt="Background"
                fill
                priority
                className="pointer-events-none object-cover select-none"
            />
            <Dock />
            <Logo className="size-20 stroke-white opacity-60" />
        </div>
    )
}

export default Home
