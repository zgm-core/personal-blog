'use client'

import { useState } from 'react'
import projectsData from '@/data/projectsData'
import Card from '@/components/Card'
import ProjectModal from '@/components/ProjectModal'

export default function ProjectList() {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)

  return (
    <>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {projectsData.map((d, idx) => (
          <div
            key={d.title}
            className="animate-fade-in-up"
            style={{ animationDelay: `${0.05 + idx * 0.07}s` }}
          >
            <Card
              title={d.title}
              description={d.description}
              imgSrc={d.imgSrc}
              href={d.href}
              previewUrl={d.previewUrl}
              tags={d.tags}
              stats={d.stats}
              onPreviewClick={() => setSelectedIndex(idx)}
            />
          </div>
        ))}
      </div>

      {/* 放大预览模态框 */}
      {selectedIndex !== null && (
        <ProjectModal
          project={projectsData[selectedIndex]}
          onClose={() => setSelectedIndex(null)}
        />
      )}
    </>
  )
}
