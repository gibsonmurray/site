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
import {
    BookMarkedIcon,
    HeadphonesIcon,
    HeadphoneOffIcon,
    XIcon,
    ChevronLeftIcon,
    SearchIcon,
} from "lucide-react"
import { Input } from "@/components/ui/input"

type BibleMenuProps = {
    search: string
    onSearchChange: (value: string) => void
    onSearchSubmit: () => void
    onClearSearch: () => void
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
    onSearchSubmit,
    onClearSearch,
    showAudioPlayer,
    onToggleAudioPlayer,
    setBook,
    setChapter,
    containerRef,
    menuOpen,
    setMenuOpen,
}) => {
    const { innerSize } = useWindowContext()
    const [selectedBook, setSelectedBook] = useState<string | null>(null)

    const navRef = useRef<HTMLDivElement>(null)
    const navHeight = navRef.current?.clientHeight || 0

    const currentBookData = selectedBook
        ? BIBLE_BOOKS.find((book) => book.id === selectedBook)
        : null

    const handleBookSelect = (bookId: string) => {
        setSelectedBook(bookId)
    }

    const handleChapterSelect = (chapter: number) => {
        if (selectedBook) {
            setBook(selectedBook)
            setChapter(chapter)
            onClearSearch()
            setMenuOpen(false)
            setSelectedBook(null)
        }
    }

    const handleBackToBooks = () => {
        setSelectedBook(null)
    }

    // Reset selected book when menu closes
    useEffect(() => {
        if (!menuOpen) {
            setSelectedBook(null)
        }
    }, [menuOpen])

    const handleSearchSubmit = () => {
        if (search.trim().length > 0) {
            onSearchSubmit()
            setMenuOpen(false)
        }
    }

    const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            handleSearchSubmit()
        }
    }

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
                    {menuOpen ? (
                        <XIcon className="animate-in spin-in size-4" />
                    ) : (
                        <BookMarkedIcon className="animate-in -spin-in size-4" />
                    )}
                </Button>

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
                    className="bg-background/50 absolute top-0 left-0 z-10 flex w-full flex-col px-12 backdrop-blur-sm"
                >
                    <div className="py-3">
                        <div className="relative flex w-full items-center justify-center">
                            <Input
                                type="search"
                                placeholder="Search for a passage..."
                                className="w-full border-none ps-9 shadow-none"
                                value={search}
                                onChange={(e) => onSearchChange(e.target.value)}
                                onKeyDown={handleSearchKeyDown}
                            />
                            <Button
                                variant="simple"
                                size="icon"
                                className="absolute left-0 rounded-full"
                                onClick={handleSearchSubmit}
                            >
                                <SearchIcon className="size-4" />
                            </Button>
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto">
                        <AnimatePresence mode="wait">
                            {!selectedBook ? (
                                <motion.div
                                    key="books-list"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="flex flex-col gap-4 pb-10"
                                >
                                    {BIBLE_BOOKS.map((book) => (
                                        <Button
                                            key={book.id}
                                            variant="simple"
                                            size="lg"
                                            className="rounded-none"
                                            onClick={() =>
                                                handleBookSelect(book.id)
                                            }
                                        >
                                            {book.name}
                                        </Button>
                                    ))}
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="chapters-grid"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="flex flex-col gap-4 pb-10"
                                >
                                    <Button
                                        variant="simple"
                                        size="lg"
                                        className="flex items-center gap-4 rounded-none"
                                        onClick={handleBackToBooks}
                                    >
                                        <ChevronLeftIcon className="size-4" />
                                        {currentBookData?.name}
                                    </Button>
                                    <div className="grid grid-cols-6 gap-2">
                                        {currentBookData?.chapter_lengths.map(
                                            (_, index) => (
                                                <Button
                                                    key={index + 1}
                                                    variant="simple"
                                                    size="lg"
                                                    className="h-14 rounded-none"
                                                    onClick={() =>
                                                        handleChapterSelect(
                                                            index + 1,
                                                        )
                                                    }
                                                >
                                                    {index + 1}
                                                </Button>
                                            ),
                                        )}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}

export default BibleMenu
