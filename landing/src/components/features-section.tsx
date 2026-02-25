import React from 'react'

const features = [
  {
    title: 'Minimap',
    description: 'See where you are in the tree at a glance. The minimap keeps your position in context so you never lose the thread.',
    videoSrc: '/minimapdemo.mp4',
  },
  {
    title: 'History',
    description: 'Every rabbit hole you start is saved automatically. Open History to revisit any past session and jump back into the tree.',
    videoSrc: '/demo2.mp4',
  },
] as const

export default function FeaturesSection() {
  return (
    <section id="features" className="border-t bg-muted/30 py-16 md:py-24">
      <div className="mx-auto max-w-2xl px-6 lg:px-0">
        <h2
          className="text-center text-2xl font-semibold tracking-tight sm:text-3xl"
          style={{ fontFamily: 'var(--font-heading), Georgia, serif' }}
        >
          Features
        </h2>
        <div className="mt-12 space-y-16 md:space-y-20">
          {features.map((feature) => (
            <div key={feature.title} className="flex flex-col items-center text-center">
              <h3 className="text-lg font-semibold text-foreground sm:text-xl">{feature.title}</h3>
              <p className="text-muted-foreground mt-2 max-w-lg text-sm sm:text-base">
                {feature.description}
              </p>
              <div className="mt-6 w-full max-w-lg overflow-hidden rounded-xl border border-border bg-background shadow-sm">
                <video
                  src={feature.videoSrc}
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="aspect-video w-full object-cover"
                  aria-label={`${feature.title} demo`}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
