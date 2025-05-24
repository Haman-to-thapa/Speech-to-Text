import React, { useState } from 'react';
import axios from 'axios';

function WhisperTest() {
  const [file, setFile] = useState(null);
  const [transcription, setTranscription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setTranscription('');
    setError('');
  };

  const handleUpload = async () => {
    if (!file) {
      alert('Please select an audio file first');
      return;
    }

    setLoading(true);
    setError('');
    setTranscription('');

    try {
      const formData = new FormData();
      formData.append('audio', file);

      const res = await axios.post('http://localhost:8000/transcribe', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setTranscription(res.data.text);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'Transcription failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow-md mt-10">
      <h1 className="text-2xl font-semibold mb-4 text-center">🎧 Upload Audio for Transcription</h1>

      <input
        type="file"
        accept="audio/*"
        onChange={handleFileChange}
        className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4
                   file:rounded-md file:border-0 file:text-sm file:font-semibold
                   file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 mb-4"
      />

      <button
        onClick={handleUpload}
        disabled={loading}
        className={`w-full py-2 px-4 rounded-md text-white font-semibold ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
          } transition`}
      >
        {loading ? 'Processing...' : 'Upload & Transcribe'}
      </button>

      {error && <p className="text-red-600 mt-4 font-medium">❌ {error}</p>}

      {transcription && (
        <div className="mt-6">
          <h3 className="text-lg font-bold mb-2">📝 Transcription Result:</h3>
          <p className="bg-gray-100 border border-gray-300 p-4 rounded-md text-sm whitespace-pre-wrap">
            {transcription}
          </p>
        </div>
      )}
    </div>
  );
}

export default WhisperTest;
