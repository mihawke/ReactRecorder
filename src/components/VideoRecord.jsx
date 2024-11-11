import React, { useEffect, useRef, useState } from 'react'
import { FaCamera } from 'react-icons/fa';

const VideoRecord = () => {

    const [permission, setPermission] = useState(false);
    const [stream, setStream] = useState(null)
    const [recorder, setRecorder] = useState(null)
    const [videoURL, setVideoURL] = useState(null)
    const [isRecording, setIsRecording] = useState(false)
    const liveVideoRef = useRef(null);

    const getCameraPermission = async () => {
        if (window.MediaRecorder) {
            try {
                const streamData = await navigator.mediaDevices.getUserMedia({
                    audio: false,
                    video: true
                })
                setPermission(true)
                setStream(streamData)
            } catch (error) {
                alert(error.message)
            }
        }
        else {
            alert("The MediaRecorder API is not supported in your browser.")
        }
    }

    const startRecording = async () => {
        if (!stream) {
            await getCameraPermission(); // Ensure we have a stream before recording
        }

        const mediaRecorder = new MediaRecorder(stream);
        setRecorder(mediaRecorder);
        mediaRecorder.start();
        setIsRecording(true);
        setVideoURL(null)

        const videoChunks = [];
        mediaRecorder.ondataavailable = (event) => {
            videoChunks.push(event.data)
        }

        //onstop event fires automatically when mediaRecorder.stop() is called.
        mediaRecorder.onstop = () => {
            const videoBlob = new Blob(videoChunks, { type: 'video/webm' }); // A Blob (Binary Large Object) represents binary data, allowing us to store and work with large amounts of raw data, such as audio files, images, or videos.
            const videoURL = URL.createObjectURL(videoBlob);
            setVideoURL(videoURL);
            setIsRecording(false);
        };
    }

    const stopRecording = () => {
        if (recorder) {
            recorder.stop();
        }
    }

    useEffect(() => {
        // Set the live preview stream when the stream changes
        if (liveVideoRef.current && stream) {
            liveVideoRef.current.srcObject = stream;
        }
    }, [stream]);

    return (
        <div className='flex flex-col items-center p-5 gap-4'>
            <h2 className='text-lg font-bold'>Video Recorder</h2>
            <main>
                <div className="flex flex-col items-center gap-5">
                    {!permission ? (
                        <button onClick={getCameraPermission} type="button">
                            Get Camera
                        </button>
                    ) : null}
                    {permission && !isRecording ? (
                        <button type="button" onClick={startRecording}>
                            Record
                        </button>
                    ) : null}
                    {isRecording ? (
                        <button type="button" onClick={stopRecording}>
                            Stop
                        </button>
                    ) : null}

                    {isRecording ? (
                        <FaCamera className={`text-red-500 animate-pulse`} size={24} />
                    ) : null}
                    
                    {stream && (
                        <video
                            ref={liveVideoRef}
                            autoPlay
                            muted
                            style={{ width: '100%', maxWidth: '400px', margin: '10px 0' }}
                        />
                    )}

                    {videoURL && !isRecording ? (
                        <video src={videoURL} controls />
                    ) :
                        null}
                </div>
            </main>
        </div>
    )
}

export default VideoRecord