// CLASSE USUÁRIO
class Usuario {
    // MÉTODO CONSTRUTOR
    constructor() {
    }
    
    // MÉTODO PARA CADASTRAR USUÁRIOS
    cadastrarUsuario(nome,cpf,email) {
        let usuario = {
            nome: nome,
            cpf: cpf,
            email: email   
        }

        return usuario;
    }
    
    validarCampos(nome,cpf,email) {
        if(nome != "" && cpf != "" && email != "") {
            return true;
        } else {
            return false;
        }
    }
    
    
}

// CLASSE LOCAL STORAGE
class LocalDb {
    constructor() {
        
    }
    
    registrar(userDb) {
        let id = localStorage.length;
        id++;
        localStorage.setItem(id, JSON.stringify(userDb));
    }
    

    atulizar(id,nome,cpf,email) {
        if(nome != "") {
            let usuario = {
                nome: nome,
                cpf: cpf,
                email: email
            }
            
            localStorage.setItem(id, JSON.stringify(usuario));
        }
    }

    deletar(id) {
        localStorage.removeItem(id);
    }
}


// MOSTRANDO O VALOR DA TABELA QUANDO A PÁGINA É CARREGADA
window.addEventListener('load', mostrarTabela);


// SETANDO ATRIBUTOS AOS BOTÕES PRINCIPAIS
document.getElementById('btn-cancelar-cadastro').setAttribute("onclick","limparCampos('cadastro')");
document.getElementById('btn-cadastrar').setAttribute("onclick","cadastrar()");

document.getElementById('btn-cancelar-atualizar').setAttribute("onclick","limparCampos('atualizar')");
document.getElementById('btn-atualizar').setAttribute("onclick", `setAtualizar()`);

// CRIAÇÃO DOS OBJETOS
let usuario = new Usuario();
let localDb = new LocalDb();

function cadastrar() {

    let cadastro = getCamposCadastro()

    
    if(usuario.validarCampos(cadastro.fieldNome, cadastro.fieldCPF, cadastro.fieldEmail) == true) {
        
        let userDb = usuario.cadastrarUsuario(cadastro.fieldNome, cadastro.fieldCPF, cadastro.fieldEmail)
        localDb.registrar(userDb);
        
        limparCampos();
        location.reload();

    } else {
        if(cadastro.fieldNome == "") {
            document.getElementById('alert-cadastro').innerHTML = `Prencha o seu nome`;
        }
        else if(cadastro.fieldCPF == ""){
            document.getElementById('alert-cadastro').innerHTML = `Prencha o seu CPF`;
        }   
        else if(cadastro.fieldEmail == ""){
            document.getElementById('alert-cadastro').innerHTML = `Prencha o seu email`;
        } 
    }
}



function getCamposCadastro() {
    let cadastro = {
        fieldNome: document.getElementById('field-nome-cadastro').value,
        fieldCPF: document.getElementById('field-cpf-cadastro').value,
        fieldEmail: document.getElementById('field-email-cadastro').value
    }
    
    return cadastro;
}

function getCamposAtualizacao() {
    let atualizacao = {
        fieldNome: document.getElementById('field-nome-atualizar').value,
        fieldEmail: document.getElementById('field-email-atualizar').value
    }

    return atualizacao;
}

function limparCampos(secao) {
    if(secao == 'cadastro') {
        document.getElementById('field-nome-cadastro').value = "";
        document.getElementById('field-cpf-cadastro').value = "";
        document.getElementById('field-email-cadastro').value = "";

        document.getElementById('alert-cadastro').innerHTML = "";
    }
    else if(secao = 'atualizar') {
        document.getElementById('field-nome-atualizar').value = "";
        document.getElementById('field-email-atualizar').value = "";

        document.getElementById('painel-usuario').innerHTML = "";
        document.getElementById('alert-atualizar').innerHTML = "";
    }
}



function mostrarTabela(){
    let table = document.getElementById('table');
    let tr = "";
    
    
    for(let i = 1; i <= localStorage.length; i++) {
        let usuario = JSON.parse(localStorage.getItem(i));
        
        tr += `<tr onclick="atualizar(${i})">`;
        tr += `<td>${i}</td>`;
        tr += `<td>${usuario.nome}</td>`;
        tr += `<td>${usuario.cpf}</td>`;
        tr += `<td>${usuario.email}</td>`;
        tr += `</tr>`;
    }
    table.innerHTML += tr;
}

function atualizar(i) {
    document.getElementById('btn-cancelar-atualizar').setAttribute("onclick", `cancelar(${i})`);
    document.getElementById('btn-deletar-atualizar').setAttribute("onclick", `deletar(${i})`);
    document.getElementById('btn-atualizar').setAttribute("onclick", `setAtualizar(${i})`);
    
    document.getElementById('alert-atualizar').innerHTML = "";
    document.getElementById('painel-usuario').innerHTML = "";

    let painelDiv = document.getElementById('painel-usuario');
    let usuario = JSON.parse(localStorage.getItem(i));
    
    painelDiv.innerHTML = ``;
    painelDiv.innerHTML += `Nome de usuario: <strong>${usuario.nome}</strong><br>`;
    painelDiv.innerHTML += `CPF: <strong>${usuario.cpf}</strong><br>`;
    painelDiv.innerHTML += `Email: <strong>${usuario.email}</strong><br><br>`;
}

function setAtualizar(i) {
    let atualizar = getCamposAtualizacao()

    let usuarioS = JSON.parse(localStorage.getItem(i));
    
    if(atualizar.fieldNome != "" && atualizar.fieldEmail != "") {
        localDb.atulizar(i, atualizar.fieldNome, usuarioS.cpf, atualizar.fieldEmail);
        location.reload();
    }
    else if(atualizar.fieldNome != "") {
        localDb.atulizar(i, atualizar.fieldNome, usuarioS.cpf, usuarioS.nome);
        location.reload();
    }
    else if(atualizar.fieldEmail != "") {
        localDb.atulizar(i, usuarioS.nome, usuarioS.cpf, atualizar.fieldEmail);
        location.reload();
    }
    
    if(atualizar.fieldNome == "" && atualizar.fieldEmail == "") {
        document.getElementById('alert-atualizar').innerHTML = 'Preencha um campo';
    }

    console.log(i)
    if(i == null) {
        document.getElementById('alert-atualizar').innerHTML = 'Escolha um item da tabela';
    }
}

function cancelar(i) {
    document.getElementById('btn-atualizar').removeAttribute("onclick", `setAtualizar(${i})`);
    document.getElementById('btn-deletar-atualizar').removeAttribute("onclick", `deletar(${i})`);
    
    document.getElementById('painel-usuario').innerHTML = "";
    document.getElementById('alert-atualizar').innerHTML = "";

    limparCampos(atualizar);
}

function deletar(i) {
    if(i == localStorage.length){
        localDb.deletar(i);
        location.reload();
    } else {
        document.getElementById('alert-atualizar').innerHTML = 'Apague o último item da tabela';
    }
}