
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
    // window.location.href = "../Triagem de Pacientes/index.html"
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

//parte da tela do médico

document.addEventListener("DOMContentLoaded", () => {
  const filaEl = document.getElementById("filaPacientes")
  if (!filaEl) return

  let paciente = JSON.parse(localStorage.getItem("paciente")) || [];

  //mostrar os pacientes que ja passaram pela triagem

  const comTriagem = paciente.filter(p => p.triagem)

  if(comTriagem.length === 0){
    filaEl.innerHTML = "<p>Nenhum paciente aguardando atendimento</p>"
    return;
  }
  //Organizar a prioridade 
  const prioridade ={
    vermelho:1,
    amarelo: 2,
    verde:3
  }
  //ordenar
  comTriagem.sort((a,b)=>{
    return prioridade[a.triagem.risco] - prioridade[b.triagem.risco]
  })

  //mostrar a Lista
  comTriagem.forEach((paciente,index)=>{
    const cor = paciente.triagem.risco

    const corDeRisco = {
      verde: "🟢",
      amarelo: "🟡",
      vermelho: "🔴"
      
    }[cor.toLowerCase()] || "⚪"

    const div = document.createElement("div")
    div.innerHTML = `
      <strong>Paciente:</strong> ${paciente.nome} <br>
      <strong>Risco:</strong> ${corDeRisco} ${cor} <br>
      <button onclick="atenderPaciente(${index})">Atender</button>
      <hr>`

      filaEl.appendChild(div)
  })
})
  
//remove paciente da fila ao ser atendido

function atenderPaciente(index){
   let paciente = JSON.parse(localStorage.getItem("paciente")) || [];
   const comTriagem = paciente.filter(p => p.triagem)

   const atendido = comTriagem[index]
   alert(`atendendo paciente: ${atendido.nome}`)
   //remover da fila  original

   const novaFila = paciente.filter(p => p !== atendido)
   localStorage.setItem("paciente",JSON.stringify(novaFila))

  //Atualizar a tela
  location.reload();
   }