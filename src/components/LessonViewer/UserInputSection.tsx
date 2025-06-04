import { useRef, useEffect, useState } from 'react';

interface UserInputSectionProps {
  setInputText: (text: string) => void;
  editorRef?: React.MutableRefObject<HTMLTextAreaElement | null>;
  onScroll?: (scrollTop: number, scrollHeight: number, clientHeight: number) => void;
  storageKey?: string;
}

export const UserInputSection = ({ 
  setInputText, 
  editorRef, 
  onScroll,
  storageKey = 'userInputData' 
}: UserInputSectionProps) => {
  const internalEditorRef = useRef<HTMLTextAreaElement>(null);
  const actualEditorRef = editorRef || internalEditorRef;
  const [localInputText, setLocalInputText] = useState<string>('');

  // Load saved data from localStorage when component mounts
  useEffect(() => {
    const savedText = localStorage.getItem(storageKey);
    if (savedText) {
      setLocalInputText(savedText);
      setInputText(savedText);
      
      // Set the textarea value if ref is available
      if (actualEditorRef.current) {
        actualEditorRef.current.value = savedText;
      }
    }
  }, [storageKey, setInputText, actualEditorRef]);

  // Set up scroll event listener
  useEffect(() => {
    const editorElement = actualEditorRef.current;
    
    if (editorElement && onScroll) {
      const handleScroll = () => {
        onScroll(
          editorElement.scrollTop,
          editorElement.scrollHeight,
          editorElement.clientHeight
        );
      };

      editorElement.addEventListener('scroll', handleScroll);
      return () => editorElement.removeEventListener('scroll', handleScroll);
    }
  }, [actualEditorRef, onScroll]);
  
  // Handle input changes and save to localStorage
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setLocalInputText(newText);
    setInputText(newText);
    localStorage.setItem(storageKey, newText);
  };

  return (
    <div className='h-full w-full overflow-hidden'>
      <textarea
        ref={actualEditorRef}
        className='bg-white h-full w-full text-black focus:outline-none px-4 py-2 overflow-y-auto align-text-top synced-scroll'
        placeholder='Enter your text here'
        value={localInputText}
        onChange={handleInputChange}
        style={{ resize: 'none' }}
      />
    </div>
  );
}
