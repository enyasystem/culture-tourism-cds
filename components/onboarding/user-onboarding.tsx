"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

interface OnboardingStep {
  id: number
  title: string
  description: string
  icon: string
  completed: boolean
}

interface UserOnboardingProps {
  isOpen: boolean
  onClose: () => void
  onComplete: () => void
}

export function UserOnboarding({ isOpen, onClose, onComplete }: UserOnboardingProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [steps, setSteps] = useState<OnboardingStep[]>([
    {
      id: 1,
      title: "Welcome to Peace & Tourism CDS Platform",
      description:
        "Discover Jos's rich cultural heritage while promoting peace and sustainable tourism development as a Peace and Tourism CDS member in Plateau State.",
      icon: "🕊️",
      completed: false,
    },
    {
      id: 2,
      title: "Explore Cultural Sites for Peace Building",
      description:
        "Visit cultural sites that promote unity, understanding, and peaceful coexistence among diverse communities in Jos and Plateau State.",
      icon: "🏛️",
      completed: false,
    },
    {
      id: 3,
      title: "Join Peace & Tourism Events",
      description:
        "Participate in peace-building activities, cultural festivals, and tourism development initiatives that strengthen community bonds and showcase Jos's heritage.",
      icon: "🎭",
      completed: false,
    },
    {
      id: 4,
      title: "Share Your CDS Journey",
      description:
        "Document your Peace and Tourism CDS experiences, showcase cultural discoveries, and inspire fellow corps members to promote peace through tourism.",
      icon: "📸",
      completed: false,
    },
    {
      id: 5,
      title: "Connect with Fellow CDS Members",
      description:
        "Build lasting connections with other Peace and Tourism CDS members and local communities working together to promote cultural understanding and tourism development.",
      icon: "🤝",
      completed: false,
    },
  ])

  const progress = ((currentStep + 1) / steps.length) * 100

  const handleNext = () => {
    const updatedSteps = [...steps]
    updatedSteps[currentStep].completed = true
    setSteps(updatedSteps)

    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      onComplete()
    }
  }

  const handleSkip = () => {
    onClose()
  }

  if (!isOpen) return null

  const currentStepData = steps[currentStep]

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl shadow-2xl border-2">
        <CardHeader className="text-center pb-4">
          <div className="flex items-center justify-between mb-4">
            <Badge variant="outline">
              Step {currentStep + 1} of {steps.length}
            </Badge>
            <Button variant="ghost" size="sm" onClick={handleSkip}>
              Skip Tour
            </Button>
          </div>
          <Progress value={progress} className="mb-4" />
          <div className="text-6xl mb-4">{currentStepData.icon}</div>
          <CardTitle className="text-2xl mb-2">{currentStepData.title}</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-muted-foreground text-lg mb-8 leading-relaxed">{currentStepData.description}</p>

          {/* Step indicators */}
          <div className="flex justify-center gap-2 mb-8">
            {steps.map((step, index) => (
              <div
                key={step.id}
                className={`w-3 h-3 rounded-full transition-colors ${index <= currentStep ? "bg-primary" : "bg-muted"}`}
              />
            ))}
          </div>

          <div className="flex gap-4 justify-center">
            {currentStep > 0 && (
              <Button variant="outline" onClick={() => setCurrentStep(currentStep - 1)}>
                Previous
              </Button>
            )}
            <Button onClick={handleNext} className="min-w-[120px]">
              {currentStep === steps.length - 1 ? "Get Started" : "Next"}
            </Button>
          </div>

          {currentStep === steps.length - 1 && (
            <div className="mt-6 p-4 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground">
                🕊️ <strong>Peace & Tourism Tip:</strong> Use{" "}
                <kbd className="px-2 py-1 bg-background border border-border rounded text-xs">⌘K</kbd> to quickly search
                for cultural sites, peace events, and CDS stories anytime!
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
