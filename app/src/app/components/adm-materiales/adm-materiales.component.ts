import { Component, OnInit } from '@angular/core';
import { MaterialProducto } from '../../models';
import { MaterialesProductoService } from '../../services';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'app-adm-materiales',
  templateUrl: './adm-materiales.component.html',
  styleUrls: ['./adm-materiales.component.scss'],
  providers: [ConfirmationService, MessageService, MaterialesProductoService]
})
export class AdmMaterialesComponent implements OnInit {

  displayDialog: boolean;
  newMaterial: boolean;
  tituloDialogo: string = "";

  material: MaterialProducto = {};
  materiales: MaterialProducto[];

  selectedMaterial: MaterialProducto;

  cols: any[];

  constructor(    
    private srvMaterialesProducto: MaterialesProductoService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService) { }

  ngOnInit() {

    this.consultarMaterialesProducto();

    this.cols = [
      { field: 'idAdmMaterialProducto', header: 'ID', width: '15%' },
      { field: 'nombre', header: 'Nombre', width: '35%' },
      { field: 'fechaAlta', header: 'Fecha de Alta', width: '40%' },
    ];

  }

  showDialogToAdd() {
    this.newMaterial = true;
    this.tituloDialogo = "Crear Nuevo material producto";
    this.material = {};
    this.displayDialog = true;
  }

  consultarMaterialesProducto(){
    this.srvMaterialesProducto.consultarTodos()
    .toPromise()
    .then(results => { this.materiales = results; })
    .catch(err => { console.log(err) });
  }


  guardar() {

    if (this.newMaterial) {

      this.srvMaterialesProducto.registrar(this.material)
        .toPromise()
        .then(results => { this.consultarMaterialesProducto(); })
        .catch(err => { console.log(err) });

      this.showSuccess('Material se ha creado satisfactoriamente');
    }
    else {

      this.srvMaterialesProducto.actualizar(this.material)
      .toPromise()
      .then(results => { this.consultarMaterialesProducto(); })
      .catch(err => { console.log(err) });

    this.showSuccess('Material se ha actualizado satisfactoriamente');

    }
    this.material = null;
    this.displayDialog = false;

  }

  edit(materialActual: MaterialProducto) {

    this.newMaterial = false;
    this.material = this.cloneMaterial(materialActual);
    this.displayDialog = true;
    this.tituloDialogo = "Editar: " + this.material.nombre
  }

  remove(materialActual: MaterialProducto) {

    this.confirmationService.confirm(
      {
        message: "¿Desea Eliminar el registro?",
        accept: () => {     
          this.eliminarMaterial(materialActual); 
        }
      });
  }


  eliminarMaterial(materialActual: MaterialProducto) {

    this.srvMaterialesProducto.eliminar(materialActual.idAdmMaterialProducto)
    .toPromise()
    .then(results => {this.consultarMaterialesProducto()})
    .catch(err => { console.log(err) });
    
    this.showSuccess('Material se ha eliminado satisfactoriamente');
   
  }

  cerrar() {
    this.material = null;
    this.displayDialog = false;
  }

  cloneMaterial(c: MaterialProducto): MaterialProducto {
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
