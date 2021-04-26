import { Component, OnInit } from '@angular/core';
import { TipoMedida, UnidadMedida } from '../../models';
import { TiposMedidasService, UnidadesMedidaService } from '../../services';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'app-adm-unidades-medidas',
  templateUrl: './adm-unidades-medidas.component.html',
  styleUrls: ['./adm-unidades-medidas.component.scss'],
  providers: [ConfirmationService, MessageService, TiposMedidasService, UnidadesMedidaService]
})
export class AdmUnidadesMedidasComponent implements OnInit {

  displayDialog: boolean;
  newUnidadMedida: boolean;
  tituloDialogo: string = "";

  tiposmedidas: TipoMedida[];
  unidadMedida: UnidadMedida = {};
  unidadesMedidas: UnidadMedida[];

  selectedUnidadMedida: UnidadMedida;

  cols: any[];

  constructor(
    private srvTiposMedida: TiposMedidasService,
    private srvUnidadesMedida: UnidadesMedidaService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService, ) { }

  ngOnInit() {

    this.consultarUnidadesMedidas();

    this.cols = [
      { field: 'idAdmUnidadMedida', header: 'ID', width: '10%' },
      { field: 'tipoMedida', header: 'Tipo de Medida', width: '25%' },
      { field: 'nombre', header: 'Nombre', width: '30%' },
      { field: 'abrev', header: 'Abrev.', width: '10%' },
      { field: 'fechaAlta', header: 'Fecha de Alta', width: '15%' }
    ];

  }

  consultarTiposMedidasProducto() {

    this.srvTiposMedida.consultarTodos()
      .toPromise()
      .then(results => { this.tiposmedidas = results; })
      .catch(err => { console.log(err) });
  }


  consultarUnidadesMedidas() {

    this.srvUnidadesMedida.consultarTodos()
      .toPromise()
      .then(results => {
      this.unidadesMedidas = results;
      })
      .catch(err => { console.log(err) });
  }


  showDialogToAdd() {
    this.newUnidadMedida = true;
    this.tituloDialogo = "Nuevo Unidad de Medida";
    this.unidadMedida = {};
    this.tiposmedidas = [];
    this.consultarTiposMedidasProducto();
    this.displayDialog = true;
  }

  guardar() {

    if (this.newUnidadMedida) {

      this.srvUnidadesMedida.registrar(this.unidadMedida)
        .toPromise()
        .then(results => { this.consultarUnidadesMedidas(); })
        .catch(err => { console.log(err) });

      this.showSuccess('Unidad de Medida se ha creado satisfactoriamente');
    }
    else {

      this.srvUnidadesMedida.actualizar(this.unidadMedida)
        .toPromise()
        .then(results => { this.consultarUnidadesMedidas(); })
        .catch(err => { console.log(err) });

      this.showSuccess('Unidad de Medida se ha actualizado satisfactoriamente');

    }
    this.unidadMedida = null;
    this.displayDialog = false;

  }

  edit(unidadMedidaActual: UnidadMedida) {

    this.newUnidadMedida = false;
    this.unidadMedida = this.cloneSubGrupo(unidadMedidaActual);
    this.displayDialog = true;
    this.tituloDialogo = "Editar: " + this.unidadMedida.nombre;
    this.consultarTiposMedidasProducto();
  }

  remove(unidadMedidaActual: UnidadMedida) {

    this.confirmationService.confirm(
      {
        message: "¿Desea Eliminar el registro?",
        accept: () => {     
          this.eliminarSubGrupo(unidadMedidaActual); 
        }
      });
  }

  eliminarSubGrupo(unidadMedidaActual: UnidadMedida) {

    this.srvUnidadesMedida.eliminar(unidadMedidaActual.idAdmUnidadMedida)
    .toPromise()
    .then(results => {this.consultarUnidadesMedidas()})
    .catch(err => { console.log(err) });
    
    this.showSuccess('Unidad de Medida se ha eliminado satisfactoriamente');
   
  }

  cerrar() {
    this.unidadMedida = null;
    this.displayDialog = false;
  }

  cloneSubGrupo(c: UnidadMedida): UnidadMedida {
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
