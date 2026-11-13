import { HttpClient } from "@angular/common/http";
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
    //Função para buscar as informações da API
     obterTarefas() :  Observable<Tarefa[]>{
        return this.http.get<Tarefa[]>(`${this.apiUrl}/tarefas`);
     }
    }