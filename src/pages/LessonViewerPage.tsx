import { UserInputSection, LessonResultSection } from "../components/LessonViewer"
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui";
import { Copy } from 'lucide-react'
import { Button } from "@/components/ui";
import { useState } from "react";
import { toast } from "sonner";

const LessonViewerPage = () => {
    const [inputText, setInputText] = useState<string>('');

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
    };


    return (
        <div className="flex flex-col w-full h-[100vh] space-y-2 bg-gray6">
            <div className='toolbar px-4 py-2 flex items-center justify-between h-12'>
                <div className="text-2xl text-black font-bold">Lesson markdown viewer</div>

                <Button
                    onClick={handleCopy}
                    className='cursor-pointer'
                    size="icon"
                    variant="default"
                >
                    <Copy size={16} />
                </Button>
            </div>
            <div className="flex flex-col w-full h-screen">
                <ResizablePanelGroup direction="horizontal" className="w-full h-full pb-4">
                    <ResizablePanel
                        order={1}
                        defaultSize={50}
                        minSize={10}
                        id="user-input-section"
                        className="bg-white"
                    >
                        <UserInputSection setInputText={setInputText} />
                    </ResizablePanel>

                    <ResizableHandle withHandle className="w-2 bg-gray5" />

                    <ResizablePanel
                        order={2}
                        defaultSize={50}
                        minSize={10}
                        id="lesson-result-section"
                        className="bg-white"
                    >
                        <LessonResultSection inputText={inputText} />
                    </ResizablePanel>
                </ResizablePanelGroup>
            </div>
        </div>

    )
}

export default LessonViewerPage