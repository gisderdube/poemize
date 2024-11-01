'use client'

import { PutBlobResult } from '@vercel/blob'
import classNames from 'classnames'
import React, { useCallback, useState } from 'react'

export const FileUpload = () => {
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [blob, setBlob] = useState<PutBlobResult | null>(null)
  const [poem, setPoem] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }, [])

  const handleDragIn = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }, [])

  const handleDragOut = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }, [])

  const uploadFile = useCallback(async (file: File) => {
    // Handle the file upload here
    console.log(file)

    setIsUploading(true)

    const response = await fetch(`/api/upload?filename=${file.name}`, {
      method: 'POST',
      body: file,
    })

    const newBlob = (await response.json()) as PutBlobResult

    setBlob(newBlob)
    setIsUploading(false)
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setIsDragging(false)

      const files = Array.from(e.dataTransfer.files)
      const file = files?.[0]
      if (file) {
        uploadFile(file)
      }
    },
    [uploadFile]
  )

  async function handleSubmit() {
    setIsSubmitting(true)
    try {
      console.log('Submitting image:', blob?.url)
      const response = await fetch(`/api/poemize?url=${blob?.url}`, {
        method: 'POST',
      })

      const data = await response.json()
      setPoem(data.poem)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (poem) {
    return (
      <div className='max-w-lg mx-auto mt-8 p-6 bg-zinc-100 rounded-lg shadow-md mb-20'>
        <img src={blob?.url} alt='Uploaded image' className='mt-4 w-full h-auto rounded-lg mb-8' />
        <p className='text-lg text-gray-800 leading-relaxed text-center font-playfair'>
          {poem.split('\n').map((line, i) => (
            <React.Fragment key={i}>
              {line}
              <br />
            </React.Fragment>
          ))}
        </p>
      </div>
    )
  }

  return (
    <>
      <div className='mt-8'>
        <div
          className={classNames(
            'w-64 px-4 py-8 text-sm text-gray-700 border-2 border-dashed rounded-lg cursor-pointer focus:outline-none transition-colors duration-200',
            {
              'border-gray-400 bg-gray-50': isDragging,
              'border-gray-300 hover:border-gray-400': !isDragging,
            }
          )}
          onDragEnter={handleDragIn}
          onDragLeave={handleDragOut}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => document.getElementById('image-upload')?.click()}
        >
          {isUploading && <p>Uploading...</p>}
          {blob && (
            <div>
              <img src={blob.url} alt='Uploaded image' className='mt-4 w-full h-auto rounded-lg' />
            </div>
          )}
          {!blob && (
            <>
              <div className='flex flex-col items-center justify-center'>
                <svg
                  className='w-8 h-8 mb-2 text-gray-500'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z'
                  />
                </svg>
                <p className='mb-1'>Drop your image here, or click to select</p>
                <p className='text-xs text-gray-500'>PNG, JPG, GIF up to 10MB</p>
              </div>
              <input
                id='image-upload'
                type='file'
                className='hidden'
                accept='image/*'
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) {
                    uploadFile(file)
                  }
                }}
              />
            </>
          )}
        </div>
      </div>
      {blob && (
        <button
          type='button'
          onClick={handleSubmit}
          disabled={isSubmitting}
          className={classNames('mt-4 w-full font-medium py-2 px-4 rounded-lg transition-colors', {
            'bg-blue-500 hover:bg-blue-600 text-white': !isSubmitting,
            'bg-blue-300 cursor-not-allowed text-white': isSubmitting,
          })}
        >
          {isSubmitting ? 'Generating Poem...' : 'Submit Image'}
        </button>
      )}
    </>
  )
}
