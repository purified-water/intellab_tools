import { useEffect, useState } from "react";
import { RenderMarkdown } from "./RenderLessonContent";
import { TableOfContents, TOCItem } from "./TableOfContents";

interface LessonResultSectionProps {
  inputText: string;
}

export const LessonResultSection = ({ inputText }: LessonResultSectionProps) => {
  const [tocItems, setTocItems] = useState<TOCItem[]>([]);
  const [activeHeading, setActiveHeading] = useState<string | null>(null);

  // Setup intersection observer for headings
  useEffect(() => {
    if (!tocItems.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveHeading(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-100px 0px -80% 0px",
        threshold: 0
      }
    );

    // Observe all heading elements
    tocItems.forEach((item) => {
      const element = document.getElementById(item.id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => {
      // Cleanup observer
      observer.disconnect();
    };
  }, [tocItems]);

  const renderContent = () => {
    return (
      <div className="pr-4 space-y-6 h-full">
        <RenderMarkdown content={inputText} setTocItems={setTocItems} />
      </div>
    );
    return null;
  };

  return (
    <>
      <div className="grid grid-cols-1 gap-2 p-6 pl-8 lg:grid-cols-5 h-full">
        <div className="col-span-1 lg:col-span-4">
          {renderContent()}
        </div>
        <div className="hidden col-span-1 lg:block">
          <div className="sticky top-5 lg:right-4">
            <TableOfContents items={tocItems} activeId={activeHeading} />
          </div>
        </div>
      </div>
    </>
  )
}