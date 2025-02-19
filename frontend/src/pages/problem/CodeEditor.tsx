import { useRef, useEffect, useState } from 'react';
import { Extension, useCodeMirror } from '@uiw/react-codemirror';
import { vscodeDark } from '@uiw/codemirror-theme-vscode';
import { Language } from '@/types';


interface CodeEditorProps { 
  language: Language;
  code: string;
  setCode: (code: string) => void;
}

export const CodeEditor = ({ language, code, setCode }: CodeEditorProps) => {
  const [langExtension, setLangExtension] = useState<Extension | null>(null);
  
  useEffect(() => {
    const loadLanguageExtension = async () => {
      let extension: Extension;
      switch (language) {
        case Language.JAVASCRIPT:
        case Language.JAVA:
          const { javascript } = await import('@codemirror/lang-javascript');
          extension = javascript();
          break;
        case Language.PYTHON:
          const { python } = await import('@codemirror/lang-python');
          extension = python();
          break;
        case Language.CPP:
          const { cpp } = await import('@codemirror/lang-cpp');
          extension = cpp();
          break;
        default:
          return;
      }
      setLangExtension(extension);
    };

    loadLanguageExtension();
  }, [language]);

  const editorRef = useRef<HTMLDivElement>(null);

  const { setContainer } = useCodeMirror({
    container: editorRef.current,
    extensions: [langExtension].filter(Boolean) as Extension[],
    theme: vscodeDark,
    value: code,
    height: '100%',
    editable: true,
    style: {
      fontSize: '14px',
    },
    onChange: (value: string) => {
      setCode(value);
    },
  });

  useEffect(() => {
    if (editorRef.current) {
      setContainer(editorRef.current);
    }
  }, [editorRef.current]);

  return (
    <div className="editor-container">
      <div ref={editorRef} className="h-full" />
    </div>
  );
}; 