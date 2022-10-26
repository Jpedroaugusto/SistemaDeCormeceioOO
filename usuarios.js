class LocalDb {
    storage = localStorage;
    usuarios = Array();

    constructor() {}

    registrar(chaveStorage,usuario) {
        if(this.iniciarDados(chaveStorage,usuario)) {
            this.usuarios = this.retornaDados(chaveStorage);
            this.usuarios.push(usuario);
            this.storage.setItem(chaveStorage, JSON.stringify(this.usuarios));
        }

    }

    atulizar(indice,chave,nome,email,chaveStorage) {
        let objUsuario = {
            nome: nome,
            cpf: chave,
            email: email
        }

        this.usuarios = this.retornaDados(chaveStorage);
        this.usuarios[indice] = objUsuario;
        this.storage.setItem(chaveStorage, JSON.stringify(this.usuarios));
    }
    
    deletar(indice,chaveStorage) {
        this.usuarios = this.retornaDados(chaveStorage);
        this.usuarios.splice(indice, 1);
        this.storage.setItem(chaveStorage, JSON.stringify(this.usuarios));
    }

    iniciarDados(chaveStorage,usuario) {
        if(!this.storage.key(chaveStorage)) {
            this.usuarios.push(usuario);
            this.storage.setItem(chaveStorage, JSON.stringify(this.usuarios));
            return false;
        }
        return true;
    }
    
    retornaDados(chaveStorage) {
        return JSON.parse(this.storage.getItem(chaveStorage));
    }
    
}

class Usuario {
    constructor() {}
    
    usuario(nome,cpf,email) {
        let usuario = {
            nome: nome,
            cpf: cpf,
            email: email 
        }
        return usuario;
    }
}

class Funcoes {
    storage = localStorage;

    registroBusca = Array();
    registrosGerais = Array();
    registrosNomes = Array();
    registrosFiltrados = Array();
    
    constructor() {}

    pesquisar(filtro, chaveStorage) {
        this.registrosGerais = JSON.parse(this.storage.getItem(chaveStorage));
        let busca = this.nomeFormatado(filtro);

        for(let i = 0; i < this.registrosGerais.length; i++) {
            this.registrosNomes.push(this.registrosGerais[i].nome);
            this.registrosGerais[i].nome = this.nomeFormatado(this.registrosNomes[i]);
            this.registrosGerais[i].nome.push(this.registrosNomes[i]);
        }

        for(let i = 0; i < busca.length; i++) {
            this.registrosFiltrados = this.registrosGerais.filter(function(registros) {return registros.nome[i] == busca[i]});
        }
        
        return this.registrosFiltrados;
    }

    nomeFormatado(nome) {
        let nomeBusca = nome.split(" ").join("");
        nomeBusca = nomeBusca.toLowerCase();
        nomeBusca = nomeBusca.normalize('NFD').replace(/([\u0300-\u036f]|[^0-9a-zA-Z\s])/g, '');
        
        this.registroBusca = Array.from(nomeBusca);
        return this.registroBusca;
    }
}





window.addEventListener('load', load);

let objLocalDB = new LocalDb();
let objUsuario = new Usuario();
let objFuncao = new Funcoes();

let chaveStorage = 'usuarios';





// ------- DOCUMENT OBJECT MODEL -------

// DIVISÕES
const tabela = document.getElementById('table');
const painelUsuario = document.getElementById('painel-usuario');

const alertaAtulizacao = document.getElementById('alert-atualizar');
const alertaCadastro = document.getElementById('alert-cadastro');
// CAMPOS
const campoCadastroNome = document.getElementById('field-nome-cadastro');
const campoCadastroCPF = document.getElementById('field-cpf-cadastro');
const campoCadastroEmail = document.getElementById('field-email-cadastro');

const campoAtualizacaoNome = document.getElementById('field-nome-atualizar');
const campoAtualizacaoEmail = document.getElementById('field-email-atualizar');

const campoPesquisa = document.getElementById("field-pesquisar")


// BOTÕES
const botaoCancelarCadastro = document.getElementById('btn-cancelar-cadastro')
const botaoCadastrar = document.getElementById('btn-cadastrar')

const botaoDeletar = document.getElementById('btn-deletar');

const botaoCancelarAtualizacao = document.getElementById('btn-cancelar-atualizar')
const botaoAtualizar = document.getElementById('btn-atualizar')

// ------- DOCUMENT OBJECT MODEL -------






function load() {
    botaoCancelarCadastro.setAttribute("onclick","limparCampos('cadastro')");
    botaoCadastrar.setAttribute("onclick","cadastrar()");
    botaoCancelarAtualizacao.setAttribute("onclick","limparCampos('atualizar')");
    botaoAtualizar.setAttribute("onclick", `setAtualizar()`);

    campoPesquisa.setAttribute("onkeyup", "tabelaFiltrada()");
    tabelaCompleta();
}





