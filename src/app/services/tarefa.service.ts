import { HttpClient, HttpParams } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { environment } from "../../environments/environment";
import { map, Observable } from "rxjs";
import { Tarefa } from "../models/tarefa.model";
import { ResumoGrafico } from "../models/dashboard.model";

@Injectable({ //Habilitar injeção de dependência para o serviço
    providedIn: "root", //Todo o aplicativo terá acesso a este serviço
})
export class TarefaService {

    //Injeção de dependência da biblioteca HttpClient 
    //para realizar requisições HTTP para a API
    private readonly http = inject(HttpClient);

    //Declarar uma variavel para armazenar a URL base da API
    private readonly apiUrl = environment.apiURL;

    //Função para buscar todas as tarefas da API
    obterTarefas(dataMin: string, dataMax: string): Observable<Tarefa[]> {

        //Criando o filtro de pesquisa por datas
        const params = new HttpParams()
            .set('data_gte', dataMin) //Data maior ou igual a..
            .set('data_lte', dataMax) //Data menor ou igual a..
            .set('_sort', 'data,hora'); //Ordenação

        //Fazendo uma chamada GET para a API para obter todas as tarefas
        return this.http.get<Tarefa[]>(`${this.apiUrl}/tarefas`, { params });
    }

    //Função para obter 1 tarefa através do ID
    obterTarefaPorId(id: string): Observable<Tarefa> {
        //Fazendo uma chamada GET na API passando o ID da tarefa
        return this.http.get<Tarefa>(`${this.apiUrl}/tarefas/${id}`);
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

    //Função para obter os resumos dos gráficos
    obterResumoGraficos(dataMin: string, dataMax: string): Observable<ResumoGrafico> {
        //Consultar as tarefas dentro do periodo de datas
        return this.obterTarefas(dataMin, dataMax)
            .pipe(
                map(tarefas => {

                    const totaisPorCategoria = new Map<string, number>();
                    let finalizadas = 0;

                    for (const tarefa of tarefas) {
                        const categoria = tarefa.categoria;
                        const totalAtual = totaisPorCategoria.get(categoria) ?? 0;

                        totaisPorCategoria.set(categoria, totalAtual + 1);

                        if (String(tarefa.finalizado) === 'true') {
                            finalizadas++;
                        }
                    }

                    return {
                        porCategoria: Array.from(
                            totaisPorCategoria,
                            ([name, y]) => ({ name, y })
                        ),
                        porStatus: [
                            { name: 'Finalizadas', y: finalizadas },
                            { name: 'Pendentes', y: tarefas.length - finalizadas }
                        ]
                    };
                })
            );
    }

}