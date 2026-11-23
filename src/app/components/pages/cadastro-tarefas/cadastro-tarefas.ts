import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Tarefa } from '../../../models/tarefa.model';
import { TarefaService } from '../../../services/tarefa.service';

@Component({
  imports: [CommonModule,FormsModule,ReactiveFormsModule],
  selector: 'app-cadastro-tarefas',
  styleUrl: './cadastro-tarefas.css',
  templateUrl: './cadastro-tarefas.html',
})
export class CadastroTarefas {
  //Injeção de dependência
  private readonly tarefaService = inject(TarefaService)

  //Variável signal para exibir mensagem na página
  mensagem = signal<string>('');

  categorias = signal<string[]>([
    'Trabalho', 'Estudo', 'Casa', 'Saúde', 'Lazer', 'Outros'
  ]);

  //Variável signal para guardar as opções de prioridades
  prioridades = signal<string[]>([
    'Alta', 'Média', 'Baixa'
  ]);

  //Variável signal para guardar as opções do campo finalizado
  opcoesFinalizado = signal<{ valor: string, descricao: string }[]>([
    { valor: 'true', descricao: 'Sim' },
    { valor: 'false', descricao: 'Não' },
  ]);
  formCadastro = new FormGroup({
    nome: new FormControl('',[Validators.required]),
    data: new FormControl('',[Validators.required]),
    hora: new FormControl('',[Validators.required]),
    categoria: new FormControl(''),
    prioridade: new FormControl(''),
    finalizado: new FormControl(''),
    comentarios: new FormControl(''),
  })

  cadatrarTarefa(){
    const tarefa : Tarefa = {
      id: '',
      nome: this.formCadastro.get('nome')?.value as string,
      data: this.formCadastro.get('data')?.value as string,
      hora: this.formCadastro.get('hora')?.value as string,
      categoria: this.formCadastro.get('categoria')?.value as string,
      prioridade: this.formCadastro.get('prioridade')?.value as string,
      finalizado: this.formCadastro.get('finalizado')?.value === 'true',
      comentarios: this.formCadastro.get('comentarios')?.value as string,
    }

    this.tarefaService.incluirTarefa(tarefa).subscribe((Response)=>{
      this.mensagem.set(`A tarefa ${tarefa.nome} foi cadastrada com sucesso!`);
      this.formCadastro.reset() // limpa o formulario
    })
  };
};