function tabelaCompleta(){
    if(!campoPesquisa.value) {
        let tr = ""
        let usuarios = objLocalDB.retornaDados(chaveStorage);
        
        for(let i = 0; i < usuarios.length; i++) {
            tr += `<tr onclick="atualizar(${i})">`;
            tr += `<th>N° ${i < 10 ? '0'+(i+1) : i}</td>`;
            tr += `<td>${usuarios[i].nome}</td>`;
            tr += `<td>${usuarios[i].cpf}</td>`;
            tr += `<td>${usuarios[i].email}</td>`;
            tr += `</tr>`;
        }

        tabela.innerHTML = tr;
    }
}



function tabelaFiltrada(){
    let filtro = campoPesquisa.value;
    if(filtro) {
        let usuarios = objFuncao.pesquisar(filtro,chaveStorage);
        let tr = ""
        for(let i = 0; i < usuarios.length; i++) {
            tr += `<tr onclick="atualizar(${i})">`;
            tr += `<th>N° ${i < 10 ? '0'+(i+1) : i}</td>`;
            tr += `<td>${usuarios[i].nome[usuarios[i].nome.length - 1]}</td>`;
            tr += `<td>${usuarios[i].cpf}</td>`;
            tr += `<td>${usuarios[i].email}</td>`;
            tr += `</tr>`;
        }

        tabela.innerHTML = tr;
    } else {
        tabelaCompleta()
    }
}



function cadastrar() { 
    if( getCamposCadastro() ) {
        objLocalDB.registrar( 'usuarios', getCamposCadastro() )
        location.reload()
    }
}


function atributos(usuarioID) {
    botaoCancelarAtualizacao.setAttribute("onclick", `cancelar(${usuarioID})`);
    botaoAtualizar.setAttribute("onclick", `setAtualizar(${usuarioID})`);
    botaoDeletar.setAttribute("onclick", `deletar(${usuarioID})`);
}



function atualizar(usuarioID) {
    limparCampos( 'atualizar' )
    atributos(usuarioID);
    
    let usuario = objLocalDB.retornaDados(chaveStorage);
    
    painelUsuario.innerHTML = ``;
    painelUsuario.innerHTML += `Nome de usuario: <strong>${usuario[usuarioID].nome}</strong><br>`;
    painelUsuario.innerHTML += `CPF: <strong>${usuario[usuarioID].cpf}</strong><br>`;
    painelUsuario.innerHTML += `Email: <strong>${usuario[usuarioID].email}</strong><br><br>`;
    
    campoAtualizacaoNome.value = usuario[usuarioID].nome;
    campoAtualizacaoEmail.value = usuario[usuarioID].email;
}

function setAtualizar(usuarioID) {
    let atualizar = getCamposAtualizacao()
    let usuario = objLocalDB.retornaDados(chaveStorage);
    
    if(atualizar.fieldNome != "" && atualizar.fieldEmail != "") {
        objLocalDB.atulizar(usuarioID,usuario[usuarioID].cpf, atualizar.fieldNome, atualizar.fieldEmail,chaveStorage);
        location.reload()
    }   
    else if(atualizar.fieldNome != "" && atualizar.fieldEmail == "") {
        objLocalDB.atulizar(usuarioID,usuario[usuarioID].cpf, atualizar.fieldNome, usuario[usuarioID].email,chaveStorage);
        location.reload()
    }
    else if(atualizar.fieldEmail != "" && atualizar.fieldNome == "") {
        objLocalDB.atulizar(usuarioID,usuario[usuarioID].cpf, usuario[usuarioID].nome, atualizar.fieldEmail,chaveStorage);
        location.reload()
    }
    if(atualizar.fieldNome == "" && atualizar.fieldEmail == "") {
        alertaAtulizacao.innerHTML = 'Preencha um campo';
    }
    if(usuarioID == null) {
        alertaAtulizacao.innerHTML = 'Escolha um item da tabela';
    }
}

function deletar(usuarioID) {
    objLocalDB.deletar(usuarioID,chaveStorage);
    location.reload()
}

function cancelar(usuarioID) {
    botaoAtualizar.removeAttribute("onclick", `setAtualizar(${usuarioID})`);
    botaoDeletar.removeAttribute("onclick", `deletar(${usuarioID})`);
    
    painelUsuario.innerHTML = "";
    alertaAtulizacao.innerHTML = "";
    
    limparCampos('atualizar');
}


// FUNÇÕES DE CAMPOS
function getCamposCadastro() {
    let objCampos = objUsuario.usuario( campoCadastroNome.value, campoCadastroCPF.value, campoCadastroEmail.value )

    for(let i = 0; i < Object.values( objCampos ).length; i++) {
        if( !Object.values( objCampos )[i] ) return false
    }

    return objCampos
}



function getCamposAtualizacao() {
    let atualizacao = {
        fieldNome: campoAtualizacaoNome.value,
        fieldEmail: campoAtualizacaoEmail.value
    }
    return atualizacao;
}



function limparCampos(secao) {
    if(secao == 'cadastro') {
        campoCadastroNome.value = "";
        campoCadastroCPF.value = "";
        campoCadastroEmail.value = "";
        
        alertaCadastro.innerHTML = "";
    }
    
    else if(secao = 'atualizar') {
        campoAtualizacaoNome.value = "";
        campoAtualizacaoEmail.value = "";
        
        painelUsuario.innerHTML = "";
        alertaAtulizacao.innerHTML = "";
    }
}


