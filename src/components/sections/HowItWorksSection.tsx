"use client"

import { motion } from "framer-motion"
import { Lightbulb, Shield, ThumbsUp } from "lucide-react"

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="w-full py-20 md:py-32 relative overflow-hidden">
      <div className="absolute inset-0 -z-10 h-full w-full bg-white dark:bg-black bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#1f1f1f_1px,transparent_1px),linear-gradient(to_bottom,#1f1f1f_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_40%,transparent_100%)]"></div>

      <div className="container px-4 md:px-6 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center justify-center space-y-4 text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">How It Works</h2>
          <p className="max-w-[800px] text-muted-foreground md:text-lg">
            Create a memorable brand name in three simple steps
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 md:gap-12 relative">
          <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-border to-transparent -translate-y-1/2 z-0"></div>

          {[
            {
              step: "1",
              title: "Describe your brand",
              description: "Tell us about your vision, values, and target audience in a few simple prompts.",
              icon: <Lightbulb className="size-6" />,
            },
            {
              step: "2",
              title: "Swipe through names",
              description: "Our AI generates names that you can quickly review with our intuitive swipe interface.",
              icon: <ThumbsUp className="size-6" />,
            },
            {
              step: "3",
              title: "Check availability",
              description: "We instantly verify domain and trademark availability for your favorite names.",
              icon: <Shield className="size-6" />,
            },
          ].map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="relative z-10 flex flex-col items-center text-center space-y-4"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/70 text-primary-foreground text-xl font-bold shadow-lg">
                {step.step}
              </div>
              <h3 className="text-xl font-bold">{step.title}</h3>
              <p className="text-muted-foreground">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
