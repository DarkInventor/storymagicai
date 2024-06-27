import type { NextApiRequest, NextApiResponse } from 'next'

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    res.status(200).json({ message: 'Data received successfully', receivedData: req.body.base64Data });
    const base64Data = req.body.base64Data;
    if (base64Data) {
      // Split the base64 string to get the metadata and the actual base64 data
      const parts = base64Data.split(';base64,');
      const imageData = parts[1];
      const imageBuffer = Buffer.from(imageData, 'base64');


      // Assuming the use of a file system or a database to store the image
      // For demonstration, we'll simulate saving the image buffer to a file
      // const fs = require('fs');
      // const path = require('path');
      // const imagePath = path.join( 'image.png'); // Example path and file name
      // fs.writeFileSync(imagePath, imageBuffer);

      res.status(200).json({ message: 'Image saved successfully' });
    } else {
      res.status(400).json({ message: 'No base64 data provided' });
    }
    res.status(200).json({ message: 'Data received successfully' });
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
