import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const CHROME_STORE_URL = 'https://chromewebstore.google.com/detail/ihjcckdkghopojakhlcjglnangpmbgbk?utm_source=item-share-cb'

export default function HeroSection() {
    return (
        <section className="py-20">
            <div className="relative z-10 mx-auto w-full max-w-2xl px-6 lg:px-0">
                <div className="relative text-center">
                    <RabbitHoleLogo className="mx-auto" />
                    <h1 className="mx-auto mt-6 max-w-2xl text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
                        Map your Wikipedia journey
                    </h1>
                    <p className="text-muted-foreground mx-auto mb-6 mt-4 max-w-xl text-balance text-lg sm:text-xl">
                        RabbitHole turns every article you visit into a visual tree. Preview pages on hover, follow your path, and never lose your place—all in one Chrome side panel.
                    </p>

                    <div className="flex flex-col items-center gap-2 *:w-full sm:flex-row sm:justify-center sm:*:w-auto">
                        <Button asChild variant="default">
                            <Link href={CHROME_STORE_URL} target="_blank" rel="noopener noreferrer">
                                <span className="text-nowrap">Add to Chrome</span>
                            </Link>
                        </Button>
                        <Button asChild variant="ghost">
                            <Link href="#features">
                                <span className="text-nowrap">Learn more</span>
                            </Link>
                        </Button>
                    </div>
                </div>

                <div className="relative mt-12 overflow-hidden rounded-2xl md:mt-16">
                    <video
                        src="/demo.mp4"
                        autoPlay
                        muted
                        loop
                        playsInline
                        className="size-full object-cover"
                        aria-label="RabbitHole extension demo"
                    />
                </div>
            </div>
        </section>
    )
}

const RabbitHoleLogo = ({ className }: { className?: string }) => (
    <div aria-hidden className={cn('relative flex items-center justify-center', className)}>
        <Image src="/icon/rabbithole.png" alt="" width={56} height={56} className="size-12 drop-shadow-lg sm:size-14" />
    </div>
)
