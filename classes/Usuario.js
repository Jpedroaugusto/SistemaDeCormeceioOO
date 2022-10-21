class Usuario {
    constructor(nome,cpf,email) {
        this.nome = nome;
        this.cpf = cpf;
        this.emai = email;
    }

    validarCampos() {
        if(this.nome != "" && this.cpf != "" && this.email != "") {
            return true;
        } else {
            return false;
        }
    }

    cadastrarUsuario() {
        if(this.validarCampos() == true){
            let tbody = document.getElementById('tbody');
            let tr = "";

            tr += `<tr>`;
            tr += `<td>${this.nome}</td>`;
            tr += `<td>${this.cpf}</td>`;
            tr += `<td>${this.email}</td>`;
            tr += `</tr>`;

            tbody.innerHTML += tr
        }
    }
}

module.exports = Usuario