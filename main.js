// aqui vai criar um array para o paciene adicionado
let paciente = JSON.parse(localStorage.getItem("paciente")) || []
//Enviando a triagem 
function gerarTriagem(){
    const nome = document.getElementById("nome").value
    const motivo = document.getElementById("motivo").value
    const novoPaciente = {nome,motivo}
    paciente.push(novoPaciente)
    localStorage.setItem("paciente", JSON.stringify(paciente))
    alert("Cadastrado com sucesso")

}

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
