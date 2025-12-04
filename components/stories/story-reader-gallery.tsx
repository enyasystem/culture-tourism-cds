"use client"

import Image from 'next/image'
import { useState } from 'react'

type Props = {
  images: string[]
  alt?: string
}

export default function StoryReaderGallery({ images, alt }: Props) {
  const [index, setIndex] = useState(0)

  if (!images || images.length === 0) return null

  const main = images[index] || images[0]

  return (
    <div className="w-full">
      <div className="rounded-xl overflow-hidden shadow-lg">
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
              onClick={() => setIndex(i)}
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
    </div>
  )
}
