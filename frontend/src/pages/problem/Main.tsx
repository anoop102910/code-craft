import { useParams } from "react-router-dom";
import { ProblemDescription } from "./ProblemDescription";
import { CodeEditor } from "./CodeEditor";
import { EditorToolbar } from "./EditorToolbar";
import "@/styles/editor.css";
import { useState, useRef, useEffect } from "react";
import { Language } from "@/types";
import { useProblem } from "@/services/problems.service";
import { ConsoleError } from "./ConsoleError";
import { TestResults } from "./TestResults";
import { api, apiService } from "@/services/api.service";

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
  const [language, setLanguage] = useState<Language>(Language.PYTHON);
  const [editorCode, setEditorCode] = useState<string>(DEFAULT_CODE[language]);
  const [pending, setPending] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>("description");
  const [consoleError, setConsoleError] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<{
    correct_cases: number;
    incorrect_cases: number;
    result: boolean;
  } | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const countRef = useRef<number>(0);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

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

  const handleSubmit = async () => {
    setPending(true);
    try {
      const submissionReponse = await apiService.code.submit({
        code: editorCode,
        language,
        problem: problem.id,
      });
      console.log(submissionReponse);

      intervalRef.current = setInterval(async () => {
        countRef.current++;
        console.log(countRef.current);
        if (countRef.current > 40) {
          countRef.current = 0;
          clearInterval(intervalRef.current!);
          setConsoleError("Time limit exceeded");
          setActiveTab("console");
          setPending(false);
          return;
        }
        try {
          const userCodeResponse = await apiService.code.get_user_code(
            submissionReponse.user_code_id
          );
          console.log(userCodeResponse);

          if (userCodeResponse.status === "pending") {
            return;
          }

          if (userCodeResponse.status === "completed") {
            console.log(userCodeResponse);
            setPending(false);
            clearInterval(intervalRef.current!);
            if (userCodeResponse.result === "accepted") {
              setConsoleError(null);
              setTestResult({
                correct_cases: userCodeResponse.correct_cases,
                incorrect_cases: userCodeResponse.incorrect_cases,
                result: true,
              });
              setActiveTab("results");
            } else if (userCodeResponse.result === "wrong_answer") {
              setConsoleError(null);
              setTestResult({
                correct_cases: userCodeResponse.correct_cases,
                incorrect_cases: userCodeResponse.incorrect_cases,
                result: false,
              });
              setActiveTab("results");
            } else {
              setConsoleError(userCodeResponse.error_message);
              setTestResult(null);
              setActiveTab("console");
            }
          }
        } catch (error) {
          console.error(error);
          clearInterval(intervalRef.current!);
        }
      }, 1000);
    } catch (error) {
      setPending(false);
      console.error(error);
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
          language={language}
          onLanguageChange={handleLanguageChange}
          pending={pending}
        />
        <CodeEditor language={language} code={editorCode} setCode={setEditorCode} />
      </div>
    </div>
  );
};
