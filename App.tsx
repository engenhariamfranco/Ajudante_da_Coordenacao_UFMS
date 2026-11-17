import React, { useState, useCallback } from 'react';
import { FileUpload } from './components/FileUpload';
import { ResultsDisplay } from './components/ResultsDisplay';
import { Loader } from './components/Loader';
import { UFMSLogo } from './components/Icons';
import { analyzeTranscript } from './services/geminiService';
import { formatResultForDownload } from './utils/reportFormatter';
import type { AnalysisResult } from './types';

const App: React.FC = () => {
  const [transcriptFile, setTranscriptFile] = useState<File | null>(null);
  const [syllabiFile, setSyllabiFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showStudyPlan, setShowStudyPlan] = useState<boolean>(false);

  const handleAnalyze = useCallback(async () => {
    if (!transcriptFile) {
      setError('Por favor, anexe o seu histórico escolar.');
      return;
    }
    if (!syllabiFile) {
        setError('Por favor, anexe o arquivo com as ementas das disciplinas.');
        return;
    }

    setError(null);
    setIsLoading(true);
    setAnalysisResult(null);
    setShowStudyPlan(false);

    try {
      const result = await analyzeTranscript(transcriptFile, syllabiFile);
      setAnalysisResult(result);
    } catch (err) {
      console.error(err);
      setError('Ocorreu um erro ao analisar seus documentos. Verifique se os arquivos são PDFs válidos e tente novamente.');
    } finally {
      setIsLoading(false);
    }
  }, [transcriptFile, syllabiFile]);
  
  const handleDownloadReport = useCallback(() => {
    if (!analysisResult) return;

    const reportContent = formatResultForDownload(analysisResult);
    const blob = new Blob([reportContent], { type: 'application/vnd.ms-excel' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'relatorio_analise_curricular_ufms.xls';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [analysisResult]);


  return (
    <div className="min-h-screen bg-gray-100 font-sans text-gray-800">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <UFMSLogo className="h-12 w-12 text-blue-800" />
            <div>
              <h1 className="text-xl font-bold text-blue-800">Ajudante da Coordenação 1.3</h1>
              <p className="text-sm text-gray-500">Engenharia de Produção - UFMS</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="bg-blue-50 border-l-4 border-blue-500 text-blue-800 p-4 rounded-r-lg mb-8 shadow-sm">
          <p className="font-bold">Olá! Bem-vindo(a) ao assistente de análise curricular.</p>
          <p className="text-sm mt-1">Para começar, por favor, anexe seu histórico escolar, o edital (opcional) e as ementas das disciplinas cursadas.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <h2 className="text-2xl font-semibold mb-6 text-gray-700 border-b pb-3">Seus Documentos</h2>
            <div className="space-y-6">
              <FileUpload
                label="1. Histórico Escolar Detalhado"
                onFileSelect={setTranscriptFile}
                accept=".pdf"
                required
              />
              <FileUpload
                label="2. Edital da Modalidade (Opcional)"
                onFileSelect={() => {}}
                accept=".pdf"
              />
              <FileUpload
                label="3. Ementas das Disciplinas (obrigatório)"
                onFileSelect={setSyllabiFile}
                accept=".pdf"
                required
              />
              <button
                onClick={handleAnalyze}
                disabled={isLoading}
                className="w-full bg-yellow-400 text-gray-900 font-bold py-3 px-4 rounded-md hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 disabled:bg-gray-400 disabled:text-gray-600 disabled:cursor-not-allowed transition duration-150 ease-in-out flex items-center justify-center"
              >
                {isLoading ? 'Analisando...' : 'Analisar Compatibilidade'}
              </button>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 min-h-[500px]">
            <h2 className="text-2xl font-semibold mb-6 text-gray-700 border-b pb-3">Resultado da Análise</h2>
            {isLoading && <Loader />}
            {error && <div className="text-red-600 bg-red-50 p-4 rounded-md">{error}</div>}
            {analysisResult && (
              <ResultsDisplay 
                result={analysisResult}
                showStudyPlan={showStudyPlan}
                onToggleStudyPlan={() => setShowStudyPlan(!showStudyPlan)}
                onDownload={handleDownloadReport}
               />
            )}
            {!isLoading && !analysisResult && !error && (
              <div className="text-center text-gray-500 pt-16">
                <p>O resultado da sua análise aparecerá aqui.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;