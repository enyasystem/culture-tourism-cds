"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Mountain, Building2, Calendar, Camera, Users } from "lucide-react"

interface OnboardingStep {
  id: number
  title: string
  description: string
  icon: React.ReactNode
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
      title: "Welcome to Culture & Tourism CDS Platform",
      description:
        "Discover Jos's rich cultural heritage while promoting sustainable tourism development as a Culture and Tourism CDS member in Plateau State.",
      icon: <Mountain className="w-12 h-12 text-[#1A7B7B]" />,
      completed: false,
    },
    {
      id: 2,
      title: "Explore Cultural Sites",
      description:
        "Visit cultural sites that showcase the rich heritage, history, and diverse communities of Jos and Plateau State.",
      icon: <Building2 className="w-12 h-12 text-[#1A7B7B]" />,
      completed: false,
    },
    {
      id: 3,
      title: "Join Cultural Events",
      description:
        "Participate in cultural festivals, tourism development initiatives, and CDS activities that celebrate Jos's heritage.",
      icon: <Calendar className="w-12 h-12 text-[#1A7B7B]" />,
      completed: false,
    },
    {
      id: 4,
      title: "Share Your CDS Journey",
      description:
        "Document your Culture and Tourism CDS experiences, showcase cultural discoveries, and inspire fellow corps members.",
      icon: <Camera className="w-12 h-12 text-[#1A7B7B]" />,
      completed: false,
    },
    {
      id: 5,
      title: "Connect with Fellow CDS Members",
      description:
        "Build lasting connections with other Culture and Tourism CDS members and local communities working together to promote cultural understanding and tourism development.",
      icon: <Users className="w-12 h-12 text-[#1A7B7B]" />,
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
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-300">
      <Card className="w-full max-w-2xl shadow-2xl border-2 animate-in zoom-in-95 duration-300">
        <CardHeader className="text-center pb-4">
          <div className="flex items-center justify-between mb-4">
            <Badge variant="outline" className="bg-[#1A7B7B]/10 text-[#1A7B7B] border-[#1A7B7B]/20">
              Step {currentStep + 1} of {steps.length}
            </Badge>
            <Button variant="ghost" size="sm" onClick={handleSkip} className="hover:bg-[#1A7B7B]/10">
              Skip Tour
            </Button>
          </div>
          <Progress value={progress} className="mb-4 h-2" />
          <div className="flex justify-center mb-4 animate-in zoom-in duration-500">{currentStepData.icon}</div>
          <CardTitle className="text-2xl mb-2 animate-in slide-in-from-bottom duration-500">
            {currentStepData.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-muted-foreground text-lg mb-8 leading-relaxed animate-in slide-in-from-bottom duration-500 delay-100">
            {currentStepData.description}
          </p>

          {/* Step indicators */}
          <div className="flex justify-center gap-2 mb-8">
            {steps.map((step, index) => (
              <div
                key={step.id}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index <= currentStep ? "bg-[#1A7B7B] w-8" : "bg-muted"
                }`}
              />
            ))}
          </div>

          <div className="flex gap-4 justify-center">
            {currentStep > 0 && (
              <Button
                variant="outline"
                onClick={() => setCurrentStep(currentStep - 1)}
                className="border-[#1A7B7B] text-[#1A7B7B] hover:bg-[#1A7B7B]/10"
              >
                Previous
              </Button>
            )}
            <Button onClick={handleNext} className="min-w-[120px] bg-[#1A7B7B] hover:bg-[#156666]">
              {currentStep === steps.length - 1 ? "Get Started" : "Next"}
            </Button>
          </div>

          {currentStep === steps.length - 1 && (
            <div className="mt-6 p-4 bg-[#1A7B7B]/10 rounded-lg animate-in slide-in-from-bottom duration-500 delay-200">
              <p className="text-sm text-muted-foreground">
                <Mountain className="w-4 h-4 inline-block mr-1 text-[#1A7B7B]" />
                <strong>Culture & Tourism Tip:</strong> Use{" "}
                <kbd className="px-2 py-1 bg-background border border-border rounded text-xs">⌘K</kbd> to quickly search
                for cultural sites, events, and CDS stories anytime!
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
