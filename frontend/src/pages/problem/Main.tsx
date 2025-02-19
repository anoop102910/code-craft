import { useParams } from "react-router-dom";
import { ProblemDescription } from "./ProblemDescription";
import { CodeEditor } from "./CodeEditor";
import { EditorToolbar } from "./EditorToolbar";
import "@/styles/editor.css";
import { useState } from "react";
import { Language } from "@/types";
import { useProblem } from "@/services/problems.service";
import { ConsoleError } from "./ConsoleError";
import { TestResults } from "./TestResults";

const DEFAULT_CODE = {
  [Language.CPP]: `#include <iostream>
using namespace std;

int main() {
  cout << "Hello, World!" << endl;
}
  `,
  [Language.PYTHON]: `print("Hello, World!")
  `,
  [Language.JAVASCRIPT]: `console.log("Hello, World!"); 
  `,
  [Language.JAVA]: `public class Main {
  public static void main(String[] args) {
    System.out.println("Hello, World!");
  }
}`,
};

export const ProblemPage = () => {
  const { slug } = useParams();

  if (!slug) {
    return <div>Problem not found</div>;
  }
  
  const { problemData, isLoading, error } = useProblem(slug);
  const [language, setLanguage] = useState<Language>(Language.CPP);
  const [editorCode, setEditorCode] = useState<string>(DEFAULT_CODE[language]);
  const [pending, setPending] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>("description");
  const [consoleError, setConsoleError] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<{
    correct_cases: number;
    incorrect_cases: number;
    result: boolean;
  } | null>(null);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };
  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!problemData) {
    return <div>Problem not found</div>;
  }

  const problem = problemData.data;
  console.log(problem);

  const handleSubmit = async () => {
    setPending(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_CODE_RUNNER_API_URL}/run`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code: editorCode, language, slug }),
      });
      const data = await response.json();
      console.log(data);
      if (response.ok) {
        setConsoleError(null);
        setTestResult(data);
        setActiveTab("results");
      } else {
        setActiveTab("console");
        setConsoleError(data.error.stderr);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setPending(false);
    }
  };

  const handleLanguageChange = (language: Language) => {
    setLanguage(language);
    setEditorCode(DEFAULT_CODE[language]);
  };

  return (
    <div className="flex h-[calc(100vh-7rem)] gap-4">
      <div className="w-1/2 overflow-y-auto">
        <div className="tabs">
          <button
            onClick={() => handleTabChange("description")}
            className={`tab ${activeTab === "description" ? "active" : ""}`}
          >
            Description
          </button>
          {testResult && (
            <button
              onClick={() => handleTabChange("results")}
              className={`tab ${activeTab === "results" ? "active" : ""}`}
            >
              Results
            </button>
          )}
          {consoleError && (
            <button
              onClick={() => handleTabChange("console")}
              className={`tab ${activeTab === "console" ? "active" : ""}`}
            >
              Console
            </button>
          )}
        </div>
        <div className="p-4">
          {activeTab === "description" && <ProblemDescription problem={problem} />}
          {activeTab === "console" && consoleError && <ConsoleError error={consoleError} />}
          {activeTab === "results" && testResult && <TestResults results={testResult} />}
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        <EditorToolbar
          onSubmit={handleSubmit}
          onLanguageChange={handleLanguageChange}
          pending={pending}
        />
        <CodeEditor language={language} code={editorCode} setCode={setEditorCode} />
      </div>
    </div>
  );
};
