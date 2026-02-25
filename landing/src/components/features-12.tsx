'use client'

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { History, MapPin } from 'lucide-react'
import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'

const items = [
  {
    id: 'minimap' as const,
    icon: MapPin,
    title: 'Minimap',
    copy: 'See where you are in the tree at a glance. The minimap keeps your position in context so you never lose the thread.',
    videoSrc: '/minimapdemo.mp4',
  },
  {
    id: 'history' as const,
    icon: History,
    title: 'History',
    copy: 'Every rabbit hole you start is saved automatically. Open History to revisit any past session and jump back into the tree.',
    videoSrc: '/historydemo.mp4',
  },
] as const

type ItemId = (typeof items)[number]['id']

export default function Features() {
  const [activeItem, setActiveItem] = useState<ItemId>('minimap')

  return (
    <section id="features" className="py-12 md:py-20 lg:py-32">
      <div className="mx-auto max-w-5xl space-y-8 px-6 md:space-y-16 lg:space-y-20">
        <div className="relative z-10 mx-auto max-w-2xl space-y-6 text-center">
          <h2
            className="text-balance text-4xl font-normal lg:text-6xl"
            style={{ fontFamily: 'var(--font-heading), Georgia, serif', textShadow: '0.015em 0 0 currentColor, -0.015em 0 0 currentColor, 0 0.015em 0 currentColor, 0 -0.015em 0 currentColor' }}
          >
            Never lose your place in the rabbit hole
          </h2>
          <p className="text-muted-foreground">
            Minimap and History work together so you can explore freely and always find your way back.
          </p>
        </div>

        <div className="grid gap-12 sm:px-12 md:grid-cols-[35%_1fr] lg:gap-20 lg:px-0">
          <Accordion
            type="single"
            value={activeItem}
            onValueChange={(value) => setActiveItem(value as ItemId)}
            className="w-full"
          >
            {items.map((item) => (
              <AccordionItem key={item.id} value={item.id}>
                <AccordionTrigger>
                  <div className="flex items-center gap-2 text-base">
                    <item.icon className="size-4" />
                    {item.title}
                  </div>
                </AccordionTrigger>
                <AccordionContent>{item.copy}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <div className="relative w-full overflow-hidden rounded-xl border bg-background [&_video]:block">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeItem}
                initial={{ opacity: 0, y: 6, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 6, scale: 0.98 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden rounded-xl"
              >
                <video
                  src={items.find((i) => i.id === activeItem)!.videoSrc}
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="w-full h-auto block"
                  aria-label={`${items.find((i) => i.id === activeItem)!.title} demo`}
                />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  )
}
