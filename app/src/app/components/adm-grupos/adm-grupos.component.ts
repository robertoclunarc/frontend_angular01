import { Component, OnInit } from '@angular/core';
import { GrupoProducto } from '../../models';
import { GruposProductoService } from '../../services';
import { ConfirmationService, MessageService } from 'primeng/api';


@Component({
  selector: 'app-adm-grupos',
  templateUrl: './adm-grupos.component.html',
  styleUrls: ['./adm-grupos.component.scss'],
  providers: [ConfirmationService, MessageService, GruposProductoService]
})
export class AdmGruposComponent implements OnInit {

  displayDialog: boolean;
  newGrupo: boolean;
  tituloDialogo: string = "";

  grupo: GrupoProducto = {};
  grupos: GrupoProducto[];

  selectedGrupo: GrupoProducto;

  cols: any[];

  constructor(
    private srvGrupoProductos: GruposProductoService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) { }

  ngOnInit() {

    this.consultarGruposProducto();

    this.cols = [
      { field: 'idAdmGrupoProducto', header: 'ID', width: '10%' },
      { field: 'nombre', header: 'Nombre', width: '40%' },
      { field: 'fechaAlta', header: 'Fecha de Alta', width: '40%' },
    ];
  }


  consultarGruposProducto() {

    this.srvGrupoProductos.consultarTodos()
      .toPromise()
      .then(results => { this.grupos = results; })
      .catch(err => { console.log(err) });
  }

  guardar() {

    if (this.newGrupo) {

      this.srvGrupoProductos.registrar(this.grupo)
        .toPromise()
        .then(results => { this.consultarGruposProducto(); })
        .catch(err => { console.log(err) });

      this.showSuccess('Grupo se ha creado satisfactoriamente');
    }
    else {

      this.srvGrupoProductos.actualizar(this.grupo)
        .toPromise()
        .then(results => { this.consultarGruposProducto(); })
        .catch(err => { console.log(err) });

      this.showSuccess('Grupo se ha actualizado satisfactoriamente');

    }
    this.grupo = null;
    this.displayDialog = false;
    this.consultarGruposProducto();
  }


  edit(grupoActual: GrupoProducto) {

    this.newGrupo = false;
    this.grupo = this.cloneGrupo(grupoActual);
    this.displayDialog = true;
    this.tituloDialogo = "Editar: " + this.grupo.nombre;
  }

  remove(grupoActual: GrupoProducto) {

    this.confirmationService.confirm(
      {
        message: "¿Desea Eliminar el registro?",
        accept: () => {

          this.eliminarGrupo(grupoActual);

        }
      });
  }


  eliminarGrupo(grupoActual: GrupoProducto) {

    this.srvGrupoProductos.eliminar(grupoActual.idAdmGrupoProducto)
      .toPromise()
      .then(results => { this.consultarGruposProducto() })
      .catch(err => { console.log(err) });

    this.showSuccess('Grupo se ha eliminado satisfactoriamente');

  }

  showDialogToAdd() {
    this.newGrupo = true;
    this.tituloDialogo = "Crear Nuevo Grupo producto";
    this.grupo = {};
    this.displayDialog = true;
  }

  cerrar() {
    this.grupo = null;
    this.displayDialog = false;
  }

  cloneGrupo(c: GrupoProducto): GrupoProducto {
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
