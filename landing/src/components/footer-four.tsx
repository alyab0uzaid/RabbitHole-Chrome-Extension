import Image from 'next/image'
import Link from 'next/link'

export default function FooterSection() {
    return (
        <footer className="bg-background py-12">
            <div className="mx-auto max-w-5xl px-6">
                <div className="flex flex-wrap items-center justify-between gap-6">
                    <div className="flex items-center gap-3">
                        <Link href="/" aria-label="RabbitHole home">
                            <Image src="/newlogo.png" alt="RabbitHole" width={28} height={28} className="size-7" />
                        </Link>
                        <span className="text-muted-foreground text-sm">© {new Date().getFullYear()} RabbitHole</span>
                    </div>
                    <span className="text-muted-foreground text-sm">
                        made with ❤️ by Aly Abou-Zaid
                    </span>
                </div>
            </div>
        </footer>
    )
}
