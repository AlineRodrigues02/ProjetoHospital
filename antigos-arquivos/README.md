# 🏥 Sistema de Atendimento Hospitalar

Sistema web simples de atendimento hospitalar, desenvolvido com **HTML, CSS e JavaScript puro**, com armazenamento local usando `LocalStorage`.
## 🚀 Funcionalidades
🔹 **Cadastro de Paciente (Atendente)**  
- Registra o nome e o motivo da consulta.
🔹 **Triagem (Atendente ou Enfermeiro)**  
- Registra sinais vitais (temperatura, pressão, glicemia), observações, classificação de risco (🟢🟡🔴) e horário da triagem.
🔹 **Tela do Médico (Médico)**  
- Lista os pacientes triados por ordem de prioridade (vermelho → amarelo → verde).
- Exibe o horário da triagem.
- Permite clicar em "Atender" para remover o paciente da fila.

🔹 **Painel TV (Público/Acompanhante)**  
- Exibe os pacientes com status visual:  
  - 🟡 Em triagem  
  - 🔵 Em espera  
  - 🔴 Em atendimento  
