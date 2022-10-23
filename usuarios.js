class Usuario {
    constructor() {}
    cadastrarUsuario(nome,cpf,email) {
        let busca = this.nomeFormatado(nome)
        let usuario = {
            nome: nome,
            cpf: cpf,
            email: email,   
            busca: busca
        }

        return usuario;
    }

    nomeFormatado(nome) {
        let nomeBusca = nome.split(" ").join("");
        nomeBusca = nomeBusca.toLowerCase();
        nomeBusca = nomeBusca.normalize('NFD').replace(/([\u0300-\u036f]|[^0-9a-zA-Z\s])/g, '');
        return nomeBusca
    }
    
    validarCampos(nome,cpf,email) {
        if(nome != "" && cpf != "" && email != "") {
            return true;
        } else {
            return false;
        }
    }
}

class LocalDb {
    constructor() {}

    registrar(userDb) {
        localStorage.setItem(userDb.cpf, JSON.stringify(userDb));
    }

    atulizar(chave,nome,email) {
        let busca = this.nomeFormatado(nome)
        if(nome != "") {
            let usuario = {
                nome: nome,
                cpf: chave,
                email: email,
                busca: busca
            }
            localStorage.setItem(chave, JSON.stringify(usuario));
        }
    }

    nomeFormatado(nome) {
        let nomeBusca = nome.split(" ").join("");
        nomeBusca = nomeBusca.toLowerCase();
        nomeBusca = nomeBusca.normalize('NFD').replace(/([\u0300-\u036f]|[^0-9a-zA-Z\s])/g, '');
        return nomeBusca
    }
    
    pesquisar(pesquisa) {
        let registros = Array()
        let busca = this.nomeFormatado(pesquisa)
        for(let i = 0; i < localStorage.length; i++) {
            let key = localStorage.key(i);
            let usuario = JSON.parse(localStorage.getItem(key));
            registros.push(usuario);
        }
        return registros.filter(function(i) { return i.busca == busca})
    }

    deletar(id) {
        localStorage.removeItem(id);
    }
}


// MOSTRANDO O VALOR DA TABELA QUANDO A PÁGINA É CARREGADA
window.addEventListener('load', load);

function load() {
    // SETANDO ATRIBUTOS PRINCIPAIS
    document.getElementById('btn-cancelar-cadastro').setAttribute("onclick","limparCampos('cadastro')");
    document.getElementById('btn-cadastrar').setAttribute("onclick","cadastrar()");
    document.getElementById('btn-cancelar-atualizar').setAttribute("onclick","limparCampos('atualizar')");
    document.getElementById('btn-atualizar').setAttribute("onclick", `setAtualizar()`);
    document.getElementById("field-pesquisar").addEventListener("keyup", pesquisar)
    
    
    mostrarTabela('null');
}

// CRIAÇÃO DOS OBJETOS
let usuario = new Usuario();
let localDb = new LocalDb();

function mostrarTabela(valor,usuarioFiltrado){
    let tr = "";
    if(valor != 'pesquisa') {
        for(let i = 0; i < localStorage.length; i++) {
            let key = localStorage.key(i);
            let usuario = JSON.parse(localStorage.getItem(key));
            tr += `<tr onclick="atualizar(${key})">`;
            tr += `<td>${i+1}</td>`;
            tr += `<td>${usuario.nome}</td>`;
            tr += `<td>${usuario.cpf}</td>`;
            tr += `<td>${usuario.email}</td>`;
            tr += `</tr>`;
        }
    } else {
        let usuario = localDb.pesquisar(usuarioFiltrado);
        if(usuario != "") {
            for(let i = 0; i < usuario.length; i++) {
                tr += `<tr onclick="atualizar(${usuario[i].cpf})">`;
                tr += `<td>${i}</td>`;
                tr += `<td>${usuario[i].nome}</td>`;
                tr += `<td>${usuario[i].cpf}</td>`;
                tr += `<td>${usuario[i].email}</td>`;
                tr += `</tr>`;
            }
        } else {
            tr += `<tr>`;
            tr += `<td colspan="4">Não a nenhum usuário cadastrado com <strong>"${usuarioFiltrado}"</strong></td>`;
            tr += `</tr>`;
        }
    }
    document.getElementById('table').innerHTML = tr;
}


// FUNÇÔES DE DECISÕES
function cadastrar() {
    let cadastro = getCamposCadastro()
    if(usuario.validarCampos(cadastro.fieldNome, cadastro.fieldCPF, cadastro.fieldEmail) == true) {
        let userDb = usuario.cadastrarUsuario(cadastro.fieldNome, cadastro.fieldCPF, cadastro.fieldEmail)
        localDb.registrar(userDb);
        mostrarTabela()
        limparCampos('cadastro');
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





function atualizar(chave) {
    console.log(chave)
    document.getElementById('btn-cancelar-atualizar').setAttribute("onclick", `cancelar(${chave})`);
    document.getElementById('btn-deletar-atualizar').setAttribute("onclick", `deletar(${chave})`);
    document.getElementById('btn-atualizar').setAttribute("onclick", `setAtualizar(${chave})`);
    
    limparCampos('atualizar')

    let usuario = JSON.parse(localStorage.getItem(chave));
    
    document.getElementById('painel-usuario').innerHTML = ``;
    document.getElementById('painel-usuario').innerHTML += `Nome de usuario: <strong>${usuario.nome}</strong><br>`;
    document.getElementById('painel-usuario').innerHTML += `CPF: <strong>${usuario.cpf}</strong><br>`;
    document.getElementById('painel-usuario').innerHTML += `Email: <strong>${usuario.email}</strong><br><br>`;
}

function setAtualizar(chave) {
    let atualizar = getCamposAtualizacao()
    let usuarioS = JSON.parse(localStorage.getItem(chave));
    
    if(atualizar.fieldNome != "" && atualizar.fieldEmail != "") {
        localDb.atulizar(chave, atualizar.fieldNome, atualizar.fieldEmail);
        cancelar();
    }   
    else if(atualizar.fieldNome != "" && atualizar.fieldEmail == "") {
        localDb.atulizar(chave, atualizar.fieldNome, usuarioS.email);
        cancelar();
    }
    else if(atualizar.fieldEmail != "" && atualizar.fieldNome == "") {
        localDb.atulizar(chave, usuarioS.nome, atualizar.fieldEmail);
        cancelar();
    }
    if(atualizar.fieldNome == "" && atualizar.fieldEmail == "") {
        document.getElementById('alert-atualizar').innerHTML = 'Preencha um campo';
    }
    if(chave == null) {
        document.getElementById('alert-atualizar').innerHTML = 'Escolha um item da tabela';
    }
    mostrarTabela('null')
}


function pesquisar() {
    if(document.getElementById("field-pesquisar").value != "") {
        mostrarTabela('pesquisa',document.getElementById("field-pesquisar").value);
    } else {
        mostrarTabela('null')
    }
}

function deletar(chave) {
    
    if(chave != "") {
        localDb.deletar(chave);
        limparCampos('atualizar')
        mostrarTabela('null')
        cancelar(chave);
    } else {
        document.getElementById('alert-atualizar').innerHTML = 'Escolha um item da tabela';
    }
}

function cancelar(chave) {
    document.getElementById('btn-atualizar').removeAttribute("onclick", `setAtualizar(${chave})`);
    document.getElementById('btn-deletar-atualizar').removeAttribute("onclick", `deletar(${chave})`);
    
    document.getElementById('painel-usuario').innerHTML = "";
    document.getElementById('alert-atualizar').innerHTML = "";
    
    limparCampos('atualizar');
}


// FUNÇÕES DE CAMPOS
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
