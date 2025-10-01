import Dock from "@/components/dock"

const Home = () => {
    return (
        <div className="relative min-h-svh w-screen overflow-hidden">
            <video
                src="https://www.pexels.com/download/video/3121459/"
                className="h-svh object-cover"
                autoPlay
                loop
                muted
                playsInline
            ></video>

            <Dock />
        </div>
    )
}

export default Home
