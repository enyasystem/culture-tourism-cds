"use client"

import Image from 'next/image'
import { useEffect, useState } from 'react'

type Props = {
  images: string[]
  alt?: string
}

export default function StoryReaderGallery({ images, alt }: Props) {
  const [index, setIndex] = useState(0)
  const [open, setOpen] = useState(false)

  if (!images || images.length === 0) return null

  const main = images[index] || images[0]

  return (
    <div className="w-full">
      <div className="rounded-xl overflow-hidden shadow-lg cursor-zoom-in" onClick={() => setOpen(true)}>
        <Image
          src={main}
          alt={alt ?? 'story image'}
          width={1200}
          height={700}
          className="w-full h-72 sm:h-96 object-cover"
        />
      </div>

      {images.length > 1 && (
        <div className="mt-4 flex gap-3 overflow-x-auto pb-1">
          {images.map((src, i) => (
            <button
              key={i}
              onClick={() => { setIndex(i); setOpen(true) }}
              className={`flex-shrink-0 rounded-md overflow-hidden transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                i === index ? 'ring-2 ring-teal-600' : 'ring-1 ring-transparent'
              }`}
              aria-label={`Show image ${i + 1}`}
            >
              <Image src={src} alt={`thumb-${i}`} width={240} height={140} className="w-36 h-20 object-cover" />
            </button>
          ))}
        </div>
      )}

      {open && (
        <Lightbox
          images={images}
          index={index}
          onClose={() => setOpen(false)}
          onIndexChange={(i: number) => setIndex(i)}
          alt={alt}
        />
      )}
    </div>
  )
}

function Lightbox({ images, index, onClose, onIndexChange, alt }: {
  images: string[]
  index: number
  onClose: () => void
  onIndexChange: (i: number) => void
  alt?: string
}) {
  const [i, setI] = useState(index)

  // Keep parent in sync when internal index changes
  const setIndex = (next: number) => {
    const wrapped = (next + images.length) % images.length
    setI(wrapped)
    onIndexChange(wrapped)
  }

  // keyboard handlers
  useEffect(() => {
    if (typeof window === 'undefined') return
    const handle = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') setIndex(i - 1)
      if (e.key === 'ArrowRight') setIndex(i + 1)
    }
    window.addEventListener('keydown', handle)
    return () => window.removeEventListener('keydown', handle)
  }, [i, onClose])

  return (
    <div data-lightbox onClick={onClose} className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
      <button
        className="absolute top-4 right-4 text-white bg-black/40 rounded-full p-2 hover:bg-black/60"
        onClick={onClose}
        aria-label="Close"
      >
        ✕
      </button>

      <button
        className="absolute left-4 text-white bg-black/40 rounded-full p-2 hover:bg-black/60"
        onClick={() => setIndex(i - 1)}
        aria-label="Previous"
      >
        ‹
      </button>

      <div onClick={(e) => e.stopPropagation()} className="max-w-[90vw] max-h-[90vh]">
        <Image src={images[i]} alt={alt ?? 'story image'} width={1600} height={1000} className="object-contain max-w-full max-h-[90vh]" />
      </div>

      <button
        className="absolute right-4 text-white bg-black/40 rounded-full p-2 hover:bg-black/60"
        onClick={() => setIndex(i + 1)}
        aria-label="Next"
      >
        ›
      </button>
    </div>
  )
}
