import { Routes } from '@angular/router';
import { Dashboard } from './components/pages/dashboard/dashboard';
import { CadastroTarefas } from './components/pages/cadastro-tarefas/cadastro-tarefas';
import { ConsultaTarefas } from './components/pages/consulta-tarefas/consulta-tarefas';
import { NotFound } from './components/errors/not-found/not-found';

export const routes: Routes = [
    {
        path: 'pages/dashboard',
        component: Dashboard
    },
    {
        path: 'pages/cadastro-tarefas',
        component: CadastroTarefas
    },
    {
        path: 'pages/consulta-tarefas',
        component:ConsultaTarefas
    },
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'pages/dashboard'
    },{
        path: '**',
        component: NotFound
    }
];
