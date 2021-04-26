import { Component, OnInit } from '@angular/core';
import { GrupoProducto, SubGrupoProducto } from '../../models';
import { GruposProductoService, SubGruposProductoService } from '../../services';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'app-adm-subgrupos',
  templateUrl: './adm-subgrupos.component.html',
  styleUrls: ['./adm-subgrupos.component.scss'],
  providers: [ConfirmationService, MessageService, GruposProductoService, SubGruposProductoService]
})
export class AdmSubgruposComponent implements OnInit {

  displayDialog: boolean;
  newSubGrupo: boolean;
  tituloDialogo: string = "";

  grupos: GrupoProducto[];
  subgrupo: SubGrupoProducto = {};
  subgrupos: SubGrupoProducto[];

  selectedSubGrupo: SubGrupoProducto;

  cols: any[];

  constructor( 
    private srvGrupoProductos: GruposProductoService,
    private srvSubGrupoProductos: SubGruposProductoService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,) { }

  ngOnInit() {

    this.consultarSubGruposProducto();

    this.cols = [
      { field: 'idAdmSubGrupoProducto', header: 'ID', width: '15%' },
      { field: 'grupo', header: 'Grupo', width: '25%' },
      { field: 'nombre', header: 'SubGrupo', width: '30%' },
      { field: 'fechaAlta', header: 'Fecha de Alta', width: '20%' }
    ];
  }

  consultarGruposProducto(){

    this.srvGrupoProductos.consultarTodos()
    .toPromise()
    .then(results => { this.grupos = results; })
    .catch(err => { console.log(err) });
  }

  consultarSubGruposProducto(){

    this.srvSubGrupoProductos.consultarTodos()
    .toPromise()
    .then(results => { this.subgrupos = results; 
    })
    .catch(err => { console.log(err) });
  }

  showDialogToAdd() {
    this.newSubGrupo = true;
    this.tituloDialogo = "Nuevo SubGrupo Producto";
    this.subgrupo = {};
    this.grupos = [];
    this.consultarGruposProducto();
    this.displayDialog = true;
  }

  guardar() {

    if (this.newSubGrupo) {

      this.srvSubGrupoProductos.registrar(this.subgrupo)
        .toPromise()
        .then(results => { this.consultarSubGruposProducto(); })
        .catch(err => { console.log(err) });

      this.showSuccess('SubGrupo se ha creado satisfactoriamente');
    }
    else {
      console.table(this.subgrupo);
      this.srvSubGrupoProductos.actualizar(this.subgrupo)
      .toPromise()
      .then(results => { this.consultarSubGruposProducto(); })
      .catch(err => { console.log(err) });

    this.showSuccess('SubGrupo se ha actualizado satisfactoriamente');

    }
    this.subgrupo = null;
    this.displayDialog = false;

  }
  
  edit(subGrupoActual: SubGrupoProducto) {

    this.newSubGrupo = false;
    this.subgrupo = {};
    this.subgrupo = {...subGrupoActual};
    this.displayDialog = true;
    this.tituloDialogo = "Editar: " + this.subgrupo.nombre;
    this.consultarGruposProducto();
  }

  remove(subGrupoActual: SubGrupoProducto) {

    this.confirmationService.confirm(
      {
        message: "¿Desea Eliminar el registro?",
        accept: () => {     
          this.eliminarSubGrupo(subGrupoActual); 
        }
      });
  }

  eliminarSubGrupo(subGrupoActual: SubGrupoProducto) {

    this.srvSubGrupoProductos.eliminar(subGrupoActual.idAdmSubGrupoProducto)
    .toPromise()
    .then(results => {this.consultarSubGruposProducto()})
    .catch(err => { console.log(err) });
    
    this.showSuccess('SubGrupo se ha eliminado satisfactoriamente');
   
  }

  cerrar() {
    this.subgrupo = null;
    this.displayDialog = false;
  }

  cloneSubGrupo(c: SubGrupoProducto): SubGrupoProducto {
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
