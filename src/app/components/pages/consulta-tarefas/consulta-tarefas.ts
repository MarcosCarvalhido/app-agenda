import { Component, inject, Inject } from '@angular/core';
import { TarefaService } from '../../../services/tarefa.service';

@Component({
  imports: [],
  selector: 'app-consulta-tarefas',
  styleUrl: './consulta-tarefas.css',
  templateUrl: './consulta-tarefas.html',
})
export class ConsultaTarefas {
  private readonly tarefaService = inject(TarefaService);
  ngOnInit(){
    this.tarefaService.obterTarefas()
    .subscribe((tarefas)=> {
      
      
    })
  }
}
