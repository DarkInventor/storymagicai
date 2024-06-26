"use client"

import { z } from "zod"

const formSchema = z.object({
  file: z
    .instanceof(File, {
      message: "File is required.",
    })
    .optional(),
})
