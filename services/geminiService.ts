import { GoogleGenAI, Type } from "@google/genai";
import type { AnalysisResult } from '../types';
import { curriculum } from '../constants/curriculum';

const fileToGenerativePart = async (file: File) => {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
    reader.readAsDataURL(file);
  });
  return {
    inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
  };
};

const createStudyPlan = (remainingCourses: AnalysisResult['remainingMandatoryCourses']): AnalysisResult['studyPlan'] => {
    const plan: { [semester: number]: AnalysisResult['remainingMandatoryCourses'] } = {};
    remainingCourses.forEach(course => {
        if (!plan[course.semester]) {
            plan[course.semester] = [];
        }
        plan[course.semester].push(course);
    });
    
    return Object.keys(plan)
        .map(Number)
        .sort((a, b) => a - b)
        .map(semester => ({
            semester,
            courses: plan[semester]
        }));
};

export const analyzeTranscript = async (
  transcriptFile: File,
  syllabiFile: File
): Promise<AnalysisResult> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const model = "gemini-2.5-flash";

  const transcriptPart = await fileToGenerativePart(transcriptFile);
  const syllabiPart = await fileToGenerativePart(syllabiFile);
  
  const prompt = `
    Você é o 'Ajudante da Coordenação 1.3', um especialista em análise de históricos acadêmicos para o curso de Engenharia de Produção na UFMS. Sua função é analisar os dois arquivos PDF fornecidos: o primeiro é o histórico escolar do candidato e o segundo contém as ementas das disciplinas cursadas.

    REGRAS DE ANÁLISE:
    1.  **Compatibilidade de Conteúdo:** A prioridade é a compatibilidade de conteúdo entre as ementas fornecidas e as disciplinas do currículo da UFMS. A carga horária é secundária.
    2.  **Combinação:** É possível combinar múltiplas disciplinas de origem para validar uma única disciplina da UFMS se os conteúdos somados forem equivalentes.
    3.  **Não Aproveitáveis:** TCC, estágio e atividades complementares não podem ser aproveitados.
    4.  **Regra Específica:** A disciplina 'Introdução à Engenharia de Produção' só pode ser aproveitada por uma disciplina com nome e conteúdo muito similar. Seja rigoroso nesta análise.
    5.  **Optativas:** Disciplinas cursadas que não têm equivalência direta podem ser contadas como horas de disciplinas optativas. O currículo da UFMS exige 136 horas de optativas. Calcule o total de horas de disciplinas de origem não aproveitadas como obrigatórias e retorne esse valor.
    6.  **Estimativa de Semestres:** Calcule o número de semestres restantes com base no semestre mais avançado entre as disciplinas que o aluno ainda precisa cursar.

    INSTRUÇÕES DE SAÍDA:
    - Retorne **exclusivamente** um objeto JSON válido, sem nenhum texto ou formatação adicional.
    - O JSON deve seguir a estrutura definida no schema abaixo.
    - No campo 'summary', escreva um parágrafo conciso resumindo a análise, como se estivesse falando com o aluno.
    - No campo 'compatibility', forneça um valor numérico de 0 a 100.

    CURRÍCULO DA UFMS (Engenharia de Produção):
    ${JSON.stringify(curriculum)}
    `;

    const responseSchema = {
        type: Type.OBJECT,
        properties: {
            summary: { type: Type.STRING, description: "Um resumo textual da análise para o aluno." },
            approvedCourses: {
                type: Type.ARRAY,
                description: "Lista de disciplinas da origem que foram aproveitadas.",
                items: {
                    type: Type.OBJECT,
                    properties: {
                        originCourse: { type: Type.STRING, description: "Nome da disciplina cursada na instituição de origem." },
                        ufmsCourse: { 
                            type: Type.OBJECT,
                            properties: {
                                code: { type: Type.STRING },
                                name: { type: Type.STRING }
                            }
                         },
                        compatibility: { type: Type.NUMBER, description: "Percentual de compatibilidade (0-100)." }
                    }
                }
            },
            remainingMandatoryCourses: {
                type: Type.ARRAY,
                description: "Lista de disciplinas obrigatórias que o aluno ainda precisa cursar.",
                items: {
                    type: Type.OBJECT,
                    properties: {
                        code: { type: Type.STRING },
                        name: { type: Type.STRING },
                        semester: { type: Type.NUMBER },
                    }
                }
            },
            approvedElectiveHours: { type: Type.NUMBER, description: "Total de horas de disciplinas de origem que podem ser aproveitadas como optativas." },
            requiredElectiveHours: { type: Type.NUMBER, description: "Total de horas optativas exigidas pelo curso.", default: 136 },
            estimatedSemesters: { type: Type.NUMBER, description: "Estimativa de semestres restantes para a conclusão." }
        }
    };
    
    const response = await ai.models.generateContent({
        model: model,
        contents: { parts: [transcriptPart, syllabiPart, { text: prompt }] },
        config: {
            responseMimeType: 'application/json',
            responseSchema: responseSchema
        }
    });

    try {
        const jsonText = response.text.trim();
        const result: AnalysisResult = JSON.parse(jsonText);
        
        // Post-processing
        result.studyPlan = createStudyPlan(result.remainingMandatoryCourses);
        result.requiredElectiveHours = 136;
        if(result.approvedElectiveHours > 136) {
            result.approvedElectiveHours = 136;
        }

        return result;
    } catch (e) {
        console.error("Failed to parse Gemini response:", response.text);
        throw new Error("A resposta da IA não estava no formato JSON esperado.");
    }
};
