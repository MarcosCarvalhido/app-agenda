import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  imports: [CommonModule,FormsModule,ReactiveFormsModule],
  selector: 'app-cadastro-tarefas',
  styleUrl: './cadastro-tarefas.css',
  templateUrl: './cadastro-tarefas.html',
})
export class CadastroTarefas {
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
    console.table(this.formCadastro.value);
  };
};
