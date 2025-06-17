
//Enviando a triagem 
function gerarTriagem() {
    const nome = document.getElementById("nome").value
    const motivo = document.getElementById("motivo").value
    const novoPaciente = { nome, motivo }
    // aqui vai criar um array para o paciene adicionado
    let paciente = JSON.parse(localStorage.getItem("paciente")) || []
    paciente.push(novoPaciente)
    localStorage.setItem("paciente", JSON.stringify(paciente))

    alert("Cadastrado com sucesso")
    window.location.href = "../Triagem de Pacientes/index.html"
}

document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("dadosPaciente")) {
    let paciente = JSON.parse(localStorage.getItem("paciente")) || [];
    if (paciente.length === 0) {
      document.getElementById("dadosPaciente").innerHTML = "<p>Nenhum paciente cadastrado.</p>";
      return;
    }

    const ultimo = paciente[paciente.length - 1];

    document.getElementById("dadosPaciente").innerHTML = `
      <p><strong>Nome:</strong> ${ultimo.nome}</p>
      <p><strong>Motivo:</strong> ${ultimo.motivo}</p>
    `;
  }
});


//campo de triagem
function enviarTriagem() {
  const temperatura = document.getElementById("temperatura").value;
  const pressao = document.getElementById("pressao").value;
  const observacao = document.getElementById("observacao").value;
  const glicemia = document.getElementById("glicemia").value;
  const risco = document.getElementById("risco").value;

  let paciente = JSON.parse(localStorage.getItem("paciente")) || [];
  if (paciente.length === 0) return alert("Cadastre o paciente");

  // Corrigido aqui: de 'peciente' para 'paciente'
  paciente[paciente.length - 1].triagem = { temperatura, pressao, observacao, glicemia, risco };
  localStorage.setItem("paciente", JSON.stringify(paciente));

  alert("Dados enviados para o médico");
}
