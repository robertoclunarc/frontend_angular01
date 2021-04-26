import { Component, OnInit } from '@angular/core';
import { TipoDesagregacionProducto } from '../../models';
import { TiposDesagregacionProductoService } from '../../services';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'app-adm-tipos-desagregacion',
  templateUrl: './adm-tipos-desagregacion.component.html',
  styleUrls: ['./adm-tipos-desagregacion.component.scss'],
  providers: [ConfirmationService, MessageService, TiposDesagregacionProductoService]
})
export class AdmTiposDesagregacionComponent implements OnInit {

  displayDialog: boolean;
  newTipoDesagregacion: boolean;
  tituloDialogo: string = "";

  tipoDesagregacion: TipoDesagregacionProducto = {};
  tipoDesagregaciones: TipoDesagregacionProducto[];

  selectedTipoDesagregacion: TipoDesagregacionProducto;

  cols: any[];

  constructor(
    private srvTipoDesagregacionProductos: TiposDesagregacionProductoService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) { }

  ngOnInit() {

    this.consultarTiposDesagregacionProducto();

    this.cols = [
      { field: 'idAdmTipoDesagregacionProducto', header: 'ID', width: '10%' },
      { field: 'nombre', header: 'Nombre', width: '30%' },
      { field: 'descripcion', header: 'Descripción', width: '30%' },
      { field: 'fechaAlta', header: 'Fecha de Alta', width: '20%' },
    ];
  }

  guardar() {

    if (this.newTipoDesagregacion) {

      this.srvTipoDesagregacionProductos.registrar(this.tipoDesagregacion)
        .toPromise()
        .then(results => { this.consultarTiposDesagregacionProducto(); })
        .catch(err => { console.log(err) });

      this.showSuccess('Grupo se ha creado satisfactoriamente');
    }
    else {

      this.srvTipoDesagregacionProductos.actualizar(this.tipoDesagregacion)
      .toPromise()
      .then(results => { this.consultarTiposDesagregacionProducto(); })
      .catch(err => { console.log(err) });

    this.showSuccess('Tipo de Desagregación se ha actualizado satisfactoriamente');

    }
    this.tipoDesagregacion = null;
    this.displayDialog = false;
  }

  consultarTiposDesagregacionProducto(){

    this.srvTipoDesagregacionProductos.consultarTodos()
    .toPromise()
    .then(results => { this.tipoDesagregaciones = results; })
    .catch(err => { console.log(err) });
  }

  edit(tipoDesagregacionActual: TipoDesagregacionProducto) {

    this.newTipoDesagregacion = false;
    this.tipoDesagregacion = this.cloneGrupo(tipoDesagregacionActual);
    this.displayDialog = true;
    this.tituloDialogo = "Editar: " + tipoDesagregacionActual.nombre;
  }

  remove(tipoDesagregacionActual: TipoDesagregacionProducto) {

    this.confirmationService.confirm(
      {
        message: "¿Desea Eliminar el registro?",
        accept: () => {     
          
          this.eliminarGrupo(tipoDesagregacionActual); 
        }
      });
  }


  eliminarGrupo(tipoDesagregacionActual: TipoDesagregacionProducto) {

    this.srvTipoDesagregacionProductos.eliminar(tipoDesagregacionActual.idAdmTipoDesagregacionProducto)
    .toPromise()
    .then(results => {this.consultarTiposDesagregacionProducto()})
    .catch(err => { console.log(err) });
    
    this.showSuccess('Tipo de Desagregación se ha eliminado satisfactoriamente');
   
  }

  showDialogToAdd() {
    this.newTipoDesagregacion = true;
    this.tituloDialogo = "Nuevo Tipo de Desagregación producto";
    this.tipoDesagregacion = {};
    this.displayDialog = true;
  }

  cerrar() {
    this.tipoDesagregacion = null;
    this.displayDialog = false;
  }

  cloneGrupo(c: TipoDesagregacionProducto): TipoDesagregacionProducto {
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
