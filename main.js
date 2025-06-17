//Enviando a triagem 
function gerarTriagem(){
    const nome = document.getElementById("nome").value
    const motivo = document.getElementById("motivo").value
    const novoPaciente = {nome,motivo}
    // aqui vai criar um array para o paciene adicionado
    let paciente = JSON.parse(localStorage.getItem("paciente")) || []
    paciente.push(novoPaciente)
    localStorage.setItem("paciente", JSON.stringify(paciente))
    alert("Cadastrado com sucesso")

}

//Mostra oque tem no cadastro(do localStorage) na triagem

const nome = localStorage.getItem("nome")
const motivo = localStorage.getItem("motivo")
document.getElementById("nomeExibido").textContent = nome ?? "Paciente não colocado"
document.getElementById("SintomaExibido").textContent = motivo ?? "Sintomas não colocado"



//campo de triagem

function enviarTriagem(){
    const paciente = {
        temperatura: document.getElementById("temperatura").value,
        pressao: document.getElementById("pressao").value,
        observacao: document.getElementById("observacao").value,
        glicemia: document.getElementById("glicemia").value, 

        riscos: document.getElementById("risco").value,
    }

    //armazenado dados
    localStorage.setItem("dadosTriagem",JSON.stringify(paciente));
    alert("dados enviados para o médico")
}
