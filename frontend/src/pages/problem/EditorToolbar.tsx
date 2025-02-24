import { Language } from '@/types'; 

interface EditorToolbarProps {
  onSubmit: () => void;
  onLanguageChange: (language: Language) => void;
  pending: boolean
  language: Language
}

export const EditorToolbar = ({ onSubmit, onLanguageChange, pending, language }: EditorToolbarProps) => {
  return (
    <div className="bg-gray-800 p-4 mb-4 flex items-center justify-between">
      <select 
        className="bg-gray-700 text-white px-3 py-2 "
        value={language}
        onChange={(e) => onLanguageChange(e.target.value as Language)}
      >
        {Object.values(Language).map((lang) => (
          <option key={lang} value={lang}>
            {lang.charAt(0).toUpperCase() + lang.slice(1)}
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