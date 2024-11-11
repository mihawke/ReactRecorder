import { useState } from 'react'
import './App.css'
import AudioRecord from './components/AudioRecord'
import VideoRecord from './components/VideoRecord'

function App() {
  const [currentMedia, setCurrentMedia] = useState('')

  return (
    <div className='flex flex-1 flex-col items-center p-10'>
      <h1 className='font-bold mb-5'>React Recorder</h1>
      <div className="flex flex-row gap-5">
        <button onClick={() => setCurrentMedia('audio')}>Record Audio</button>
        <button onClick={() => setCurrentMedia('video')}>Record Video</button>
      </div>
      {currentMedia == 'audio' ? <AudioRecord /> : ''}
      {currentMedia == 'video' ? <VideoRecord /> : ''}
    </div>
  )
}

export default App
