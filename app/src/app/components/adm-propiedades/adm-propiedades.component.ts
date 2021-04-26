import { Component, OnInit } from '@angular/core';
import { Propiedad } from '../../models';
import { PropiedadesService } from '../../services';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'app-adm-propiedades',
  templateUrl: './adm-propiedades.component.html',
  styleUrls: ['./adm-propiedades.component.scss'],
  providers: [ConfirmationService, MessageService, PropiedadesService]
})
export class AdmPropiedadesComponent implements OnInit {

  displayDialog: boolean;
  newPropiedad: boolean;
  tituloDialogo: string = "";

  propiedad: Propiedad = {};
  propiedades: Propiedad[];

  selectedPropiedad: Propiedad;

  cols: any[];

  constructor(
    private srvPropiedades: PropiedadesService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) { }

  ngOnInit() {

    this.consultarPropiedades();

    this.cols = [
      { field: 'idAdmPropiedad', header: 'ID ', width: '10%' },
      { field: 'nombre', header: 'Nombre', width: '40%' },
      { field: 'fechaAlta', header: 'Fecha de Alta', width: '40%' },
    ];
  }

    
  consultarPropiedades(){

    this.srvPropiedades.consultarTodos()
    .toPromise()
    .then(results => { this.propiedades = results; })
    .catch(err => { console.log(err) });
  }

  guardar() {

    if (this.newPropiedad) {

      this.srvPropiedades.registrar(this.propiedad)
        .toPromise()
        .then(results => { this.consultarPropiedades(); })
        .catch(err => { console.log(err) });

      this.showSuccess('Propiedad se ha creado satisfactoriamente');
    }
    else {

      this.srvPropiedades.actualizar(this.propiedad)
      .toPromise()
      .then(results => { this.consultarPropiedades(); })
      .catch(err => { console.log(err) });

    this.showSuccess('Propiedad se ha actualizado satisfactoriamente');

    }
    this.propiedad = null;
    this.displayDialog = false;

  }


  edit(propiedadActual: Propiedad) {

    this.newPropiedad = false;
    this.propiedad = this.cloneGrupo(propiedadActual);
    this.displayDialog = true;
    this.tituloDialogo = "Editar: " + this.propiedad.nombre;
  }

  remove(propiedadActual: Propiedad) {

    this.confirmationService.confirm(
      {
        message: "¿Desea Eliminar el registro?",
        accept: () => {     
          
          this.eliminarGrupo(propiedadActual); 
         
        }
      });
  }


  eliminarGrupo(propiedadActual: Propiedad) {

    this.srvPropiedades.eliminar(propiedadActual.idAdmPropiedad)
    .toPromise()
    .then(results => {this.consultarPropiedades()})
    .catch(err => { console.log(err) });
    
    this.showSuccess('Propiedad se ha eliminado satisfactoriamente');
   
  }

  showDialogToAdd() {
    this.newPropiedad = true;
    this.tituloDialogo = "Nueva propiedad";
    this.propiedad = {};
    this.displayDialog = true;
  }

  cerrar() {
    this.propiedad = null;
    this.displayDialog = false;
  }

  cloneGrupo(c: Propiedad): Propiedad {
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
