import { Component, inject, Inject, signal } from '@angular/core';
import { TarefaService } from '../../../services/tarefa.service';
import { Tarefa } from '../../../models/tarefa.model';
import { CommonModule } from '@angular/common';

@Component({
  imports: [CommonModule],
  selector: 'app-consulta-tarefas',
  styleUrl: './consulta-tarefas.css',
  templateUrl: './consulta-tarefas.html',
})
export class ConsultaTarefas {
  private readonly tarefaService = inject(TarefaService);

  tarefas = signal<Tarefa[]>([]);

  ngOnInit(){
    this.tarefaService.obterTarefas()
    .subscribe((tarefas)=> {
      this.tarefas.set(tarefas)
      
    })
  }
}
