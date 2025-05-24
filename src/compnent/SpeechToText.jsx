import React, { useState, useRef } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

function SpeechToText() {
  const [isRecording, setIsRecording] = useState(false);
  const [transcription, setTranscription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);



  const startRecording = async () => {
    setError('');
    setTranscription('');
    setLoading(false);

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setError('Your browser does not support audio recording.');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = async () => {
        setLoading(true);
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const formData = new FormData();
        formData.append('audio', audioBlob, 'recording.webm');

        try {
          const response = await axios.post(`${API_URL}/api/transcription/upload`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
          });

          setTranscription(response.data.transcription);
          setLoading(false);
        } catch (err) {
          setError(err.response?.data?.message || err.message);
          setLoading(false);
        }
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (err) {
      setError('Failed to start recording: ' + err.message);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-xl mt-10">
      <h2 className="text-2xl font-bold mb-4 text-center">🎙️ Speech to Text with Whisper</h2>

      <div className="flex justify-center gap-4 mb-6">
        {!isRecording ? (
          <button
            onClick={startRecording}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
          >
            Start Recording
          </button>
        ) : (
          <button
            onClick={stopRecording}
            className="bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700 transition"
          >
            Stop Recording
          </button>
        )}
      </div>

      {loading && <p className="text-center text-gray-500">🔄 Transcribing audio, please wait...</p>}

      {error && <p className="text-center text-red-600 font-semibold">{error}</p>}

      {transcription && (
        <div className="mt-6">
          <h3 className="text-xl font-semibold mb-2">📄 Transcription:</h3>
          <pre className="bg-gray-100 p-4 rounded-md text-sm text-gray-800 whitespace-pre-wrap border border-gray-300">
            {transcription}
          </pre>
        </div>
      )}
    </div>
  );
}

export default SpeechToText;
