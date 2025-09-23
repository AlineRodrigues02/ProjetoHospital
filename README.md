# 🏥 Sistema Hospitalar

Sistema desenvolvido para gerenciamento de pacientes em um ambiente hospitalar.  
Inclui **cadastro, triagem, atendimento médico, fila de espera, painel público e exportação de histórico em CSV**.

---

## 🚀 Funcionalidades
- 📌 **Cadastro de Pacientes** – realizado pelo atendente  
- 🩺 **Triagem** – prioridade e tempo de espera atribuídos pelo enfermeiro  
- 👨‍⚕️ **Atendimento Médico** – registro de diagnóstico do paciente  
- 📋 **Fila de Espera** – pacientes organizados por prioridade  
- 📺 **Painel Público (TV)** – exibição da fila para acompanhantes  
- 📂 **Histórico de Atendimentos** – com opção de exportar em **CSV**

---

## 🛠️ Tecnologias

**Backend**
- Node.js + Express  
- Cors  
- CSV-Writer  

**Frontend**
- React  
- Context API  
- React Router DOM  
- TailwindCSS  

---
## 📊 Fluxo de Funcionamento
- Paciente é cadastrado pelo atendente.
- Enfermeiro realiza a triagem.
- Paciente entra na fila de espera.
- Médico atende e insere diagnóstico.
- Atendimento é registrado no histórico.
- Histórico pode ser exportado em CSV.
---
## 📤 Exportação CSV
- O histórico contém:
- Paciente
- Médico responsável
- Tempo de espera (min)
- Diagnóstico
## 👥 Colaboradores
- limasantoss Igor Santos
- soeiroo Pedro Israel
- AlineRodrigues02
