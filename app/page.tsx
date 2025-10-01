import Dock from "@/components/dock"
import Image from "next/image"

const Home = () => {
    return (
        <div className="relative min-h-svh w-screen overflow-hidden">
            <Image
                src="https://xs83fzgbku8yujf0.public.blob.vercel-storage.com/macOS-wallpaper.jpg"
                alt="Background"
                fill
                priority
                className="object-cover"
            />
            <Dock />
        </div>
    )
}

export default Home
