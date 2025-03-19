interface UserInputSectionProps {
  setInputText: (text: string) => void;
}

export const UserInputSection = ({ setInputText }: UserInputSectionProps) => {
  return (
    <div className='h-[100%] w-full'>
      <textarea
        className='bg-white h-full w-full text-black focus:outline-none px-4 py-2 overflow-y-scroll align-text-top'
        placeholder='Enter your text here'
        onChange={(e) => setInputText(e.target.value)}
      />
    </div>
  )
}
