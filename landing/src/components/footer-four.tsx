import Image from 'next/image'
import Link from 'next/link'

const CHROME_STORE_URL = 'https://chromewebstore.google.com/detail/ihjcckdkghopojakhlcjglnangpmbgbk?utm_source=item-share-cb'

const links = [
    { title: 'Features', href: '#features' },
    { title: 'Add to Chrome', href: CHROME_STORE_URL },
]

export default function FooterSection() {
    return (
        <footer className="bg-background border-t py-12">
            <div className="mx-auto max-w-5xl px-6">
                <div className="flex flex-wrap justify-between gap-12">
                    <div className="order-last flex items-center gap-3 md:order-first">
                        <Link href="/" aria-label="RabbitHole home">
                            <Image src="/icon/rabbithole.png" alt="RabbitHole" width={28} height={28} className="size-7" />
                        </Link>
                        <span className="text-muted-foreground text-sm">© {new Date().getFullYear()} RabbitHole</span>
                    </div>

                    <div className="order-first flex flex-wrap gap-x-6 gap-y-4 md:order-last">
                        {links.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                target={link.href.startsWith('http') ? '_blank' : undefined}
                                rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                                className="text-muted-foreground hover:text-primary block duration-150">
                                {link.title}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    )
}
