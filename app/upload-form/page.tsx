"use client";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import React, { useState, useEffect, useRef } from 'react';
import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';

const UploadForm = () => {
  const [file, setFile] = useState<File | null>(null);
  const [videoText, setVideoText] = useState<string>('');
  const [voice, setVoice] = useState<string>('Alloy');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const ffmpeg = createFFmpeg({ log: true });

  useEffect(() => {
    if (!ffmpeg.isLoaded()) {
      ffmpeg.load();
    }
    return () => {
      if (audioRef.current?.src) URL.revokeObjectURL(audioRef.current.src);       
      if (videoRef.current?.src) URL.revokeObjectURL(videoRef.current.src);
    };
  }, []);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      // @ts-ignore
      videoRef.current.src = URL.createObjectURL(selectedFile);
         // @ts-ignore
      videoRef.current.playbackRate = 1; // Ensure normal playback speed
         // @ts-ignore
      videoRef.current.volume = 1; // Max volume for best audio experience
    }
  };

  const handleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setVideoText(event.target.value);
  };

  const handleVoiceChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedVoice = event.target.value.toLowerCase(); // Ensure voice value is in lowercase for API compatibility
    setVoice(selectedVoice);
    console.log(`Selected voice: ${selectedVoice}`);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!file) {
      alert('Please select a file to upload');
      return;
    }

    setIsLoading(true); // Set loading to true before starting the upload process

    // Convert videoText to speech using OpenAI API with high-quality settings
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
          voice: voice, // Directly use the voice state without converting to JSON string
          format: "mp3",
          sample_rate: 48000, // High-quality sample rate for professional-level audio
        }),
      });

      console.log(`Voice sent to OpenAI API: ${voice}`); // Log the voice being passed to OpenAI API

      if (!response.ok) {
        throw new Error(`Failed to convert text to speech: ${response.statusText}`);
      }

      const blob = await response.blob();
      const audioUrl = URL.createObjectURL(blob);
      audioRef.current = new Audio(audioUrl);
      audioRef.current.playbackRate = 1; // Ensure normal playback speed
      audioRef.current.volume = 1; // Max volume for best audio experience

      // Encode video and audio for higher quality and continuous sound
      if (videoRef.current) {
        await ffmpeg.FS('writeFile', 'input.mp4', await fetchFile(videoRef.current.src));
      }
      await ffmpeg.FS('writeFile', 'input.mp3', await fetchFile(audioUrl));

      // Use advanced audio encoding settings to ensure continuous and high-quality audio
      await ffmpeg.run(
        '-i', 'input.mp4',
        '-i', 'input.mp3',
        '-filter_complex', '[1:a]aresample=async=1:first_pts=0[a]',
        '-map', '0:v',
        '-map', '[a]',
        '-c:v', 'copy',
        '-c:a', 'aac',
        '-b:a', '192k',
        'output.mp4'
      );

      const output = ffmpeg.FS('readFile', 'output.mp4');
      const outputBlob = new Blob([output.buffer], { type: 'video/mp4' });
      const outputUrl = URL.createObjectURL(outputBlob);
      // @ts-ignore
      videoRef.current.src = outputUrl;
      audioRef.current.src = audioUrl;
      audioRef.current.play(); // Allow audio to run in the background
    } catch (error) {
      console.error('Error converting text to speech or encoding:', error);
    } finally {
      setIsLoading(false); // Set loading to false after the upload process is complete
    }
  };

  // Synchronize video and audio playback with high-quality settings
  useEffect(() => {
    const syncPlayback = () => {
      if (videoRef.current && audioRef.current) {
        videoRef.current.onplay = () => audioRef.current?.play();
        videoRef.current.onpause = () => audioRef.current?.pause();
        videoRef.current.ontimeupdate = () => {
             // @ts-ignore
          if (audioRef.current && Math.abs(audioRef.current.currentTime - videoRef.current.currentTime) > 0.2) {
            // @ts-ignore
            audioRef.current.currentTime = videoRef.current.currentTime;
          }
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
        
        <select value={voice} onChange={handleVoiceChange} className='mt-2 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-black bg-white'>
          <option value="alloy">Alloy</option>
          <option value="echo">Echo</option>
          <option value="fable">Fable</option>
          <option value="onyx">Onyx</option>
          <option value="nova">Nova</option>
          <option value="shimmer">Shimmer</option>
        </select>
        
        <Textarea placeholder="Enter text for the video" onChange={handleTextChange} className='mt-2' />
        <Button type="submit" className='mt-2' disabled={isLoading}>{isLoading ? 'Uploading...' : 'Upload'}</Button>
      </form>

      <div id="video-preview-container" className='w-full sm:w-[400px] lg:w-[1000px]'>
        <p className='py-2 font-semibold'>Video Preview:</p>
        <video ref={videoRef} controls style={{ width: '100%' }} className='rounded-lg border'></video>
      </div>
      <div id="audio-preview-container" className='mt-4 w-full sm:w-[400px] lg:w-[1000px]' style={{ display: 'block' }}> {/* Changed display to 'block' to show audio controls */}
        <p className='py-2 font-semibold'>Speech Preview:</p>
        <audio ref={audioRef} controls style={{ width: '100%' }} className='rounded-lg'></audio>
      </div>
    </div>
  );
};

export default UploadForm;