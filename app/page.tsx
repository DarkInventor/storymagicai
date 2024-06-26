import Link from "next/link"

import { siteConfig } from "@/config/site"
import { buttonVariants } from "@/components/ui/button"
import  UploadForm  from "./upload-form/page"

export default function IndexPage() {
  return (
    <section className="container flex flex-col items-center justify-center gap-6 pb-8 pt-6 md:py-10 mx-auto">
      <div className="flex flex-col items-center max-w-[980px] gap-2">
        <h1 className="text-center text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">
          Please upload the video <br className="hidden sm:inline" />
          {/* built with Radix UI and Tailwind CSS. */}
        </h1>
        <p className="text-center max-w-[600px] text-lg text-muted-foreground">
          StoryMagicAi will analyze the slideshow of photos or any videos. It is built for story narration. 
        </p>
      </div>
      <div className="flex justify-center gap-4">
        {/* <Link
          href={siteConfig.links.docs}
          target="_blank"
          rel="noreferrer"
          className={buttonVariants()}
        >
          Documentation
        </Link>
        <Link
          target="_blank"
          rel="noreferrer"
          href={siteConfig.links.github}
          className={buttonVariants({ variant: "outline" })}
        >
          GitHub
        </Link> */}

        <UploadForm />
      </div>
    </section>
  )
}
