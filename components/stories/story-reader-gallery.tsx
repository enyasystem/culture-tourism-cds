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
      {/* Caption and indicators */}
      <div className="mt-3 flex flex-col items-center gap-2">
        <div className="text-sm text-muted-foreground">{alt ? alt : `Image ${index + 1} of ${images.length}`}</div>
        {images.length > 1 && (
          <div className="mt-4 grid grid-cols-3 sm:grid-cols-6 gap-2 w-full">
            {images.map((src, i) => (
              <button key={i} onClick={() => setIndex(i)} className={`relative overflow-hidden rounded-md border ${i === index ? 'ring-2 ring-primary' : ''}`} aria-label={`Select image ${i + 1}`}>
                <img src={src} alt={`thumb-${i}`} className="h-20 w-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {open && (
        <GalleryModal images={images} index={index} onClose={() => setOpen(false)} onIndexChange={(i: number) => setIndex(i)} alt={alt} />
      )}
    </div>
  )
}
function GalleryModal({ images, index, onClose, onIndexChange, alt }: {
  images: string[]
  index: number
  onClose: () => void
  onIndexChange: (i: number) => void
  alt?: string
}) {
  const [i, setI] = useState(index)

  useEffect(() => setI(index), [index])

  useEffect(() => {
    if (typeof window === 'undefined') return
    const handle = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') setI((s) => Math.max(0, s - 1))
      if (e.key === 'ArrowRight') setI((s) => Math.min(images.length - 1, s + 1))
    }
    window.addEventListener('keydown', handle)
    return () => window.removeEventListener('keydown', handle)
  }, [onClose, images.length])

  useEffect(() => {
    onIndexChange(i)
  }, [i, onIndexChange])

  return (
    <div data-lightbox onClick={onClose} className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
      <button
        className="absolute top-4 right-4 text-white bg-black/40 rounded-full p-2 hover:bg-black/60 z-10"
        onClick={(e) => { e.stopPropagation(); onClose() }}
        aria-label="Close"
      >
        ✕
      </button>

      <div onClick={(e) => e.stopPropagation()} className="max-w-[90vw] max-h-[90vh] w-full flex items-center justify-center">
        <button
          className="absolute left-4 text-white bg-black/40 rounded-full p-2 hover:bg-black/60 z-10"
          onClick={(e) => { e.stopPropagation(); setI((s) => Math.max(0, s - 1)) }}
          aria-label="Previous"
        >
          ‹
        </button>

        <div className="w-full flex items-center justify-center">
          <Image src={images[i]} alt={alt ?? `image-${i}`} width={1600} height={1000} className="object-contain max-w-full max-h-[80vh] rounded-md" />
        </div>

        <button
          className="absolute right-4 text-white bg-black/40 rounded-full p-2 hover:bg-black/60 z-10"
          onClick={(e) => { e.stopPropagation(); setI((s) => Math.min(images.length - 1, s + 1)) }}
          aria-label="Next"
        >
          ›
        </button>
      </div>
    </div>
  )
}
