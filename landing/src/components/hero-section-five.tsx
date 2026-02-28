import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const CHROME_STORE_URL = 'https://chromewebstore.google.com/detail/ihjcckdkghopojakhlcjglnangpmbgbk?utm_source=item-share-cb'

export default function HeroSection() {
    return (
        <section className="py-20">
            <div className="relative z-10 mx-auto w-full max-w-2xl px-6 lg:px-0">
                <div className="relative text-center">
                    <div className="flex flex-col items-center gap-6">
                        <RabbitHoleLogo className="mx-auto" />
                        <h1 className="mx-auto max-w-2xl text-balance text-4xl font-normal tracking-tight sm:text-5xl" style={{ fontFamily: 'var(--font-heading), Georgia, serif', textShadow: '0.015em 0 0 currentColor, -0.015em 0 0 currentColor, 0 0.015em 0 currentColor, 0 -0.015em 0 currentColor' }}>
                            Map your Wikipedia journey
                        </h1>
                    </div>
                    <p className="text-muted-foreground mx-auto mt-4 max-w-lg text-center text-lg">
                        A tree that grows as you read. Every article becomes a branch. Your path is saved as you go, so you can revisit any rabbit hole anytime.
                    </p>

                    <div className="mt-8 flex justify-center">
                        <Button asChild variant="default">
                            <Link href={CHROME_STORE_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2">
                                <ExternalLink className="size-4 shrink-0" />
                                <span className="text-nowrap">Add to Browser</span>
                            </Link>
                        </Button>
                    </div>
                </div>

                <div className="relative mt-12 overflow-hidden rounded-xl md:mt-16">
                    <video
                        src="/demo3.mp4"
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
