// Enviando a triagem
function gerarTriagem() {
  const nome = document.getElementById("nome").value;
  const motivo = document.getElementById("motivo").value;
  const novoPaciente = { nome, motivo, status: "Em Espera" };

  let paciente = JSON.parse(localStorage.getItem("paciente")) || [];
  paciente.push(novoPaciente);
  localStorage.setItem("paciente", JSON.stringify(paciente));

  alert("Cadastrado com sucesso");
  document.getElementById("nome") = ""
  document.getElementById("motivo") = ""
}

document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("dadosPaciente")) {
    let paciente = JSON.parse(localStorage.getItem("paciente")) || [];

    const proximo = paciente.find((p) => p.status === "Em Espera");

    if (proximo) {
      document.getElementById("dadosPaciente").innerHTML = `
          <p><strong>Nome:</strong> ${proximo.nome}</p>
          <p><strong>Motivo:</strong> ${proximo.motivo}</p>
        `;
    } else {
      document.getElementById("dadosPaciente").innerHTML =
        "<p>Nenhum paciente aguardando triagem.</p>";
    }
  }
});

// Campo de triagem
function enviarTriagem() {
  const temperatura = document.getElementById("temperatura").value;
  const pressao = document.getElementById("pressao").value;
  const observacao = document.getElementById("observacao").value;
  const glicemia = document.getElementById("glicemia").value;
  const risco = document.getElementById("risco").value;
  const horario = new Date().toLocaleTimeString();

  let paciente = JSON.parse(localStorage.getItem("paciente")) || [];

  const proximoIndex = paciente.findIndex((p) => p.status === "Em Espera");
  if (proximoIndex === -1) return alert("Nenhum paciente aguardando triagem.");

  paciente[proximoIndex].status = "Em triagem";
  paciente[proximoIndex].triagem = {
    temperatura,
    pressao,
    observacao,
    glicemia,
    risco,
    horario,
  };
  localStorage.setItem("paciente", JSON.stringify(paciente));

  alert("Triagem enviada, próximo paciente");

  // Limpar os campos
  document.getElementById("temperatura").value = "";
  document.getElementById("pressao").value = "";
  document.getElementById("observacao").value = "";
  document.getElementById("glicemia").value = "";
  document.getElementById("risco").value = "";

  location.reload();
  paciente[proximoIndex].status = "Aguardando atendimento";
}

// Parte da tela do médico
document.addEventListener("DOMContentLoaded", () => {
  const filaEl = document.getElementById("filaPacientes");
  if (!filaEl) return;

  let paciente = JSON.parse(localStorage.getItem("paciente")) || [];

  const comTriagem = paciente.filter(
    (p) => p.triagem && p.status !== "Em atendimento"
  );

  if (comTriagem.length === 0) {
    filaEl.innerHTML = "<p>Nenhum paciente aguardando atendimento</p>";
    return;
  }

  const prioridade = {
    vermelho: 1,
    amarelo: 2,
    verde: 3,
  };

  comTriagem.sort((a, b) => {
    return prioridade[a.triagem.risco] - prioridade[b.triagem.risco];
  });

  comTriagem.forEach((paciente, index) => {
    const cor = paciente.triagem.risco || paciente.triagem.risco;
    const horario = paciente.triagem.horario || "Horário não registrado";

    const corDeRisco =
      {
        verde: "🟢",
        amarelo: "🟡",
        vermelho: "🔴",
      }[cor.toLowerCase()] || "⚪";

    const div = document.createElement("div");
    div.classList.add("paciente");
    div.innerHTML = `
        <strong>Paciente:</strong> ${paciente.nome} <br>
        <strong>Risco:</strong> ${corDeRisco} ${cor} <br>
        <strong>Triagem às:</strong> ${horario} <br>
        <button onclick="atenderPaciente(${index})">Atender</button>
        <hr>`;

    filaEl.appendChild(div);
  });
});

function atenderPaciente(index) {
  let paciente = JSON.parse(localStorage.getItem("paciente")) || [];
  const comTriagem = paciente.filter(
    (p) => p.triagem && p.status !== "Em atendimento"
  );

  const atendido = comTriagem[index];

  const indexOriginal = paciente.findIndex(
    (p) =>
      p.nome === atendido.nome &&
      p.triagem?.horario === atendido.triagem?.horario
  );

  if (indexOriginal !== -1) {
    paciente[indexOriginal].status = "Em atendimento";
  }

  localStorage.setItem("paciente", JSON.stringify(paciente));

  alert(`Atendendo paciente: ${atendido.nome}`);
  location.reload();
}

document.addEventListener("DOMContentLoaded", () => {
  const filaEspera = document.getElementById("filaDeEspera");
  if (!filaEspera) return;

  let paciente = JSON.parse(localStorage.getItem("paciente")) || [];

  const prioridade = {
    vermelho: 1,
    amarelo: 2,
    verde: 3,
    semTriagem: 4,
  };

  paciente.sort((a, b) => {
    const prioridadeA = a.triagem
      ? prioridade[a.triagem.risco]
      : prioridade.semTriagem;
    const prioridadeB = b.triagem
      ? prioridade[b.triagem.risco]
      : prioridade.semTriagem;
    return prioridadeA - prioridadeB;
  });

  filaEspera.innerHTML = " ";
  paciente.forEach((paciente, index) => {
    const cor = paciente.triagem?.risco || "Sem triagem";
    const horario = paciente.triagem?.horario || "Horario não registrado";
    const status = paciente.status || "Em espera";

    const corDeRisco =
      {
        verde: "🟢",
        amarelo: "🟡",
        vermelho: "🔴",
        "sem triagem": "⚪",
      }[cor.toLowerCase()] || "⚪";

    const div = document.createElement("div");
    div.classList.add("paciente");
    div.innerHTML = `
        <strong>Paciente:</strong> ${paciente.nome} <br>
        <strong>Risco:</strong> ${corDeRisco} ${cor} <br>
        <strong>Triagem às:</strong> ${horario} <br>
        <strong>Status:</strong> ${status}<br>
        <hr>`;
    filaEspera.appendChild(div);
  });
});

localStorage.clear;
    