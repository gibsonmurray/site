import { LogoIcon } from "@/components/logo"

export const BooksHeader = () => {
    return (
        <div>
            <div className="mb-2 flex items-center gap-2">
                <LogoIcon className="text-primary size-5" />
                <h1 className="text-foreground text-2xl font-semibold tracking-tighter">
                    My Books
                </h1>
            </div>
            <p className="text-muted-foreground mb-8 text-sm">
                Stories of faith, history, and the human spirit 📖
            </p>
        </div>
    )
}
