import { Component, OnInit } from '@angular/core';

import { GerenciasModelo } from "../../models/gerencias";
import { GerenciasService } from "../../services/gerencias.service";

import { MessageService, ConfirmationService } from 'primeng/api';


@Component({
    selector: 'app-gerencias',
    templateUrl: './gerencias.component.html',
    styleUrls: ['./gerencias.component.scss'],
    providers: [MessageService, ConfirmationService]
})
export class GerenciasComponent implements OnInit {

    cols: any[];
    Gerencias: GerenciasModelo[] = [];
    gerencia: GerenciasModelo = {};

    mostrarDialogo: boolean = false;

    constructor(private svrGerencias: GerenciasService, private messageService: MessageService,
        private confirmationService: ConfirmationService) { }

    ngOnInit() {
        this.cols = [
            { field: 'idConfigGerencia', header: 'Id' },
            { field: 'nombre', header: 'Nombre' },
            { field: 'descripcion', header: 'Descripción' }
        ];
        this.cargarLista();

    }

    cargarLista() {
        this.svrGerencias.getTodos().then(
            data => {
                this.Gerencias = data;
               // console.table(this.Gerencias);
            }
        );
    }

    nuevaGerencia() {
        this.gerencia = {};
        this.mostrarDialogo = true;
    }

    verDialogo(gerenciaAct : GerenciasModelo){
        this.gerencia = {};
        this.gerencia = gerenciaAct;
        this.mostrarDialogo = true;
    }

    cerrarDialogo() {
        this.mostrarDialogo = false;
    }

    guardarGerencia() {
        if (this.gerencia.nombre == null) {
            this.messageService.clear();
            this.messageService.add({ key: 'tc', severity: 'error', summary: 'Debe ingresar el nombre' });
            return false;
        }

        if (this.gerencia.descripcion == null) {
            this.messageService.clear();
            this.messageService.add({ key: 'tc', severity: 'error', summary: 'Debe ingresar la descripción' });
            return false;
        }

       // console.table(this.gerencia);

        if (this.gerencia.idConfigGerencia == null) {
            this.svrGerencias.nuevoGerencia(this.gerencia).then(
               data =>{ this.cargarLista();}
            );
            this.mostrarDialogo = false;
            this.messageService.clear();
            this.messageService.add({ key: 'tc', severity: 'success', summary: 'Gerencia registrada satisfactoriamente' });
        } else {
            this.svrGerencias.actualizarGerencial(this.gerencia).then(
                data =>{ this.cargarLista();}
             );
            this.cargarLista();
            this.mostrarDialogo = false;
            this.messageService.clear();
            this.messageService.add({ key: 'tc', severity: 'success', summary: 'Gerencia Actualizada satisfactoriamente' });
        }


    }

    eliminarGerencia(gere : GerenciasModelo, i){
        this.confirmationService.confirm({
            message: "¿Esta seguro de eliminar esta gerencia?",
            accept: () => {
                this.svrGerencias.eliminarGerencia(gere).then(
                    data =>{ this.cargarLista();}
                 );
            },
            reject: ()=>{
                return false;
            }
        });
       
    }

}
