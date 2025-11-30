import { AnimatePresence, motion } from "motion/react"
import AudioPlayer from "react-h5-audio-player"
import {
    PlayIcon,
    PauseIcon,
    FastForwardIcon,
    RewindIcon,
    Volume2Icon,
    VolumeOffIcon,
    Repeat1Icon,
    RepeatIcon,
} from "lucide-react"
import { FC } from "react"

type BibleAudioPlayerProps = {
    show: boolean
    audioSrc: string | undefined
}

export const BibleAudioPlayer: FC<BibleAudioPlayerProps> = ({
    show,
    audioSrc,
}) => {
    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.3 }}
                    className="fixed right-0 bottom-0 left-0 mx-auto mb-1 max-w-2xl backdrop-blur-xs!"
                >
                    <AudioPlayer
                        src={audioSrc}
                        customIcons={{
                            play: <PlayIcon />,
                            pause: <PauseIcon />,
                            forward: <FastForwardIcon />,
                            rewind: <RewindIcon />,
                            volume: <Volume2Icon />,
                            volumeMute: <VolumeOffIcon />,
                            loop: <Repeat1Icon />,
                            loopOff: <RepeatIcon />,
                        }}
                        className="bg-background/50! shadow-none!"
                    />
                </motion.div>
            )}
        </AnimatePresence>
    )
}
