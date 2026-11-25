import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { TarefaService } from '../../../services/tarefa.service';
import { Tarefa } from '../../../models/tarefa.model';
import { ActivatedRoute } from '@angular/router';

@Component({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  selector: 'app-edicao-tarefas',
  styleUrl: './edicao-tarefas.css',
  templateUrl: './edicao-tarefas.html',
})
export class EdicaoTarefas {

  //Injeções de dependência
  private readonly tarefaService = inject(TarefaService);
  private readonly activatedRoute = inject(ActivatedRoute);

  //Atributo para armazenar o id da tarefa capturado da rota
  tarefaId: string = '';

  //Variável signal para exibir mensagem na página
  mensagem = signal<string>('');

  //Variável signal para guardar as opções de categorias
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

  //Formulário reativo
  formEdicao = new FormGroup({
    nome: new FormControl('', [Validators.required, Validators.minLength(6)]),
    data: new FormControl('', [Validators.required]),
    hora: new FormControl('', [Validators.required]),
    categoria: new FormControl('', [Validators.required]),
    prioridade: new FormControl('', [Validators.required]),
    finalizado: new FormControl(false, [Validators.required]),
    comentarios: new FormControl('', [Validators.required]),
  });

  //Evento executado quando o componente é carregado
  ngOnInit() {

    //Capturar o id enviado na URL
    this.tarefaId = this.activatedRoute.snapshot.paramMap.get('id') as string;

    //Consultar na API o registro referente a este ID
    this.tarefaService.obterTarefaPorId(this.tarefaId)
      .subscribe((tarefa) => {
        //Populando o formulário com os dados da tarefa obtida
        this.formEdicao.patchValue(tarefa);
      })
  }

  //Função executada quando o botão SUBMIT
  //do formulário for clicado
  editarTarefa() {

    //Capturar os campos preenchidos do formulário
    const tarefa: Tarefa = {
      id: '', //Gerado pela API do JSON SERVER
      nome: this.formEdicao.get('nome')?.value as string,
      data: this.formEdicao.get('data')?.value as string,
      hora: this.formEdicao.get('hora')?.value as string,
      categoria: this.formEdicao.get('categoria')?.value as string,
      prioridade: this.formEdicao.get('prioridade')?.value as string,
      finalizado: this.formEdicao.get('finalizado')?.value ?? false,
      comentarios: this.formEdicao.get('comentarios')?.value as string,
    };
    //Enviando uma requisição PUT para a API atualizar os dados
    this.tarefaService.alterarTarefa(this.tarefaId, tarefa)
      .subscribe((response) => {
        this.mensagem.set(`A tarefa "${response.nome}", foi atualizada em sua agenda com sucesso.`);
      });

  }

}
