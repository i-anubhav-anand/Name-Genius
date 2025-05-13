"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Copy, Share2, Check, Globe, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { GeneratedName } from "@/app/actions/generate-names"

interface ResultsDashboardProps {
  likedNames: GeneratedName[]
  onStartOver: () => void
}

export function ResultsDashboard({ likedNames, onStartOver }: ResultsDashboardProps) {
  const [expandedName, setExpandedName] = useState<string | null>(null)
  const [copiedName, setCopiedName] = useState<string | null>(null)

  // Get top 3 recommendations (in a real app, this would use more sophisticated logic)
  const topRecommendations = likedNames.slice(0, 3)

  const handleCopyName = (name: string) => {
    navigator.clipboard.writeText(name)
    setCopiedName(name)
    setTimeout(() => setCopiedName(null), 2000)
  }

  const handleToggleExpand = (name: string) => {
    if (expandedName === name) {
      setExpandedName(null)
    } else {
      setExpandedName(name)
    }
  }

  return (
    <motion.div
      className="max-w-4xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Your Name Results</h1>
        <p className="text-gray-400">Here are the names you liked and our final recommendations</p>
      </div>

      {/* Top recommendations */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Final Recommendations</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {topRecommendations.map((name, i) => (
            <motion.div
              key={i}
              className="bg-gradient-to-br from-primary/20 to-transparent border border-primary/30 rounded-xl p-6 relative overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <div className="absolute top-0 right-0 w-20 h-20 bg-primary/10 rounded-full -mr-10 -mt-10 blur-xl"></div>

              <h3 className="text-2xl font-bold mb-2">{name.name}</h3>
              <p className="text-sm text-gray-300 mb-4">{name.styleCategory}</p>

              <div className="flex items-center gap-2 mb-4">
                <Globe className="h-4 w-4 text-gray-400" />
                <span className="text-sm">
                  {name.domainAvailable ? (
                    <span className="text-green-400">Domain available</span>
                  ) : (
                    <span className="text-red-400">Domain unavailable</span>
                  )}
                </span>
              </div>

              <p className="text-sm text-gray-400 mb-4">{name.meaning}</p>

              <div className="flex gap-2 mt-auto">
                <Button size="sm" variant="outline" className="bg-black/30" onClick={() => handleCopyName(name.name)}>
                  {copiedName === name.name ? <Check className="h-4 w-4 mr-1" /> : <Copy className="h-4 w-4 mr-1" />}
                  {copiedName === name.name ? "Copied" : "Copy"}
                </Button>
                <Button size="sm" variant="outline" className="bg-black/30">
                  <Share2 className="h-4 w-4 mr-1" />
                  Share
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* All liked names */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6">All Your Liked Names</h2>
        <div className="space-y-4">
          {likedNames.map((name, i) => (
            <motion.div
              key={i}
              className="bg-[#252525] rounded-lg overflow-hidden"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
            >
              <div
                className="p-4 cursor-pointer flex justify-between items-center"
                onClick={() => handleToggleExpand(name.name)}
              >
                <div>
                  <h3 className="font-bold">{name.name}</h3>
                  <p className="text-xs text-gray-400">{name.styleCategory}</p>
                </div>
                <Button variant="ghost" size="sm" className="text-gray-400">
                  <ArrowRight
                    className={`h-4 w-4 transition-transform ${expandedName === name.name ? "rotate-90" : ""}`}
                  />
                </Button>
              </div>

              {expandedName === name.name && (
                <div className="p-4 pt-0 border-t border-gray-700">
                  <p className="text-sm text-gray-300 mb-4">{name.meaning}</p>

                  <div className="flex items-center gap-2 mb-4">
                    <Globe className="h-4 w-4 text-gray-400" />
                    <span className="text-sm">
                      {name.domainAvailable ? (
                        <span className="text-green-400">Domain available</span>
                      ) : (
                        <span className="text-red-400">Domain unavailable</span>
                      )}
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => handleCopyName(name.name)}>
                      {copiedName === name.name ? (
                        <Check className="h-4 w-4 mr-1" />
                      ) : (
                        <Copy className="h-4 w-4 mr-1" />
                      )}
                      {copiedName === name.name ? "Copied" : "Copy"}
                    </Button>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col items-center gap-4 mt-12">
        <Button className="bg-gradient-to-r from-primary to-purple-700 hover:from-purple-600 hover:to-primary transition-all duration-300 rounded-full px-8 py-6">
          Export Results
        </Button>

        <button onClick={onStartOver} className="text-gray-400 hover:text-white transition-colors">
          Start Over
        </button>
      </div>
    </motion.div>
  )
}
