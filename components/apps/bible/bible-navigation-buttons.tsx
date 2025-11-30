import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { FC } from "react"

type BibleNavigationButtonsProps = {
    canGoPrevious: boolean
    canGoNext: boolean
    onPrevious: () => void
    onNext: () => void
}

export const BibleNavigationButtons: FC<BibleNavigationButtonsProps> = ({
    canGoPrevious,
    canGoNext,
    onPrevious,
    onNext,
}) => {
    return (
        <nav className="fixed top-1/2 left-1/2 flex w-2xl -translate-x-1/2 -translate-y-1/2 items-center justify-between">
            <Tooltip delayDuration={200}>
                <TooltipTrigger asChild>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full"
                        onClick={onPrevious}
                        disabled={!canGoPrevious}
                    >
                        <ChevronLeftIcon className="size-4" />
                    </Button>
                </TooltipTrigger>
                <TooltipContent side="left" className="dark">
                    <p>Previous</p>
                </TooltipContent>
            </Tooltip>

            <Tooltip delayDuration={200}>
                <TooltipTrigger asChild>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full"
                        onClick={onNext}
                        disabled={!canGoNext}
                    >
                        <ChevronRightIcon className="size-4" />
                    </Button>
                </TooltipTrigger>
                <TooltipContent side="right" className="dark">
                    <p>Next</p>
                </TooltipContent>
            </Tooltip>
        </nav>
    )
}
