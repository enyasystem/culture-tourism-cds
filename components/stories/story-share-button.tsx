'use client'

import { Share2, Copy, Check } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'

interface StoryShareButtonProps {
  title: string
  url: string
}

export default function StoryShareButton({ title, url }: StoryShareButtonProps) {
  const [copied, setCopied] = useState(false)
  const [showMenu, setShowMenu] = useState(false)

  const fullUrl = typeof window !== 'undefined' ? `${window.location.origin}${url}` : url
  const shareText = `Check out this story: ${title}`

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(fullUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const handleShareWhatsApp = () => {
    const waUrl = `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + fullUrl)}`
    window.open(waUrl, '_blank')
  }

  const handleShareFacebook = () => {
    const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(fullUrl)}`
    window.open(fbUrl, '_blank')
  }

  const handleShareTwitter = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(fullUrl)}`
    window.open(twitterUrl, '_blank')
  }

  const handleShareLinkedIn = () => {
    const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(fullUrl)}`
    window.open(linkedInUrl, '_blank')
  }

  // Check if native share API is available
  const supportsShare = typeof navigator !== 'undefined' && !!navigator.share

  const handleNativeShare = async () => {
    if (supportsShare) {
      try {
        await navigator.share({
          title,
          text: shareText,
          url: fullUrl,
        })
      } catch (err) {
        console.error('Share failed:', err)
      }
    }
  }

  return (
    <div className="relative">
      <Button
        variant="outline"
        size="sm"
        onClick={() => setShowMenu(!showMenu)}
        className="flex items-center gap-2"
      >
        <Share2 className="w-4 h-4" />
        Share
      </Button>

      {showMenu && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
          <div className="p-2">
            {supportsShare && (
              <button
                onClick={() => {
                  handleNativeShare()
                  setShowMenu(false)
                }}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 rounded text-sm"
              >
                📱 Native Share
              </button>
            )}

            <button
              onClick={() => {
                handleCopyLink()
                setShowMenu(false)
              }}
              className="w-full text-left px-4 py-2 hover:bg-gray-100 rounded text-sm flex items-center gap-2"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied!' : 'Copy Link'}
            </button>

            <button
              onClick={() => {
                handleShareWhatsApp()
                setShowMenu(false)
              }}
              className="w-full text-left px-4 py-2 hover:bg-gray-100 rounded text-sm"
            >
              💬 WhatsApp
            </button>

            <button
              onClick={() => {
                handleShareFacebook()
                setShowMenu(false)
              }}
              className="w-full text-left px-4 py-2 hover:bg-gray-100 rounded text-sm"
            >
              👍 Facebook
            </button>

            <button
              onClick={() => {
                handleShareTwitter()
                setShowMenu(false)
              }}
              className="w-full text-left px-4 py-2 hover:bg-gray-100 rounded text-sm"
            >
              𝕏 Twitter/X
            </button>

            <button
              onClick={() => {
                handleShareLinkedIn()
                setShowMenu(false)
              }}
              className="w-full text-left px-4 py-2 hover:bg-gray-100 rounded text-sm"
            >
              💼 LinkedIn
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
