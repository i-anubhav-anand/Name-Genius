"use client"

import { motion } from "framer-motion"
import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"

interface PricingPlan {
  name: string
  price: string
  period: string
  description: string
  features: string[]
  cta: string
  popular?: boolean
}

export function PricingSection() {
  const plans: PricingPlan[] = [
    {
      name: "Starter",
      price: "$49",
      period: "/mo",
      description: "Perfect for individuals and new startups",
      features: [
        "50 AI-generated name suggestions",
        "Basic trademark verification",
        "Domain availability check",
        "Swipe interface for quick review",
        "1 saved project",
      ],
      cta: "Get Started",
    },
    {
      name: "Pro",
      price: "$129",
      period: "/mo",
      description: "For growing businesses with specific needs",
      features: [
        "Unlimited AI-generated name suggestions",
        "Advanced trademark screening",
        "Domain availability + purchase options",
        "Cultural context analysis",
        "5 saved projects",
        "Export favorites list",
      ],
      cta: "Start Free Trial",
      popular: true,
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "",
      description: "For agencies and established companies",
      features: [
        "Everything in Pro plan",
        "Comprehensive legal clearance",
        "Global trademark database access",
        "Dedicated naming consultant",
        "Brand identity recommendations",
        "Team collaboration features",
      ],
      cta: "Contact Sales",
    },
  ]

  return (
    <section id="pricing" className="w-full py-20 md:py-32 bg-muted/30 relative overflow-hidden">
      <div className="absolute inset-0 -z-10 h-full w-full bg-white dark:bg-black bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#1f1f1f_1px,transparent_1px),linear-gradient(to_bottom,#1f1f1f_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_40%,transparent_100%)]"></div>

      <div className="container px-4 md:px-6 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center justify-center space-y-4 text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Simple, Transparent Pricing</h2>
          <p className="max-w-[800px] text-muted-foreground md:text-lg">Choose the plan that fits your naming needs</p>
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-3 lg:gap-8 max-w-5xl mx-auto">
          {plans.map((plan, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group"
            >
              <div className={`relative overflow-hidden h-full rounded-3xl ${plan.popular ? "scale-105" : ""}`}>
                {/* Glowing border effect */}
                <div className="absolute inset-0 z-0 rounded-3xl overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary via-purple-700/80 to-primary/20"></div>
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                    <div className="absolute inset-[-50%] top-1/2 left-1/2 w-[200%] h-40 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-transparent via-primary to-transparent animate-[spin_8s_linear_infinite]"></div>
                  </div>
                </div>

                {/* Card content */}
                <div className="relative z-10 p-6 h-full bg-black/90 m-[1px] rounded-3xl flex flex-col backdrop-blur-sm">
                  {plan.popular && (
                    <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-3 py-1 text-xs font-medium rounded-bl-lg">
                      Most Popular
                    </div>
                  )}

                  <div className="mb-4">
                    <h3 className="text-2xl font-bold text-white">{plan.name}</h3>
                    <div className="flex items-baseline mt-4">
                      <span className="text-4xl font-bold text-white">{plan.price}</span>
                      <span className="text-gray-400 ml-1">{plan.period}</span>
                    </div>
                    <p className="text-gray-400 mt-2">{plan.description}</p>
                  </div>

                  <hr className="w-full h-px bg-gray-800 border-0 my-4" />

                  <ul className="space-y-3 my-6 flex-grow">
                    {plan.features.map((feature, j) => (
                      <li key={j} className="flex items-center">
                        <div className="flex items-center justify-center w-5 h-5 rounded-full bg-primary mr-3">
                          <Check className="w-3 h-3 text-black" />
                        </div>
                        <span className="text-white text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    className={`w-full mt-auto rounded-full bg-gradient-to-b from-primary to-purple-700 hover:from-purple-600 hover:to-primary transition-all duration-300 shadow-[inset_0_-2px_25px_-4px_rgba(255,255,255,0.3)]`}
                  >
                    {plan.cta}
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        <p className="text-center text-muted-foreground mt-8">
          All plans include our 30-day satisfaction guarantee. No commitment required.
        </p>
      </div>
    </section>
  )
}
