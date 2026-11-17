# 🎓 Assistente Automatizado de Análise de Histórico Acadêmico e Avaliação Administrativa (UFMS)

[![Aplicação](https://img.shields.io/badge/Acessar-Testar%20Assistente-F59E0B?style=for-the-badge)](https://ajudante-da-coordena-o-ufms.ai.studio)
[![Extensão UFMS](https://img.shields.io/badge/Projeto%20de%20Extens%C3%A3o-SEDESI%20%2F%20AGINOVA-0B1120?style=for-the-badge)](https://ajudante-da-coordena-o-ufms.ai.studio)

> Solução desenvolvida no âmbito do projeto de extensão **Automação de Rotinas (SEDESI / AGINOVA — UFMS)**, voltada à modernização e agilidade na triagem documental e análise curricular.

---

## 🎯 Problema (Gargalo)
A conferência manual de históricos escolares, integralização de carga horária, pré-requisitos e equivalências administrativas demandava elevado tempo operacional da equipe técnica e de coordenação, gerando:
* Fila de espera em períodos de matrícula e ajustes acadêmicos;
* Risco de retrabalho na conferência manual de múltiplas disciplinas;
* Falta de padronização na geração de pareceres preliminares.

---

## 💡 Arquitetura & Solução
Estruturação de um **assistente inteligente** baseado em modelos **Gemini** e ecossistema **Google Cloud**, projetado para ler documentos acadêmicos, extrair métricas curriculares e apoiar a tomada de decisão administrativa com rastreabilidade.

🔗 **Acesse o assistente:** [ajudante-da-coordena-o-ufms.ai.studio](https://ajudante-da-coordena-o-ufms.ai.studio)

---

## 🧠 Engenharia de Prompt & Boas Práticas (AI Builder)
O sistema foi arquitetado para operar em ambiente institucional crítico, onde a precisão normativa é obrigatória:
* **Chain-of-Thought (Cadeia de Pensamento):** O modelo é instruído a executar a auditoria em etapas sequenciais (1. Leitura de disciplinas cursadas $\rightarrow$ 2. Cálculo de carga horária $\rightarrow$ 3. Checagem de pré-requisitos $\rightarrow$ 4. Síntese do parecer) antes de concluir qualquer análise.
* **Grounding Estrito (Aterramento):** Ancoragem exclusiva nos documentos fornecidos e nas regras curriculares da instituição.
* **Guardrails Anti-Alucinação:** Regras negativas explícitas que impedem o modelo de inferir ou inventar equivalências de disciplinas não comprovadas no documento, sinalizando pendências para revisão humana.
* **Few-Shot Prompting:** Calibração com exemplos reais de históricos e pareceres administrativos para manter o tom institucional e a precisão técnica.

---

## 🛠️ Tecnologias & Competências
* **IA & Cloud:** Google AI Studio, Gemini, Google Cloud, Prompt Engineering
* **Processos:** Mapeamento de Fluxo Administrativo, Padronização Documental, Melhoria Contínua

---

## 👩‍💻 Autoria
**Maria Clara Maranhão Franco** — Estudante de Engenharia de Produção (UFMS) | Lean Six Sigma Green Belt  
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Conectar-0A66C2?style=flat-square&logo=linkedin)](https://www.linkedin.com/in/maria-clara-m-franco-0b76a8332)
