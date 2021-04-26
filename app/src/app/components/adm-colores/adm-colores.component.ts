import { Component, OnInit } from '@angular/core';
import { ColorProducto } from '../../models';
import { ColoresProductoService } from '../../services';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'app-adm-colores',
  templateUrl: './adm-colores.component.html',
  styleUrls: ['./adm-colores.component.scss'],
  providers: [ConfirmationService, MessageService, ColoresProductoService]
})
export class AdmColoresComponent implements OnInit {

  displayDialog: boolean;
  newColor: boolean;
  tituloDialogo: string = "";

  color: ColorProducto = {};
  colores: ColorProducto[];

  selectedColor: ColorProducto;

  cols: any[];

  constructor(
    private srvColoresProducto: ColoresProductoService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService

  ) { }

  ngOnInit() {

    this.consultarColoresProducto();

    this.cols = [
      { field: 'idAdmColorProducto', header: 'ID', width: '10%' },
      { field: 'nombre', header: 'Nombre', width: '40%' },
      { field: 'fechaAlta', header: 'Fecha de Alta', width: '40%' },
    ];
  }

  consultarColoresProducto(){

    this.srvColoresProducto.consultarTodos()
    .toPromise()
    .then(results => { this.colores = results; })
    .catch(err => { console.log(err) });

  }

  guardar() {

    if (this.newColor) {

      this.srvColoresProducto.registrar(this.color)
        .toPromise()
        .then(results => { this.consultarColoresProducto(); })
        .catch(err => { console.log(err) });

      this.showSuccess('Color se ha creado satisfactoriamente');
    }
    else {

      this.srvColoresProducto.actualizar(this.color)
      .toPromise()
      .then(results => { this.consultarColoresProducto(); })
      .catch(err => { console.log(err) });

    this.showSuccess('Color se ha actualizado satisfactoriamente');

    }
    this.color = null;
    this.displayDialog = false;

  }

  edit(colorActual: ColorProducto) {

    this.newColor = false;
    this.color = this.cloneColor(colorActual);
    this.displayDialog = true;
    this.tituloDialogo = "Editar: " + this.color.nombre
  }

  

  remove(colorActual: ColorProducto) {

    this.confirmationService.confirm(
      {
        message: "¿Desea Eliminar el registro?",
        accept: () => {     
          
          this.eliminarGrupo(colorActual); 
         
        }
      });
  }


  eliminarGrupo(colorActual: ColorProducto) {

    this.srvColoresProducto.eliminar(colorActual.idAdmColorProducto)
    .toPromise()
    .then(results => {this.consultarColoresProducto();
    })
    .catch(err => { console.log(err) });
    
    this.showSuccess('Color se ha eliminado satisfactoriamente');
  }

  showDialogToAdd() {
    this.newColor = true;
    this.tituloDialogo = "Nuevo Color producto";
    this.color = {};
    this.displayDialog = true;
  }

  cerrar() {
    this.color = null;
    this.displayDialog = false;
  }

  cloneColor(c: ColorProducto): ColorProducto {
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
