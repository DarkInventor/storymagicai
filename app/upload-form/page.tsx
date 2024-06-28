"use client";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import React, { useState, useEffect, useRef } from 'react';

const UploadForm = () => {
  const [file, setFile] = useState<File | null>(null);
  const [videoText, setVideoText] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Cleanup URL object to avoid memory leaks
    return () => {
      if (audioRef.current?.src) URL.revokeObjectURL(audioRef.current.src);
      if (videoRef.current?.src) URL.revokeObjectURL(videoRef.current.src);
    };
  }, []);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile && videoRef.current) {
      setFile(selectedFile);
      videoRef.current.src = URL.createObjectURL(selectedFile);
    }
  };

  const handleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setVideoText(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!file) {
      alert('Please select a file to upload');
      return;
    }

    setIsLoading(true); // Set loading to true before starting the upload process

    // Convert videoText to speech using OpenAI API
    try {
      const response = await fetch('https://api.openai.com/v1/audio/speech', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: "tts-1",
          input: videoText,
          voice: "alloy",
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to convert text to speech: ${response.statusText}`);
      }

      const blob = await response.blob();
      if (!audioRef.current) {
        audioRef.current = new Audio(URL.createObjectURL(blob));
      } else {
        audioRef.current.src = URL.createObjectURL(blob);
      }
    } catch (error) {
      console.error('Error converting text to speech:', error);
    } finally {
      setIsLoading(false); // Set loading to false after the upload process is complete
    }
  };

  // Synchronize video and audio playback
  useEffect(() => {
    const syncPlayback = () => {
      if (videoRef.current && audioRef.current) {
        videoRef.current.onplay = () => audioRef.current?.play();
        videoRef.current.onpause = () => audioRef.current?.pause();
        videoRef.current.ontimeupdate = () => {
          // @ts-ignore
          if (audioRef.current) audioRef.current.currentTime = videoRef.current.currentTime;
        };

        videoRef.current.onloadedmetadata = () => {
           // @ts-ignore
          if (audioRef.current && videoRef.current.duration < audioRef.current.duration) {
             // @ts-ignore
            videoRef.current.loop = true;
          }
        };
      }
    };

    syncPlayback();
  }, [videoText]);

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <Input type="file" accept="video/*" onChange={handleFileChange} className='p-20 font-black' />
        <Textarea placeholder="Enter text for the video" onChange={handleTextChange} className='mt-2' />
        <Button type="submit" className='mt-2' disabled={isLoading}>{isLoading ? 'Uploading...' : 'Upload'}</Button>
      </form>

      <div id="video-preview-container" className='w-full sm:w-[400px] lg:w-[1000px]'>
        <p className='py-2 font-semibold'>Video Preview:</p>
        <video ref={videoRef} controls style={{ width: '100%' }} className='rounded-lg border'></video>
      </div>
      <div id="audio-preview-container" className='mt-4 w-full sm:w-[400px] lg:w-[1000px]' style={{ display: 'none' }}>
        <p className='py-2 font-semibold'>Speech Preview:</p>
        <audio ref={audioRef} controls style={{ width: '100%' }} className='rounded-lg'></audio>
      </div>
    </div>
  );
};

export default UploadForm;