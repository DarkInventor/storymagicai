// "use client"

// import React, { useCallback, useState, useRef } from "react"
// import { useDropzone } from "react-dropzone"

// import { Button } from "@/components/ui/button"

// export default function UploadForm() {
//   const [uploadedFile, setUploadedFile] = useState<File | null>(null)
//   const [uploadedFileName, setUploadedFileName] = useState("")
//   const [previewSrc, setPreviewSrc] = useState("")
//   const [fileType, setFileType] = useState("")
//   const fileRef = useRef<File | null>(null)

//   const onDrop = useCallback((acceptedFiles: File[]) => {
//     acceptedFiles.forEach((file: File) => {
//       setUploadedFile(file) // Update state with the whole file
//       fileRef.current = file // Keep a ref to the file
//       setUploadedFileName(file.name) // Update state with the file name
//       setFileType(file.type) // Update state with the file type
//       const reader = new FileReader()

//       reader.onabort = () => console.log("file reading was aborted")
//       reader.onerror = () => console.log("file reading has failed")
//       reader.onload = (e) => {
//         // Set preview source for image/video
//         const src = e.target?.result
//         setPreviewSrc(src as string)
//       }
//       if (file.type.startsWith("image/") || file.type.startsWith("video/")) {
//         reader.readAsDataURL(file)
//       }
//     })
//   }, [])
//   const { getRootProps, getInputProps } = useDropzone({ onDrop })

//   const handleUploadClick = () => {
//     if (fileRef.current) {
//       console.log(`Uploaded file: ${uploadedFileName}, Type: ${fileType}, Preview Source: ${previewSrc}`);
//       // Here you would typically handle the file upload process, e.g., sending it to a server
//       // For demonstration, we're just logging the file object
//       console.log("File object:", fileRef.current);
//     } else {
//       console.log("No file uploaded.");
//     }
//   }

//   return (
//     <div className="grid gap-4">
//       <div
//         {...getRootProps()}
//         className="border-dashed border-4 border-gray-200 rounded-lg p-4 md:p-20 text-center cursor-pointer relative"
//         style={{ width: "100%", height: "100%", objectFit: "contain" }}
//       >
//         <input {...getInputProps()} />
//         <div
//           className="flex flex-col justify-center items-center"
//           style={{ height: "200px" }}
//         >
//           {!previewSrc && (
//             // SVG for upload, centered with responsive size
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               className="h-12 w-12 md:h-20 md:w-20 text-gray-600"
//               fill="none"
//               viewBox="0 0 24 24"
//               stroke="currentColor"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth="2"
//                 d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4-4m0 0l-4 4m4-4v12"
//               />
//             </svg>
//           )}
//           {previewSrc && (
//             <>
//               {fileType.startsWith("image/") ? (
//                 <img
//                   src={previewSrc}
//                   alt="Preview"
//                   className="max-h-full max-w-full"
//                 />
//               ) : fileType.startsWith("video/") ? (
//                 <video
//                   src={previewSrc}
//                   className="max-h-full max-w-full"
//                   controls
//                 />
//               ) : null}
//               <button
//                 onClick={() => {
//                   setUploadedFile(null)
//                   setUploadedFileName("")
//                   setPreviewSrc("")
//                   setFileType("")
//                 }}
//                 className="absolute top-0 right-0 p-2"
//               >
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   className="h-6 w-6 text-gray-600"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                   stroke="currentColor"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth="2"
//                     d="M6 18L18 6M6 6l12 12"
//                   />
//                 </svg>
//               </button>
//             </>
//           )}
//         </div>

//         <p className="mt-1 text-sm md:text-base text-gray-600">
//           {uploadedFileName
//             ? `Uploaded: ${uploadedFileName}`
//             : "Drag N drop some files here, or click to select files"}
//         </p>
//       </div>
//       <Button type="submit" onClick={handleUploadClick}> Upload </Button>
//     </div>
//   )
// }

"use client"

import React, { useCallback, useState, useRef } from "react"
import { useDropzone } from "react-dropzone"

import { Button } from "@/components/ui/button"

export default function UploadForm() {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [uploadedFileName, setUploadedFileName] = useState("")
  const [previewSrc, setPreviewSrc] = useState("")
  const [fileType, setFileType] = useState("")
  const fileRef = useRef<File | null>(null)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    acceptedFiles.forEach((file: File) => {
      setUploadedFile(file) // Update state with the whole file
      fileRef.current = file // Keep a ref to the file
      setUploadedFileName(file.name) // Update state with the file name
      setFileType(file.type) // Update state with the file type
      const reader = new FileReader()

      reader.onabort = () => console.log("file reading was aborted")
      reader.onerror = () => console.log("file reading has failed")
      reader.onload = (e) => {
        // Set preview source for image/video
        const src = e.target?.result
        setPreviewSrc(src as string)
      }
      if (file.type.startsWith("image/") || file.type.startsWith("video/")) {
        reader.readAsDataURL(file)
      }
    })
  }, [])
  const { getRootProps, getInputProps } = useDropzone({ onDrop })

  const handleUploadClick = async () => {
    if (fileRef.current) {
      // console.log(`Uploaded file: ${uploadedFileName}, Type: ${fileType}, Preview Source: ${previewSrc}`)
      const formData = new FormData()
      formData.append("file", fileRef.current)

      try {
        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        })
        if (response.ok) {
          console.log("File uploaded successfully")
        } else {
          console.error("File upload failed")
        }
      } catch (error) {
        console.error("Error uploading file:", error)
      }
    } else {
      console.log("No file uploaded.")
    }
  }

  return (
    <div className="grid gap-4">
      <div
        {...getRootProps()}
        className="border-dashed border-4 border-gray-200 rounded-lg p-4 md:p-20 text-center cursor-pointer relative"
        style={{ width: "100%", height: "100%", objectFit: "contain" }}
      >
        <input {...getInputProps()} />
        <div
          className="flex flex-col justify-center items-center"
          style={{ height: "200px" }}
        >
          {!previewSrc && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 md:h-20 md:w-20 text-gray-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4-4m0 0l-4 4m4-4v12"
              />
            </svg>
          )}
          {previewSrc && (
            <>
              {fileType.startsWith("image/") ? (
                <img
                  src={previewSrc}
                  alt="Preview"
                  className="max-h-full max-w-full"
                />
              ) : fileType.startsWith("video/") ? (
                <video
                  src={previewSrc}
                  className="max-h-full max-w-full"
                  controls
                />
              ) : null}
              <button
                onClick={() => {
                  setUploadedFile(null)
                  setUploadedFileName("")
                  setPreviewSrc("")
                  setFileType("")
                }}
                className="absolute top-0 right-0 p-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-gray-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </>
          )}
        </div>

        <p className="mt-1 text-sm md:text-base text-gray-600">
          {uploadedFileName
            ? `Uploaded: ${uploadedFileName}`
            : "Drag N drop some files here, or click to select files"}
        </p>
      </div>
      <Button type="submit" onClick={handleUploadClick}> Upload </Button>
    </div>
  )
}
