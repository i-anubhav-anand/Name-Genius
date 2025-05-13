"use client"

import { motion } from "framer-motion"
import { Check, Brain, Heart, Globe, Shield, Zap, ThumbsUp } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { FeatureCard } from "@/components/home/FeatureCard"

export function FeaturesSection() {
  return (
    <section className="w-full py-20 md:py-32 bg-muted/30">
      <div className="container px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center justify-center space-y-4 text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Powerful Naming Features</h2>
          <p className="max-w-[800px] text-muted-foreground md:text-lg">
            Everything you need to discover the perfect brand name
          </p>
        </motion.div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <FeatureCard
            icon={<Brain className="size-5" />}
            title="AI-Powered Suggestions"
            description="Our algorithm analyzes linguistic patterns, cultural contexts, and emotional resonance to create names that truly connect."
          />
          <FeatureCard
            icon={<Heart className="size-5" />}
            title="Intuitive Swipe Interface"
            description="Quickly review name options with our Tinder-like swipe interface. Like or pass on names with a simple gesture."
          />
          <FeatureCard
            icon={<Globe className="size-5" />}
            title="Domain Availability"
            description="Instantly check if domains are available for your favorite names, with options to purchase directly."
          />
          <FeatureCard
            icon={<Shield className="size-5" />}
            title="Trademark Screening"
            description="Our built-in trademark screening checks global databases to ensure your chosen name is available for registration."
          />
          <FeatureCard
            icon={<Zap className="size-5" />}
            title="Industry-Specific Names"
            description="Get name suggestions tailored to your specific industry, with appropriate tone and associations."
          />
          <FeatureCard
            icon={<ThumbsUp className="size-5" />}
            title="Saved Favorites"
            description="Keep track of names you like and compare them side by side before making your final decision."
          />
        </div>

        <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center mt-24">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
          >
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Deep Cultural Insights</h2>
            <p className="text-muted-foreground md:text-lg">
              Our AI analyzes linguistic patterns, cultural contexts, and emotional resonance to create names that truly
              connect with your target audience. Each name comes with rich contextual data explaining its origin and
              impact.
            </p>
            <ul className="space-y-2 mt-4">
              <li className="flex items-center">
                <Check className="mr-2 size-4 text-primary" />
                <span>Emotional response analysis</span>
              </li>
              <li className="flex items-center">
                <Check className="mr-2 size-4 text-primary" />
                <span>Cross-cultural meaning verification</span>
              </li>
              <li className="flex items-center">
                <Check className="mr-2 size-4 text-primary" />
                <span>Phonetic appeal scoring</span>
              </li>
            </ul>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative"
          >
            <div className="relative h-full w-full border-2 border-primary/50 rounded-3xl bg-gradient-to-br from-primary via-purple-700/80 to-primary/20 text-white p-8 flex justify-center items-left flex-col gap-4 backdrop-blur-[12px] hover:shadow-2xl hover:shadow-primary/30 transition-all duration-500 group/card hover:-translate-y-1">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600/30 via-fuchsia-500/20 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-500 rounded-3xl"></div>
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,50,190,0.1),transparent_60%)] group-hover/card:animate-pulse rounded-3xl"></div>

              <div className="absolute top-4 right-4 flex gap-2">
                <div className="w-2 h-2 rounded-full bg-purple-300/50"></div>
                <div className="w-2 h-2 rounded-full bg-purple-300/30"></div>
                <div className="w-2 h-2 rounded-full bg-purple-300/10"></div>
              </div>

              <div className="relative z-10 transition-transform duration-300 group-hover/card:translate-y-[-2px] space-y-3">
                <div className="text-xs uppercase tracking-wider mb-2 opacity-80">Tech / Innovation</div>
                <h3 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white via-purple-100 to-purple-200 bg-clip-text text-transparent">
                  Lumeno
                </h3>
                <p className="text-lg text-purple-100/90 leading-relaxed">Modern & bright</p>
              </div>

              <div className="relative z-10 bg-white/10 rounded-lg p-4 mt-2">
                <h4 className="font-semibold mb-2">Cultural Analysis</h4>
                <p className="text-sm mb-3 text-purple-100/90">
                  Derived from Latin "lumen" (light), conveying clarity and innovation. Positive associations in 94% of
                  tested markets.
                </p>
                <div className="flex items-center justify-between text-sm">
                  <span>Memorability: 92%</span>
                  <span>Uniqueness: 87%</span>
                  <span>Trust: 89%</span>
                </div>
              </div>

              <div className="absolute bottom-4 left-4 w-8 h-8 rounded-full bg-gradient-to-br from-purple-400/20 to-transparent blur-sm group-hover/card:animate-pulse"></div>
            </div>
          </motion.div>

          {/* Trademark Safety Net Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="space-y-4 order-1 md:order-2"
          >
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Trademark Safety Net</h2>
            <p className="text-muted-foreground md:text-lg">
              Never worry about legal complications. Our built-in trademark screening checks global databases in
              real-time to ensure your chosen name is available for registration, saving you time and potential legal
              headaches.
            </p>
            <ul className="space-y-2 mt-4">
              <li className="flex items-center">
                <Check className="mr-2 size-4 text-primary" />
                <span>Global trademark database search</span>
              </li>
              <li className="flex items-center">
                <Check className="mr-2 size-4 text-primary" />
                <span>Domain availability verification</span>
              </li>
              <li className="flex items-center">
                <Check className="mr-2 size-4 text-primary" />
                <span>Social media handle checks</span>
              </li>
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="order-2 md:order-1 relative"
          >
            <div className="relative h-full w-full border-2 border-primary/50 rounded-3xl bg-gradient-to-br from-primary via-purple-700/80 to-primary/20 text-white p-8 flex justify-center items-left flex-col gap-4 backdrop-blur-[12px] hover:shadow-2xl hover:shadow-primary/30 transition-all duration-500 group/card hover:-translate-y-1">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600/30 via-fuchsia-500/20 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-500 rounded-3xl"></div>
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,50,190,0.1),transparent_60%)] group-hover/card:animate-pulse rounded-3xl"></div>

              <div className="absolute top-4 right-4 flex gap-2">
                <div className="w-2 h-2 rounded-full bg-purple-300/50"></div>
                <div className="w-2 h-2 rounded-full bg-purple-300/30"></div>
                <div className="w-2 h-2 rounded-full bg-purple-300/10"></div>
              </div>

              <div className="relative z-10 transition-transform duration-300 group-hover/card:translate-y-[-2px] space-y-3">
                <div className="text-xs uppercase tracking-wider mb-2 opacity-80">Finance / Security</div>
                <h3 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white via-purple-100 to-purple-200 bg-clip-text text-transparent">
                  Avantra
                </h3>
                <p className="text-lg text-purple-100/90 leading-relaxed">Forward-thinking & stable</p>
              </div>

              <div className="relative z-10 space-y-3 mt-2">
                <div className="flex items-center justify-between bg-white/10 rounded-lg p-3">
                  <div className="flex items-center">
                    <Globe className="size-4 mr-2" />
                    <span>avantra.io</span>
                  </div>
                  <Badge className="bg-green-500">Available</Badge>
                </div>

                <div className="flex items-center justify-between bg-white/10 rounded-lg p-3">
                  <div className="flex items-center">
                    <Shield className="size-4 mr-2" />
                    <span>Trademark</span>
                  </div>
                  <Badge className="bg-green-500">Clear</Badge>
                </div>
              </div>

              <div className="absolute bottom-4 left-4 w-8 h-8 rounded-full bg-gradient-to-br from-purple-400/20 to-transparent blur-sm group-hover/card:animate-pulse"></div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
