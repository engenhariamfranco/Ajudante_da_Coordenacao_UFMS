import React from 'react';
import type { AnalysisResult } from '../types';
import { CheckCircleIcon, ClockIcon, BookOpenIcon, ChevronDownIcon, ChevronUpIcon, DownloadIcon } from './Icons';

interface ResultsDisplayProps {
  result: AnalysisResult;
  showStudyPlan: boolean;
  onToggleStudyPlan: () => void;
  onDownload: () => void;
}

export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ result, showStudyPlan, onToggleStudyPlan, onDownload }) => {
  
  const studyPlan = result.studyPlan || [];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">Resumo da Análise</h3>
          <p className="text-sm text-gray-600 mt-2 p-4 bg-gray-50 rounded-md border">{result.summary}</p>
        </div>
        <button
          onClick={onDownload}
          className="ml-4 flex items-center text-sm bg-gray-200 text-gray-800 font-semibold py-2 px-3 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 transition duration-150 ease-in-out"
        >
          <DownloadIcon className="h-4 w-4 mr-2" />
          Baixar Relatório
        </button>
      </div>


      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
        <div className="bg-green-50 p-4 rounded-lg">
          <CheckCircleIcon className="h-8 w-8 text-green-500 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-900">{result.approvedCourses.length}</p>
          <p className="text-sm font-medium text-gray-600">Disciplinas Aproveitadas</p>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg">
          <BookOpenIcon className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-900">{result.remainingMandatoryCourses.length}</p>
          <p className="text-sm font-medium text-gray-600">Disciplinas a Cursar</p>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg">
          <ClockIcon className="h-8 w-8 text-blue-500 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-900">{result.estimatedSemesters}</p>
          <p className="text-sm font-medium text-gray-600">Semestres Estimados</p>
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Disciplinas Aproveitadas</h3>
        <div className="overflow-x-auto max-h-60">
          <table className="min-w-full bg-white border">
            <thead className="bg-gray-100 sticky top-0">
              <tr>
                <th className="text-left py-2 px-3 text-sm font-semibold text-gray-600">Disciplina de Origem</th>
                <th className="text-left py-2 px-3 text-sm font-semibold text-gray-600">Disciplina UFMS (Código)</th>
                <th className="text-left py-2 px-3 text-sm font-semibold text-gray-600">Compatibilidade</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {result.approvedCourses.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="py-2 px-3 text-sm">{item.originCourse}</td>
                  <td className="py-2 px-3 text-sm">{item.ufmsCourse.name} ({item.ufmsCourse.code})</td>
                  <td className="py-2 px-3 text-sm">
                    <div className="flex items-center">
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${item.compatibility}%` }}></div>
                      </div>
                      <span className="ml-3 font-medium">{item.compatibility}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
       <div>
            <h3 className="text-lg font-semibold text-gray-800">Carga Horária Optativa</h3>
            <p className="text-sm text-gray-600">Você aproveitou <span className="font-bold">{result.approvedElectiveHours}</span> de <span className="font-bold">{result.requiredElectiveHours}</span> horas necessárias.</p>
       </div>
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Disciplinas Restantes</h3>
         <div className="overflow-x-auto max-h-60">
          <table className="min-w-full bg-white border">
            <thead className="bg-gray-100 sticky top-0">
              <tr>
                <th className="text-left py-2 px-3 text-sm font-semibold text-gray-600">Código UFMS</th>
                <th className="text-left py-2 px-3 text-sm font-semibold text-gray-600">Nome da Disciplina</th>
                <th className="text-left py-2 px-3 text-sm font-semibold text-gray-600">Semestre Sugerido</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {result.remainingMandatoryCourses.map((item) => (
                <tr key={item.code} className="hover:bg-gray-50">
                  <td className="py-2 px-3 text-sm font-mono">{item.code}</td>
                  <td className="py-2 px-3 text-sm">{item.name}</td>
                  <td className="py-2 px-3 text-sm">{item.semester}º</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

       {studyPlan.length > 0 && (
        <div>
          <button onClick={onToggleStudyPlan} className="w-full text-left font-semibold text-lg text-gray-800 py-2 flex justify-between items-center">
            <span>Sugestão de Plano de Estudos</span>
            {showStudyPlan ? <ChevronUpIcon className="h-5 w-5"/> : <ChevronDownIcon className="h-5 w-5"/>}
          </button>
          {showStudyPlan && (
            <div className="mt-2 space-y-4 animate-fade-in-down">
              {studyPlan.map(semesterPlan => (
                <div key={semesterPlan.semester} className="p-4 border rounded-lg bg-gray-50">
                   <h4 className="font-bold text-md text-gray-800">{semesterPlan.semester}º Semestre Sugerido</h4>
                   <ul className="mt-2 list-disc list-inside text-sm text-gray-700 space-y-1">
                     {semesterPlan.courses.map(course => (
                       <li key={course.code}>
                         <span className="font-mono text-xs bg-gray-200 px-1 rounded">{course.code}</span> - {course.name}
                       </li>
                     ))}
                   </ul>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};