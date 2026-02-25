import { Card } from '@/components/ui/card'

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
]

export default function FeaturesSection() {
  return (
    <section id="features">
      <div className="py-24">
        <div className="mx-auto w-full max-w-2xl px-6 lg:px-0">
          <h2
            className="text-center text-4xl font-semibold text-foreground text-balance"
            style={{ fontFamily: 'var(--font-heading), Georgia, serif' }}
          >
            Features
          </h2>
          <div className="mt-16 space-y-12">
            {features.map((feature) => (
              <div key={feature.title} className="grid items-center gap-6 sm:grid-cols-5">
                <Card variant="soft" className="overflow-hidden p-0 sm:col-span-2">
                  <video
                    src={feature.videoSrc}
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="aspect-video w-full object-cover"
                    aria-label={`${feature.title} demo`}
                  />
                </Card>
                <div className="max-w-md sm:col-span-3">
                  <h3 className="text-lg font-semibold text-foreground">{feature.title}</h3>
                  <p className="mt-3 text-balance text-muted-foreground">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
