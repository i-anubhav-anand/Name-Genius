"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"

interface Testimonial {
  quote: string
  author: string
  role: string
  initial: string
}

export function TestimonialsSection() {
  const testimonials: Testimonial[] = [
    {
      quote:
        "The swipe interface made reviewing names fun and efficient. We found our perfect name in just 10 minutes of swiping!",
      author: "Sarah Johnson",
      role: "Founder, Luminary",
      initial: "S",
    },
    {
      quote:
        "After weeks of brainstorming with no success, Name Genius delivered five perfect options in under 10 minutes. Worth every penny.",
      author: "Michael Chen",
      role: "Creative Director, Nexus Labs",
      initial: "M",
    },
    {
      quote:
        "The trademark verification feature alone saved us thousands in potential legal fees. The name suggestions were brilliant and memorable.",
      author: "Priya Sharma",
      role: "CEO, Elevate Health",
      initial: "P",
    },
    {
      quote:
        "I loved being able to swipe through options and instantly see which domains were available. Made the decision process so much easier.",
      author: "David Okafor",
      role: "Marketing VP, Horizon Ventures",
      initial: "D",
    },
  ]

  return (
    <section className="w-full py-20 md:py-32">
      <div className="container px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center justify-center space-y-4 text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">What Our Clients Say</h2>
          <p className="max-w-[800px] text-muted-foreground md:text-lg">
            Discover how Name Genius transforms naming challenges
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {testimonials.map((testimonial, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
            >
              <Card className="h-full overflow-hidden border-border/40 bg-gradient-to-b from-background to-muted/10 backdrop-blur transition-all hover:shadow-md">
                <CardContent className="p-6 flex flex-col h-full">
                  <p className="text-lg mb-6 flex-grow">{testimonial.quote}</p>
                  <div className="flex items-center gap-4 mt-auto pt-4 border-t border-border/40">
                    <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
                      {testimonial.initial}
                    </div>
                    <div>
                      <p className="font-medium">{testimonial.author}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
