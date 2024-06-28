"use client";
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    const base64Data = req.body.base64Data;
    console.log(base64Data); // Simply log the base64 data
    res.status(200).json({ message: 'Base64 data received' });
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
