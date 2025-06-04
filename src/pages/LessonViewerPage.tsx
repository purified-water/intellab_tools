import { UserInputSection, LessonResultSection } from "../components/LessonViewer"
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui";
import { Copy, Link, Link2Off } from 'lucide-react'
import { Button } from "@/components/ui";
import { useState, useRef, useCallback } from "react";
import { toast } from "sonner";

const LessonViewerPage = () => {
    const [inputText, setInputText] = useState<string>('');
    const [isSyncEnabled, setIsSyncEnabled] = useState<boolean>(true);
    const [isEditorScrolling, setIsEditorScrolling] = useState<boolean>(false);
    const [isPreviewScrolling, setIsPreviewScrolling] = useState<boolean>(false);

    // Create refs for the editor and preview elements
    const editorRef = useRef<HTMLTextAreaElement>(null);
    const previewRef = useRef<HTMLDivElement>(null);
    // Use a ref for the scroll timeout to avoid re-renders
    const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);    // Toggle sync scrolling
    const toggleSync = () => {
        setIsSyncEnabled(prev => !prev);
        toast.success(isSyncEnabled ? "Sync scrolling disabled" : "Sync scrolling enabled");
    };

    // Function to handle synchronized scrolling from editor to preview
    const handleEditorScroll = useCallback((scrollTop: number, scrollHeight: number, clientHeight: number) => {
        if (!isSyncEnabled || isPreviewScrolling) return; // Don't sync if disabled or if we're in a scroll loop

        setIsEditorScrolling(true);
        const previewElement = previewRef.current;
        if (previewElement) {
            // Clear existing timeout to prevent multiple updates
            if (scrollTimeoutRef.current) {
                clearTimeout(scrollTimeoutRef.current);
            }

            // Use requestAnimationFrame for smoother performance
            requestAnimationFrame(() => {
                // Calculate scroll percentage, with safeguards against division by zero
                const editorScrollMax = Math.max(1, scrollHeight - clientHeight);
                const scrollPercentage = Math.max(0, Math.min(1, scrollTop / editorScrollMax));

                // Apply the same percentage to the preview
                const previewScrollMax = Math.max(1, previewElement.scrollHeight - previewElement.clientHeight);
                previewElement.scrollTop = scrollPercentage * previewScrollMax;

                // Reset the flag after a delay
                scrollTimeoutRef.current = setTimeout(() => {
                    setIsEditorScrolling(false);
                }, 100);
            });
        }
    }, [isSyncEnabled, isPreviewScrolling]);

    // Function to handle synchronized scrolling from preview to editor
    const handlePreviewScroll = useCallback((scrollTop: number, scrollHeight: number, clientHeight: number) => {
        if (!isSyncEnabled || isEditorScrolling) return; // Don't sync if disabled or if we're in a scroll loop

        setIsPreviewScrolling(true);
        const editorElement = editorRef.current;
        if (editorElement) {
            // Clear existing timeout to prevent multiple updates
            if (scrollTimeoutRef.current) {
                clearTimeout(scrollTimeoutRef.current);
            }

            // Use requestAnimationFrame for smoother performance
            requestAnimationFrame(() => {
                // Calculate scroll percentage, with safeguards against division by zero
                const previewScrollMax = Math.max(1, scrollHeight - clientHeight);
                const scrollPercentage = Math.max(0, Math.min(1, scrollTop / previewScrollMax));

                // Apply the same percentage to the editor
                const editorScrollMax = Math.max(1, editorElement.scrollHeight - editorElement.clientHeight);
                editorElement.scrollTop = scrollPercentage * editorScrollMax;

                // Reset the flag after a delay
                scrollTimeoutRef.current = setTimeout(() => {
                    setIsPreviewScrolling(false);
                }, 100);
            });
        }
    }, [isSyncEnabled, isEditorScrolling]);

    const handleCopy = async () => {
        if (inputText) {
            try {
                await navigator.clipboard.writeText(inputText);
                toast.success("Copied to clipboard");
            } catch (err) {
                console.error("Failed to copy: ", err);
                toast.error("Failed to copy to clipboard");
            }
        }
    }; return (
        <div className="flex flex-col w-full h-screen max-h-[100vh] overflow-hidden bg-gray6">
            <div className='toolbar px-4 py-2 flex items-center justify-between h-12 min-h-[48px] flex-shrink-0 border-b'>
                <div className="text-2xl text-black font-bold">Lesson markdown viewer</div>

                <div className="flex items-center gap-2">
                    <Button
                        onClick={toggleSync}
                        className='cursor-pointer'
                        size="sm"
                        variant={isSyncEnabled ? "default" : "outline"}
                        title={isSyncEnabled ? "Disable sync scrolling" : "Enable sync scrolling"}
                    >
                        {isSyncEnabled ? (
                            <>
                                <Link size={14} className="mr-1" /> Sync On
                            </>
                        ) : (
                            <>
                                <Link2Off size={14} className="mr-1" /> Sync Off
                            </>
                        )}
                    </Button>
                    <Button
                        onClick={handleCopy}
                        className='cursor-pointer'
                        size="icon"
                        variant="default"
                        title="Copy markdown"
                    >
                        <Copy size={16} />
                    </Button>
                </div>
            </div>
            <div className="flex-1 w-full overflow-hidden" style={{ height: 'calc(100vh - 48px)' }}>
                <ResizablePanelGroup direction="horizontal" className="w-full h-full">
                    <ResizablePanel
                        order={1}
                        defaultSize={50}
                        minSize={10}
                        id="user-input-section"
                        className="bg-white overflow-hidden"
                    >
                        <UserInputSection
                            setInputText={setInputText}
                            editorRef={editorRef}
                            onScroll={handleEditorScroll}
                        />
                    </ResizablePanel>

                    <ResizableHandle withHandle className="w-2 bg-gray5" />
                    <ResizablePanel
                        order={2}
                        defaultSize={50}
                        minSize={10}
                        id="lesson-result-section"
                        className="bg-white overflow-hidden"
                    >
                        <LessonResultSection
                            inputText={inputText}
                            previewRef={previewRef}
                            onScroll={handlePreviewScroll}
                        />
                    </ResizablePanel>
                </ResizablePanelGroup>
            </div>
        </div>

    )
}

export default LessonViewerPage