import { Component, inject, Inject, signal } from '@angular/core';
import { TarefaService } from '../../../services/tarefa.service';
import { Tarefa } from '../../../models/tarefa.model';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  imports: [CommonModule, FormsModule, ReactiveFormsModule,RouterLink],
  selector: 'app-consulta-tarefas',
  styleUrl: './consulta-tarefas.css',
  templateUrl: './consulta-tarefas.html',
})
export class ConsultaTarefas {
  //Injeção de dependência do serviço de tarefas
  private readonly tarefaService = inject(TarefaService);

  //Atributo signal para armazenar a listagem de tarefas
  tarefas = signal<Tarefa[]>([]);

  //Formulário reativo para capturar o filtro de datas
  formConsulta = new FormGroup({
    dataMin: new FormControl('', [Validators.required]),
    dataMax: new FormControl('', [Validators.required]),
  })

  //Função executada ao iniciar o componente
  ngOnInit() {
    //Calculando primeiro e ultimo dia do mes atual
    const hoje = new Date();
    const ano = hoje.getFullYear();
    const mes = hoje.getMonth();

    const mesFormatado = String(mes + 1).padStart(2, '0');
    const ultimoDia = new Date(ano, mes + 1, 0).getDate();

    //Definindo o filtro para carregar as tarefas do primeiro dia ao ultimo dia do mes atual
    this.formConsulta.setValue({
      dataMin: `${ano}-${mesFormatado}-01`,
      dataMax: `${ano}-${mesFormatado}-${ultimoDia}`
    });

    //Executando a consulta de tarefas
    this.consultarTarefas()
  }
  //Função executada no submit do formulário
  consultarTarefas() {
    this.tarefaService.obterTarefas(
      this.formConsulta.value.dataMin as string,
      this.formConsulta.value.dataMax as string)
      .subscribe((tarefas) => { //Aguardando a resposta da API
        //Armazenar os dados obtidos no atributo signal
        this.tarefas.set(tarefas);
      });
  }


  //Função para excluir uma tarefa selecionada
  excluirTarefa(id: string) {
    if (confirm('Deseja realmente excluir a tarefa selecionada?')) {

      //Executando a exclusão da tarefa na API
      this.tarefaService.excluirTarefa(id).subscribe(() => {
        //Exibir mensagem
        alert('Tarefa excluída com sucesso!')
        //Executando uma consulta
        this.consultarTarefas();

      });
    }
  }
}
