import React, { Component } from "react";
import axios from 'axios';
import Main from "../template/Main";

//propriedades do header que serao passadas para o main
const headerProps = {
    icon: 'users',
    title: 'Usuários',
    subtitle: 'Cadastro de usuário: Incluir, Listar, Alterar e Excluir'
};

//url do backend
const baseUrl = 'http://localhost:3001/users';

//estado inicial dos campos do formulario
const initialState = {
    user: { name: '', email: ''},
    list: []
};

export default class UserCrud extends Component {

    state = { ...initialState };

    //funcao que carregara a lista de usuarios quando o site carrega primeira vez
    componentWillMount() {
        axios(baseUrl).then(resp => {
            this.setState({ list: resp.data });
        });
    }

    //funcao que limpa os campos do formulario
    clear() {
        this.setState({ user: initialState.user });
    }

    //funcao que salva os valores presentes no formulario
    save() {

        const user = this.state.user;

        //define se e alteracao ou adicionar um novo
        const method = user.id ? 'put' : 'post';
        const url = user.id ? `${baseUrl}/${user.id}` : baseUrl;

        //chamada axios para alterar ou adicionar cadastro
        axios[method](url, user)
            .then(resp => {
                const list = this.getUpdateList(resp.data);
                this.setState({ user: initialState.user, list });
            });
    }

    //funcao que retorna a lista atualizada
    getUpdateList(user, add = true) {
        const list = this.state.list.filter(u => u.id !== user.id);
        if(add) {
            list.unshift(user);
        }
        return list;
    }

    //funcao que atualiza o campo do form ao escrever
    updateField(event) {
        const user = { ...this.state.user };
        user[event.target.name] = event.target.value;
        this.setState({ user });
    }

    //funcao que coloca os valores do usuario a ser alterado no campo  
    load(user) {
        this.setState({ user });
    }

    //funcao que remove usuario
    remove(user) {
        axios.delete(`${baseUrl}/${user.id}`).then(resp => {
            const list = this.getUpdateList(user, false);
            this.setState({ list });
        });
    }


    //funcao que cria o form a ser preenchido
    renderForm() {
        return (
            <div className="form">
                <div className="row">

                    {/* campo nome */}
                    <div className="col-12 col-md-6">
                        <div className="form-group">
                            <label>Nome</label>
                            <input type="text" className="form-control"
                                name="name"
                                value={this.state.user.name}
                                onChange={e => this.updateField(e)}
                                placeholder="Digite o Nome..." />
                        </div>
                    </div>

                    {/* campo email  */}
                    <div className="col-12 col-md-6">
                        <div className="form-group">
                            <label>Email</label>
                            <input type="text" className="form-control"
                                name="email"
                                value={this.state.user.email}
                                onChange={e => this.updateField(e)}
                                placeholder="Digite o Email..." />
                        </div>
                    </div>
                </div>

                <hr />
                {/* Botoes */}
                <div className="row">
                    <div className="col-12 d-flex justify-content-end">

                        <button className="btn btn-primary" onClick={e => this.save(e)}>
                            Salvar
                        </button>

                        <button className="btn btn-secondary ml-2" onClick={e => this.clear(e)}>
                            Cancelar
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    //funcao que cria a tabela de usaurios
    renderTable() {
        return (
            <table className="table mt-4">
                {/* Cabecalho da tabela */}
                <thead>
                    <tr>
                        <th>Nome</th>
                        <th>Email</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                {/* corpo da tabela e criado em outra funcao */}
                <tbody>
                    {this.renderRows()}
                </tbody>
            </table>
        );
    }

    //Funcao que cria corpo da tabela
    renderRows() {
        //percorre todos os objetos e para cada objeto cria uma linha
        return this.state.list.map(user => {
            return (
                <tr key={ user.id }>
                    <td>{ user.name }</td>
                    <td>{ user.email }</td>
                    {/* Botoes de alteracao e delete */}
                    <td>
                        <button className="btn btn-warning" onClick={() => this.load(user)}>
                            <i className="fa fa-pencil"></i>
                        </button>
                        <button className="btn btn-danger mt-1 ml-1" onClick={() => this.remove(user)}>
                            <i className="fa fa-trash"></i>
                        </button>
                    </td>
                </tr>
            );
        });
    }

    //funcao que cria toda a tela
    render() {
        return (
            <Main {...headerProps}>
                {this.renderForm()}
                {this.renderTable()}
            </Main>
        );
    }
}