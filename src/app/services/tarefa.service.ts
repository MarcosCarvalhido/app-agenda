import { HttpClient, HttpParams } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { environment } from "../../environments/environment";
import { Observable } from "rxjs";
import { Tarefa } from "../models/tarefa.model";

@Injectable(
    {
        providedIn: "root"
    }
)
export class TarefaService {
    //Realiza requisições HTTP para a API.
    private readonly http = inject(HttpClient);
    //Declara uma variavel
    private readonly apiUrl = environment.apiURL;
    //Função para buscar todas as tarefas da API
    obterTarefas(dataMin: string, dataMax: string): Observable<Tarefa[]> {

        //Criando o filtro de pesquisa por datas
        const params = new HttpParams()
            .set('data_gte', dataMin)  //Data maior ou igual a..
            .set('data_lte', dataMax) //Data menor ou igual a..
            .set('_sort', 'data,hora'); 

        //Fazendo uma chamada GET para a API para obter todas as tarefas
        return this.http.get<Tarefa[]>(`${this.apiUrl}/tarefas`, { params });
    }

    //Função para cadastrar uma tarefa na API
    incluirTarefa(tarefa: Tarefa): Observable<Tarefa> {
        //Fazendo uma chamada POST para a API para incluir uma tarefa
        return this.http.post<Tarefa>(`${this.apiUrl}/tarefas`, tarefa);
    }

    //Função para atualizar uma tarefa na API
    alterarTarefa(id: string, tarefa: Tarefa): Observable<Tarefa> {
        //Fazendo uma chamada PUT para a API para editar uma tarefa
        return this.http.put<Tarefa>(`${this.apiUrl}/tarefas/${id}`, tarefa);
    }

    //Função para excluir uma tarefa na API
    excluirTarefa(id: string): Observable<void> {
        //Fazendo uma chamada DELETE para a API para excluir uma tarefa
        return this.http.delete<void>(`${this.apiUrl}/tarefas/${id}`);
    }
}