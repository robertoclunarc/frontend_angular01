import { Component, OnInit } from '@angular/core';
import { TipoClasificacion } from '../../models';
import { TiposClasificacionService } from '../../services';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'app-adm-tipos-clasificacion',
  templateUrl: './adm-tipos-clasificacion.component.html',
  styleUrls: ['./adm-tipos-clasificacion.component.scss'],
  providers: [ConfirmationService, MessageService, TiposClasificacionService]
})
export class AdmTiposClasificacionComponent implements OnInit {

  displayDialog: boolean;
  newTipoClasificacion: boolean;
  tituloDialogo: string = "";

  tipoClasificacion: TipoClasificacion = {};
  tipoClasificaciones: TipoClasificacion[];

  selectedTipoClasificacion: TipoClasificacion;

  cols: any[];

  constructor(
    private srvTiposClasificacionProductos: TiposClasificacionService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) { }

  ngOnInit() {

    this.consultarTiposClasificacionProducto();

    this.cols = [
      { field: 'idAdmTipoClasificacion', header: 'ID', width: '10%' },
      { field: 'nombre', header: 'Nombre', width: '40%' },
      { field: 'fechaAlta', header: 'Fecha de Alta', width: '40%' },
    ];
  }

  consultarTiposClasificacionProducto() {

    this.srvTiposClasificacionProductos.consultarTodos()
      .toPromise()
      .then(results => { this.tipoClasificaciones = results; })
      .catch(err => { console.log(err) });
  }

  guardar() {

    if (this.newTipoClasificacion) {

      this.tipoClasificacion.idAdmModulo = 1;

      this.srvTiposClasificacionProductos.registrar(this.tipoClasificacion)
        .toPromise()
        .then(results => { this.consultarTiposClasificacionProducto(); })
        .catch(err => { console.log(err) });

      this.showSuccess('Tipo de Clasificación se ha creado satisfactoriamente');
    }
    else {

      this.srvTiposClasificacionProductos.actualizar(this.tipoClasificacion)
        .toPromise()
        .then(results => { this.consultarTiposClasificacionProducto(); })
        .catch(err => { console.log(err) });

      this.showSuccess('Tipo de Clasificación se ha actualizado satisfactoriamente');

    }
    this.tipoClasificacion = null;
    this.displayDialog = false;

  }


  edit(tipoClasificacionActual: TipoClasificacion) {

    this.newTipoClasificacion = false;
    this.tipoClasificacion = this.cloneGrupo(tipoClasificacionActual);
    this.displayDialog = true;
    this.tituloDialogo = "Editar: " + this.tipoClasificacion.nombre;
  }

  remove(tipoClasificacionActual: TipoClasificacion) {

    this.confirmationService.confirm(
      {
        message: "¿Desea Eliminar el registro?",
        accept: () => {

          this.eliminar(tipoClasificacionActual);

        }
      });
  }


  eliminar(tipoClasificacionActual: TipoClasificacion) {

    this.srvTiposClasificacionProductos.eliminar(tipoClasificacionActual.idAdmTipoClasificacion)
      .toPromise()
      .then(results => { this.consultarTiposClasificacionProducto(); })
      .catch(err => { console.log(err) });

    this.showSuccess('Tipo de Clasificación se ha eliminado satisfactoriamente');

  }

  showDialogToAdd() {
    this.newTipoClasificacion = true;
    this.tituloDialogo = "Nuevo Tipo de Clasificación producto";
    this.tipoClasificacion = {};
    this.displayDialog = true;
  }

  cerrar() {
    this.tipoClasificacion = null;
    this.displayDialog = false;
  }

  cloneGrupo(c: TipoClasificacion): TipoClasificacion {
    let car = {};
    for (let prop in c) {
      car[prop] = c[prop];
    }
    return car;
  }


  private showError(errMsg: string) {
    this.messageService.clear();
    this.messageService.add({ key: 'tc', severity: 'error', summary: errMsg });
  }

  private showSuccess(successMsg: string) {
    this.messageService.clear();
    this.messageService.add({ key: 'tc', severity: 'success', summary: successMsg });
  }
}
