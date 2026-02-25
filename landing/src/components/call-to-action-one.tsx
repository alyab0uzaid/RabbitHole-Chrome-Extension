import { Button } from '@/components/ui/button'
import { ExternalLink } from 'lucide-react'
import Link from 'next/link'

const CHROME_STORE_URL = 'https://chromewebstore.google.com/detail/ihjcckdkghopojakhlcjglnangpmbgbk?utm_source=item-share-cb'

export default function CallToActionOne() {
  return (
    <section>
      <div className="py-12">
        <div className="mx-auto max-w-5xl px-6">
          <div className="space-y-6 text-center">
            <h2
              className="text-balance text-3xl font-normal text-foreground lg:text-4xl"
              style={{ fontFamily: 'var(--font-heading), Georgia, serif', textShadow: '0.015em 0 0 currentColor, -0.015em 0 0 currentColor, 0 0.015em 0 currentColor, 0 -0.015em 0 currentColor' }}
            >
              Go down the rabbit hole
            </h2>
            <div className="flex justify-center">
              <Button asChild size="lg">
                <Link href={CHROME_STORE_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2">
                  <ExternalLink className="size-4" />
                  Add to Browser
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
