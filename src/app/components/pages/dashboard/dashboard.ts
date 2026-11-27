import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { TarefaService } from '../../../services/tarefa.service';
import { Chart, ChartModule } from 'angular-highcharts';

@Component({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ChartModule
  ],
  selector: 'app-dashboard',
  styleUrl: './dashboard.css',
  templateUrl: './dashboard.html',
})
export class Dashboard {

  //Injeções de dependência
  private readonly tarefaService = inject(TarefaService);

  //Gráficos
  graficoDonut = signal(new Chart());
  graficoColunas = signal(new Chart());

  //Estrutura do formulario
  formDashboard = new FormGroup({
    dataMin: new FormControl('', [Validators.required]),
    dataMax: new FormControl('', [Validators.required])
  });

  //Evento executado ao carregar o componente
  ngOnInit() {

    //Calculando primeiro e ultimo dia do mes atual
    const hoje = new Date();
    const ano = hoje.getFullYear();
    const mes = hoje.getMonth();

    const mesFormatado = String(mes + 1).padStart(2, '0');
    const ultimoDia = new Date(ano, mes + 1, 0).getDate();

    //Definindo o filtro para carregar as tarefas do primeiro dia ao ultimo dia do mes atual
    this.formDashboard.setValue({
      dataMin: `${ano}-${mesFormatado}-01`,
      dataMax: `${ano}-${mesFormatado}-${ultimoDia}`
    });

    this.gerarGraficos();
  }

  //Função para criar os graficos no dashboard
  gerarGraficos() {
    //Executando a consulta que irá trazer os resumos dos graficos
    this.tarefaService.obterResumoGraficos(
      this.formDashboard.value.dataMin as string,
      this.formDashboard.value.dataMax as string
    ).subscribe((data) => {

      //Popular o gráfico de donut
      this.graficoDonut.set(new Chart({
        chart: { type: 'pie' },
        title: { text: 'Tarfas por status' },
        credits: { enabled: false },
        colors: ['#198754', '#DC3545'],
        plotOptions: {
          pie: {
            innerSize: '65%',
            dataLabels: { format: '{point.name} : {point.y}' }
          }
        },
        series: [{
          type: 'pie',
          name: 'Tarefas',
          data: data.porStatus
        }]
      }));

      //Popular o gráfico de colunas
      this.graficoColunas.set(new Chart({
        chart: { type: 'column' },
        title: { text: 'Tarefas por categoria' },
        credits: { enabled: false },
        legend: { enabled: false },
        xAxis: {
          categories: data.porCategoria.map(ponto => ponto.name)
        },
        yAxis: {
          min: 0,
          allowDecimals: false,
          title: { text: 'Quantidade de tarefas' }
        },
        series: [{
          type: 'column',
          name: 'Tarefas',
          color: '#0d6efd',
          data: data.porCategoria.map(ponto => ponto.y)
        }]
      }));
    });
  }

}
