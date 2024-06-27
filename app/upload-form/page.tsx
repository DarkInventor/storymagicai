"use client";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import React, { useState } from 'react'

const UploadForm = () => {
  const [file, setFile] = useState<File | null>(null)
  const [base64Data, setBase64Data] = useState<string>('')
  const [fileType, setFileType] = useState<string>('')

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0]

    if (selectedFile) {
      setFile(selectedFile)
      const reader = new FileReader()

      reader.onload = () => {
        const result = reader.result
        if (typeof result === 'string') {
          setBase64Data(result)
          setFileType(selectedFile.type)
        }
      }

      reader.readAsDataURL(selectedFile)
    }
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!file) {
      alert('Please select a file to upload')
      return
    }

    // Simulate sending data to server (replace with actual API call)
    fetch('/api/upload', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ base64Data }),
    })

    .then(response => response.json())
    .then(data => console.log('Success:', data))
    .catch((error) => {
      console.error('Error:', error);
    });
    
    console.log('File Type:', fileType)
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <Input type="file" accept="image/*, video/*" onChange={handleFileChange} className='p-20 font-black' defaultValue="Your default text" />
        <Button type="submit" className='mt-2'>Upload</Button>
      </form>

      {base64Data && (
        <div>
          <h3>Base64 Data:</h3>
          <textarea
            value={base64Data}
            rows={10}
            style={{ width: '100%', fontFamily: 'monospace', fontSize: '14px' }}
            readOnly
          />
        </div>
      )}
    </div>
  )
}

export default UploadForm
