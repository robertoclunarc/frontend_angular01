import { Component, OnInit } from '@angular/core';

import { ServiciosGerenciasModelo } from "../../models/servicios-gerencias";
import { ServiciosGerenciasService } from "../../services/servicios-gerencias.service";

import { MessageService, ConfirmationService } from 'primeng/api';

@Component({
    selector: 'app-servicios-gerencias',
    templateUrl: './servicios-gerencias.component.html',
    styleUrls: ['./servicios-gerencias.component.scss'],
    providers: [ConfirmationService, MessageService]
})
export class ServiciosGerenciasComponent implements OnInit {

    cols: any[];
    ServiciosGerencias: ServiciosGerenciasModelo[] = [];
    servicio: ServiciosGerenciasModelo = {};

    mostrarDialogo: boolean = false;
    idGerencia: number = -1;

    constructor(private svrServciciosGer: ServiciosGerenciasService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService) { }

    ngOnInit() {

        this.idGerencia = JSON.parse(sessionStorage.getItem('currentUser')).idGerencia;
        this.cols = [
            { field: 'idConfigGerencia', header: 'Id' },
            { field: 'nombre', header: 'Nombre' },
            { field: 'descripcion', header: 'Descripción' }
        ];
        this.cargarLista();

    }

    cargarLista() {
        this.svrServciciosGer.getServiciosUnaGerencia2(this.idGerencia).then(
            data => {
                this.ServiciosGerencias = data;
                // console.table(this.Gerencias);
            }
        );
    }

    nuevaGerencia() {
        this.servicio = {};
        this.mostrarDialogo = true;
    }

    verDialogo(gerenciaAct: ServiciosGerenciasModelo) {
        this.servicio = {};
        this.servicio = gerenciaAct;
        this.mostrarDialogo = true;
    }

    cerrarDialogo() {
        this.mostrarDialogo = false;
    }

    guardarGerencia() {
        if (this.servicio.nombre == null) {
            this.messageService.clear();
            this.messageService.add({ key: 'tc', severity: 'error', summary: 'Debe ingresar el nombre' });
            return false;
        }

        if (this.servicio.descripcion == null) {
            this.messageService.clear();
            this.messageService.add({ key: 'tc', severity: 'error', summary: 'Debe ingresar la descripción' });
            return false;
        }

        console.table(this.servicio);

        if (this.servicio.idServiciosGerencias == null) {
            this.servicio.idGerencia = this.idGerencia;
            this.svrServciciosGer.nuevoServicioGerencias(this.servicio).then(
                data => { this.cargarLista(); }
            );
            this.mostrarDialogo = false;
            this.messageService.clear();
            this.messageService.add({ key: 'tc', severity: 'success', summary: 'Servicio registrado satisfactoriamente' });
        } else {
            this.svrServciciosGer.actualizarServicioGerencias(this.servicio).then(
                data => { 
                    this.cargarLista(); 
                    this.mostrarDialogo = false;
                    this.messageService.clear();
                    this.messageService.add({ key: 'tc', severity: 'success', summary: 'Servicio actualizado satisfactoriamente' });
                }
            );        
         
        }

    }

    eliminarServicioGerencia(gere: ServiciosGerenciasModelo, i) {
        this.confirmationService.confirm({
            message: "¿Esta seguro de eliminar este servicio?",
            accept: () => {
                 this.svrServciciosGer.eliminarServicioGerencias(gere).then(
                     data =>{ this.cargarLista();}
                  );
            },
            reject: () => {
                return false;
            }
        });

    }

}
