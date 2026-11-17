import type { AnalysisResult } from '../types';

export const formatResultForDownload = (result: AnalysisResult): string => {
  const styles = `
    <style>
      body { font-family: Arial, sans-serif; }
      h1, h2, h3 { color: #333; }
      table { border-collapse: collapse; width: 100%; margin-bottom: 20px; }
      th, td { border: 1px solid #dddddd; padding: 8px; text-align: left; }
      th { background-color: #f2f2f2; font-weight: bold; }
      .summary { background-color: #eef2f7; padding: 15px; border-left: 4px solid #4a90e2; margin-bottom: 20px; }
      .footer { font-size: 0.8em; color: #777; margin-top: 30px; }
    </style>
  `;

  let xlsContent = `
    <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
    <head>
      <meta charset="UTF-8">
      ${styles}
    </head>
    <body>
  `;

  xlsContent += `
    <h1>RELATÓRIO DE ANÁLISE DE COMPATIBILIDADE CURRICULAR</h1>
    <p>Engenharia de Produção - UFMS</p>
    
    <h2>RESUMO DA ANÁLISE</h2>
    <div class="summary">${result.summary}</div>

    <h2>INDICADORES PRINCIPAIS</h2>
    <table>
      <tr><th>Indicador</th><th>Valor</th></tr>
      <tr><td>Disciplinas Aproveitadas</td><td>${result.approvedCourses.length}</td></tr>
      <tr><td>Disciplinas Obrigatórias Restantes</td><td>${result.remainingMandatoryCourses.length}</td></tr>
      <tr><td>Semestres Estimados</td><td>${result.estimatedSemesters}</td></tr>
      <tr><td>Horas Optativas Aproveitadas</td><td>${result.approvedElectiveHours} de ${result.requiredElectiveHours} horas</td></tr>
    </table>
  `;

  xlsContent += `
    <h2>DISCIPLINAS APROVEITADAS</h2>
    <table>
      <thead>
        <tr>
          <th>Disciplina de Origem</th>
          <th>Disciplina UFMS</th>
          <th>Código UFMS</th>
          <th>Compatibilidade (%)</th>
        </tr>
      </thead>
      <tbody>
  `;
  if (result.approvedCourses.length > 0) {
    result.approvedCourses.forEach(item => {
      xlsContent += `
        <tr>
          <td>${item.originCourse}</td>
          <td>${item.ufmsCourse.name}</td>
          <td>${item.ufmsCourse.code}</td>
          <td>${item.compatibility}</td>
        </tr>
      `;
    });
  } else {
    xlsContent += `<tr><td colspan="4">Nenhuma disciplina obrigatória foi aproveitada.</td></tr>`;
  }
  xlsContent += `</tbody></table>`;

  xlsContent += `
    <h2>DISCIPLINAS OBRIGATÓRIAS RESTANTES</h2>
    <table>
      <thead>
        <tr>
          <th>Código UFMS</th>
          <th>Nome da Disciplina</th>
          <th>Semestre Sugerido</th>
        </tr>
      </thead>
      <tbody>
  `;
  if (result.remainingMandatoryCourses.length > 0) {
    result.remainingMandatoryCourses.forEach(item => {
      xlsContent += `
        <tr>
          <td>${item.code}</td>
          <td>${item.name}</td>
          <td>${item.semester}º</td>
        </tr>
      `;
    });
  } else {
    xlsContent += `<tr><td colspan="3">Parabéns! Nenhuma disciplina obrigatória restante.</td></tr>`;
  }
  xlsContent += `</tbody></table>`;

  if (result.studyPlan && result.studyPlan.length > 0) {
    xlsContent += `<h2>SUGESTÃO DE PLANO DE ESTUDOS</h2>`;
    result.studyPlan.forEach(semesterPlan => {
      xlsContent += `
        <h3>${semesterPlan.semester}º Semestre Sugerido</h3>
        <table>
          <thead>
            <tr><th>Código</th><th>Disciplina</th></tr>
          </thead>
          <tbody>
      `;
      semesterPlan.courses.forEach(course => {
        xlsContent += `
          <tr>
            <td>${course.code}</td>
            <td>${course.name}</td>
          </tr>
        `;
      });
      xlsContent += `</tbody></table>`;
    });
  }

  xlsContent += `
    <div class="footer">
      <p>Relatório gerado pelo Ajudante da Coordenação 1.3 em ${new Date().toLocaleDateString('pt-BR')}</p>
      <p>Atenção: Esta análise é uma estimativa e não substitui a validação oficial pela coordenação do curso.</p>
    </div>
  `;

  xlsContent += `</body></html>`;
  return xlsContent;
};
