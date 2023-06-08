"use client"

import getSectionId from "@/utils/get-section-id"
import { OpenAPIV3 } from "openapi-types"
import Section from "../../Section"
import TagSectionPaths from "../Paths"
import MDXContentClient from "@/components/MDXContent/Client"
import { useInView } from "react-intersection-observer"
import { useState } from "react"
import Skeleton from "react-loading-skeleton"
import { useRouter } from "next/navigation"
import { useSidebar } from "@/providers/sidebar"
import "react-loading-skeleton/dist/skeleton.css"

type TagSectionProps = {
  tag: OpenAPIV3.TagObject
} & React.HTMLAttributes<HTMLDivElement>

const TagSection = ({ tag }: TagSectionProps) => {
  const { changeActiveItem } = useSidebar()
  const [loadPaths, setLoadPaths] = useState(false)
  const slugTagName = getSectionId([tag.name])
  const router = useRouter()
  const { ref } = useInView({
    threshold: 0.5,
    onChange: (inView) => {
      if (inView && !loadPaths) {
        setLoadPaths(true)
      }
      if (inView) {
        void router.push(`#${slugTagName}`)
        changeActiveItem(slugTagName)
      }
    },
  })

  return (
    <div className="min-h-screen" id={slugTagName} ref={ref}>
      <h2>{tag.name}</h2>
      {tag.description && (
        <Section
          addToSidebar={false}
          content={<MDXContentClient content={tag.description} />}
        />
      )}
      {loadPaths && <TagSectionPaths tag={tag} />}
      {!loadPaths && (
        <Skeleton count={10} containerClassName="w-api-ref-content block" />
      )}
    </div>
  )
}

export default TagSection