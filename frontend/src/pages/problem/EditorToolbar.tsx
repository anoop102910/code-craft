import { Language } from '@/types'; 

interface EditorToolbarProps {
  onSubmit: () => void;
  onLanguageChange: (language: Language) => void;
  pending: boolean
}

export const EditorToolbar = ({ onSubmit, onLanguageChange, pending }: EditorToolbarProps) => {
  return (
    <div className="bg-gray-800 p-4 mb-4 flex items-center justify-between">
      <select 
        className="bg-gray-700 text-white px-3 py-2 "
        defaultValue="javascript"
        onChange={(e) => onLanguageChange(e.target.value as Language)}
      >
        {Object.values(Language).map((language) => (
          <option key={language} value={language}>
            {language}
          </option>
        ))}
      </select>

      <button 
        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2"
        onClick={onSubmit}
        disabled={pending}
      >
        {pending ? 'Submitting...' : 'Submit'}
      </button>
    </div>
  );
}; 