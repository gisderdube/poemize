'use client'

import classNames from 'classnames'
import { useCallback, useState } from 'react'

export const FileUpload = () => {
  const [isDragging, setIsDragging] = useState(false)

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

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    const files = Array.from(e.dataTransfer.files)
    if (files?.[0]) {
      // Handle the file upload here
      console.log(files[0])
    }
  }, [])

  return (
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
        <div className='flex flex-col items-center justify-center'>
          <svg className='w-8 h-8 mb-2 text-gray-500' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
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
              // Handle the file upload here
              console.log(file)
            }
          }}
        />
      </div>
    </div>
  )
}
