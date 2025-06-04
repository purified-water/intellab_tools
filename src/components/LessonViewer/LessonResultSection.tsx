import { useEffect, useState, useRef } from "react";
import { RenderMarkdown } from "./RenderLessonContent";
import { TableOfContents, TOCItem } from "./TableOfContents";

interface LessonResultSectionProps {
  inputText: string;
  previewRef?: React.MutableRefObject<HTMLDivElement | null>;
  onScroll?: (scrollTop: number, scrollHeight: number, clientHeight: number) => void;
}

export const LessonResultSection = ({ inputText, previewRef, onScroll }: LessonResultSectionProps) => {
  const [tocItems, setTocItems] = useState<TOCItem[]>([]);
  const [activeHeading, setActiveHeading] = useState<string | null>(null);
  const internalPreviewRef = useRef<HTMLDivElement>(null);
  const actualPreviewRef = previewRef || internalPreviewRef;

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
  // Add scroll event handler for the preview component
  useEffect(() => {
    const previewElement = actualPreviewRef.current;

    if (previewElement && onScroll) {
      const handleScroll = () => {
        onScroll(
          previewElement.scrollTop,
          previewElement.scrollHeight,
          previewElement.clientHeight
        );
      };

      previewElement.addEventListener('scroll', handleScroll);
      return () => previewElement.removeEventListener('scroll', handleScroll);
    }
  }, [actualPreviewRef, onScroll]); const renderContent = () => {
    return (
      <div className="h-full overflow-y-auto overflow-x-hidden synced-scroll pr-4 space-y-6" ref={actualPreviewRef}>
        <RenderMarkdown content={inputText} setTocItems={setTocItems} />
      </div>
    );
  };
  return (
    <>
      <div className="grid grid-cols-1 gap-2 p-2 lg:grid-cols-5 h-full overflow-hidden">
        <div className="col-span-1 lg:col-span-4 h-full overflow-hidden">
          {renderContent()}
        </div>
        <div className="hidden col-span-1 lg:block">
          <div className="sticky top-5 lg:right-4 max-h-[90%] overflow-y-auto">
            <TableOfContents items={tocItems} activeId={activeHeading} />
          </div>
        </div>
      </div>
    </>
  )
}