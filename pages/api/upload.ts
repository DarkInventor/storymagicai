import { NextApiRequest, NextApiResponse } from 'next'
import { IncomingForm, Files } from 'formidable'
import fs from 'fs'
import path from 'path'

export const config = {
  api: {
    bodyParser: false,
  },
}

const uploadDir = path.join(process.cwd(), 'public', 'uploads')

// Ensure upload directory exists
fs.mkdirSync(uploadDir, { recursive: true })

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const form = new IncomingForm({
      uploadDir,
      keepExtensions: true,
      maxFileSize: 50 * 1024 * 1024, // 50MB
    })

    form.parse(req, (err, fields, files: Files) => {
      if (err) {
        console.error('Error parsing the files', err)
        return res.status(500).json({ message: 'Error parsing the files' })
      }

      // Handle single file or multiple files
      const uploadedFiles = files.file;
      const fileArray = Array.isArray(uploadedFiles) ? uploadedFiles : [uploadedFiles].filter(f => f !== undefined);
      
      fileArray.forEach((file) => {
        if (file && file.originalFilename && file.filepath) {
          const filePath = path.join(uploadDir, file.originalFilename)

          fs.rename(file.filepath, filePath, (err) => {
            if (err) {
              console.error('Error moving the file', err)
              return res.status(500).json({ message: 'Error moving the file' })
            }

            console.log(`File ${file.originalFilename} uploaded successfully to ${filePath}`)
          })
        }
      })

      res.status(200).json({ message: 'Files uploaded successfully' })
    })
  } else {
    res.status(405).json({ message: 'Method not allowed' })
  }
}

export default handler

