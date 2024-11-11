import React, { useEffect, useState } from 'react'
import { FaMicrophone } from "react-icons/fa";

const AudioRecord = () => {
    const [permission, setPermission] = useState(false);
    const [stream, setStream] = useState(null);
    const [recorder, setRecorder] = useState(null);
    const [audioURL, setAudioURL] = useState('');
    const [isRecording, setIsRecording] = useState(false);
    const [recognizedText, setRecognizedText] = useState('');
    const [speechRecognition, setSpeechRecognition] = useState(null);

    const getMicrophonePermission = async () => {
        if (window.MediaRecorder) {
            try {
                const streamData = await navigator.mediaDevices.getUserMedia({
                    audio: true,
                    video: false
                })
                setPermission(true);
                setStream(streamData);
            } catch (error) {
                alert(error.message);
            }
        }
        else {
            alert("The MediaRecorder API is not supported in your browser.");
        }
    }

    const startRecording = () => {
        if (stream) {
            const mediaRecorder = new MediaRecorder(stream);
            setRecorder(mediaRecorder);
            mediaRecorder.start();
            setIsRecording(true);
            setAudioURL(null)

            const audioChunks = [];
            mediaRecorder.ondataavailable = (event) => {
                audioChunks.push(event.data);
            };

            //onstop event fires automatically when mediaRecorder.stop() is called.
            mediaRecorder.onstop = () => {
                const audioBlob = new Blob(audioChunks, { type: 'audio/mp3' }); // A Blob (Binary Large Object) represents binary data, allowing us to store and work with large amounts of raw data, such as audio files, images, or videos.
                const audioUrl = URL.createObjectURL(audioBlob);
                setAudioURL(audioUrl);
                setIsRecording(false);
            };
        }
        if (speechRecognition) {
            speechRecognition.start();
        }
    }

    const stopRecording = () => {
        if (recorder) {
            recorder.stop();
        }
        if (speechRecognition) {
            speechRecognition.stop();
        }
    }

    useEffect(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
            const recognition = new SpeechRecognition();
            recognition.lang = 'en-US';
            recognition.continuous = true;
            recognition.interimResults = true;

            recognition.onresult = (event) => {
                let transcript = '';
                for (let i = event.resultIndex; i < event.results.length; i++) {
                    transcript += event.results[i][0].transcript;
                }
                setRecognizedText(transcript); // Update recognized speech text
            };

            recognition.onerror = (event) => {
                console.error("Speech recognition error:", event.error);
            };

            setSpeechRecognition(recognition);
        } else {
            alert("Speech Recognition is not supported in your browser.");
        }
    }, []);



    return (
        <div className='flex flex-col items-center p-5 gap-4'>
            <h2 className='text-lg font-bold'>Audio Recorder</h2>
            <main>
                <div className="flex flex-col items-center gap-5">
                    {!permission ? (
                        <button onClick={getMicrophonePermission} type="button">
                            Get Microphone
                        </button>
                    ) : null}
                    {permission && !isRecording ? (
                        <button onClick={startRecording} type="button">
                            Record
                        </button>
                    ) : null}

                    {isRecording ? (
                        <button onClick={stopRecording} type="button">
                            Stop
                        </button>
                    ) : null}
                    {isRecording ? (
                        <FaMicrophone className={`text-red-500 animate-pulse`} size={24} />
                    ) : null}
                    {audioURL && !isRecording ? (
                        <audio src={audioURL} controls />
                    ) : null}
                    <div>
                        <h3>Recognized Speech:</h3>
                        <p>{recognizedText}</p> {/* Display recognized speech text */}
                    </div>
                </div>
            </main>
        </div>
    )
}

export default AudioRecord