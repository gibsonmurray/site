import { Button } from "@/components/ui/button"
import { AnimatePresence, motion } from "motion/react"
import {
    Dispatch,
    FC,
    RefObject,
    SetStateAction,
    useEffect,
    useRef,
    useState,
} from "react"
import { BIBLE_BOOKS } from "@/lib/constants"
import { useWindowContext } from "@/components/window-context"
import { BookMarkedIcon, HeadphonesIcon, HeadphoneOffIcon } from "lucide-react"

type BibleMenuProps = {
    search: string
    onSearchChange: (value: string) => void
    showAudioPlayer: boolean
    onToggleAudioPlayer: () => void
    setBook: (book: string) => void
    setChapter: (chapter: number) => void
    containerRef: RefObject<HTMLDivElement | null>
    menuOpen: boolean
    setMenuOpen: Dispatch<SetStateAction<boolean>>
}

const BibleMenu: FC<BibleMenuProps> = ({
    search,
    onSearchChange,
    showAudioPlayer,
    onToggleAudioPlayer,
    setBook,
    setChapter,
    containerRef,
    menuOpen,
    setMenuOpen,
}) => {
    const { innerSize } = useWindowContext()

    const navRef = useRef<HTMLDivElement>(null)
    const navHeight = navRef.current?.clientHeight || 0

    // useEffect(() => {
    //     if (containerRef.current && menuOpen) {
    //         containerRef.current.style.overflow = "hidden"
    //         containerRef.current.style.height = innerSize.height + "px"
    //     } else if (containerRef.current && !menuOpen) {
    //         containerRef.current.style.overflow = "auto"
    //         containerRef.current.style.height = "auto"
    //     }
    // }, [containerRef, menuOpen])

    return (
        <AnimatePresence>
            <nav
                ref={navRef}
                className="bg-background/50 sticky top-0 z-20 flex w-full items-center justify-between gap-4 px-4 py-2 backdrop-blur-xs"
            >
                <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full"
                    onClick={() => setMenuOpen(!menuOpen)}
                >
                    <BookMarkedIcon className="size-4" />
                </Button>

                <div className="relative flex w-full items-center">
                    {/* <Input
                    type="search"
                    placeholder="Search for a passage..."
                    className="w-full rounded-full ps-9"
                    value={search}
                    onChange={(e) => onSearchChange(e.target.value)}
                />
                <Button
                    variant="ghost"
                    size="icon"
                    className="absolute left-0 rounded-full"
                >
                    <SearchIcon className="size-4" />
                </Button> */}
                </div>

                <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full"
                    onClick={onToggleAudioPlayer}
                >
                    {showAudioPlayer ? (
                        <HeadphonesIcon className="size-4" />
                    ) : (
                        <HeadphoneOffIcon className="size-4" />
                    )}
                </Button>

                {/* <Button variant="ghost" size="icon" className="rounded-full">
                <Settings2Icon className="size-4" />
            </Button> */}
            </nav>

            {menuOpen && (
                <motion.div
                    key="bible-menu"
                    initial={{ height: 0 }}
                    animate={{ height: innerSize.height - navHeight }}
                    style={{ marginTop: navHeight }}
                    exit={{ height: 0 }}
                    transition={{ ease: "easeInOut" }}
                    className="bg-background/50 absolute top-0 left-0 z-10 w-full overflow-y-auto backdrop-blur-sm"
                >
                    <div className="flex flex-col gap-4">
                        {BIBLE_BOOKS.map((book) => (
                            <Button
                                key={book.id}
                                variant="simple"
                                size="lg"
                                className="rounded-full"
                            >
                                {book.name}
                            </Button>
                        ))}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}

export default BibleMenu
