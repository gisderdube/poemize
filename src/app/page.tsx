import { FileUpload } from './FileUpload'

export default function Home() {
  return (
    <div className='container mx-auto max-w-screen-md min-h-screen flex items-center justify-center'>
      <div className='flex flex-col items-center justify-center'>
        <div className='text-center'>
          <h1 className='text-4xl font-bold'>Poemize</h1>
          <p>Poemize is a tool that helps you write poems.</p>
        </div>
        <FileUpload />
      </div>
    </div>
  )
}
