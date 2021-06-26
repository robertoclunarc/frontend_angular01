import { Component, OnInit } from '@angular/core';
import { AdmActivosService } from '../../../services/config-generales/adm-activos.service';
import { ConfigGerenciasService } from '../../../services/config-generales/config-gerencias.service';
import { AreaNegocioService } from '../../../services/config-generales/gen-area-negocio.service';
import { EmpresacomprasService} from '../../../services/config-generales/compras-empresa.service';
import { EmpresaService } from '../../../services/config-generales/gen-empresa.service'
import { Iadm_activos, Iconfig_activos_areas_negocios, Iconfig_activos_gerencias } from '../../../models/config-generales/Iadm-activos';
import { GerenciasModelo } from '../../../models/gerencias';
import { AreaNegocioModelo } from '../../../models/area-negocio';
import { formatDate } from '@angular/common';
import { ConfirmationService, MessageService, SelectItem } from 'primeng/api';


@Component({
  selector: 'app-adm-activos',
  templateUrl: './adm-activos.component.html',
  styleUrls: ['./adm-activos.component.scss'],
  providers: [AdmActivosService, ConfirmationService, MessageService]
})

export class AdmActivosComponent implements OnInit {
  displayDialog: boolean;
	newActivo: boolean;
	tituloDialogo: string = "";
  primera_fila = 0;
	todasGerencias: GerenciasModelo[];
  gerencias_load: any[];
	areasNegocios: SelectItem[] = [];
  empresas:  SelectItem[] = [];  
  empresasProp: SelectItem[] = [];
  activosPadres:  SelectItem[] = [];
	areaNegocioSelected: number;  
  empresaComprasSelected: SelectItem; 
  empresaPropSelected: SelectItem; 
  activoSelected: Iadm_activos;
  
  tipos: any[]
  tipo: string
	cols: any[];

  constructor(public srvAdmActivo: AdmActivosService,
    private srvAreaNegocio: AreaNegocioService,
    private srvGerencia: ConfigGerenciasService,
    private srvEmpresaCompras: EmpresacomprasService,
    private srvEmpresaPropietaria: EmpresaService,
    private confirmationService: ConfirmationService,
		private messageService: MessageService) { }

  ngOnInit(): void {
    
    this.consultarActivosJoins();
    this.displayGerencias();
    this.cargarAreaNegocios();
    this.cargarEmpresaCompras();
    this.cargarEmpresaPropietaria();
    
    this.tipos =  [
      {label: 'PROYECTO', value: 'PROYECTO'}, 
      {label: 'PATIO', value: 'PATIO'},
      {label: 'PLANTA', value: 'PLANTA'},
      {label:  'OFICINA', value: 'OFICINA'},
      {label:  'GABARRA', value: 'GABARRA'},
      {label:  'MAQUINAS', value: 'MAQUINAS'}
    ];

    this.cols = [
			{ field: 'serial', header: 'Serial', width: '10%' },
			{ field: 'tipo', header: 'Tipo', width: '10%' },
			{ field: 'nombre', header: 'Nombre', width: '25%' },
      { field: 'empresa_propietaria', header: 'Propietario', width: '20%' },
			{ field: 'nombre_area_negocio', header: 'Area Negocio', width: '15%' },
      { field: 'nombre_gerencia', header: 'Gcia. Asociadas', width: '20%' }
		];
  }

  consultarActivos(idActivo?: number) {
		this.srvAdmActivo.consultarTodos()    
			.toPromise()
			.then(results => {        
        if (idActivo){			     
          this.srvAdmActivo.activos=results.filter((m) => m.idAdmActivo != idActivo);  
        }else{
          this.srvAdmActivo.activos = results;
        }
        this.activosPadres=[];        
				this.srvAdmActivo.activos.forEach(act => {
          this.activosPadres.push({label: act.nombre, value: act.idAdmActivo});
        });        
			})
			.catch(err => { console.log(err) });      
	}

  consultarActivosJoins() {
		this.srvAdmActivo.consultarJoin()
			.toPromise()
			.then(results => {
			this.srvAdmActivo.activosJoins = results;      
			})
			.catch(err => { console.log(err) });      
	}

  displayGerencias() {
		this.srvGerencia.getTodos()
      .toPromise()
			.then(data => {
				this.todasGerencias = data;				
			})
	};

  cargarAreaNegocios() {
		this.srvAreaNegocio.getTodos()
      .toPromise()
			.then(data => {
        this.areasNegocios=[];
				data.forEach(areaNeg => {
          this.areasNegocios.push({label: areaNeg.nombre, value: areaNeg.idGenAreaNegocio});
        });       
			})
	}

  cargarEmpresaCompras() {
		this.srvEmpresaCompras.getTodos()      
			.then(data => {
        this.empresas = [];
        this.srvEmpresaCompras.EmpresasCompras=data;
        data.forEach(emp => {
          this.empresas.push({label: emp.nombre_empresa, value: emp.IdComprasEmpresa });
        });
			});    
	}

  cargarEmpresaPropietaria() {
		this.srvEmpresaPropietaria.getTodos()
			.then(data => {
        this.empresasProp = [];
        data.forEach(emp => {
          this.empresasProp.push({label: emp.nombre_empresa, value: emp.IdGenEmpresa});
        });
			});      
	}
  
  showDialogToAdd() {
		this.newActivo = true;
		this.tituloDialogo = "Nuevo Activo";		
    this.consultarActivos();
    this.srvEmpresaCompras.getAllconCerradas(0)    
			.then(data => {
        this.empresas = [];        
        data.forEach(emp => {
          this.empresas.push({label: emp.nombre_empresa, value: emp.IdComprasEmpresa });
        });
			});
    
    this.srvEmpresaPropietaria.viewFromAnyField({IdGenEmpresa: null, cerrada:'No'})
      .toPromise()
			.then(data => {
        this.empresasProp = [];
        data.forEach(emp => {
          this.empresasProp.push({label: emp.nombre_empresa, value: emp.IdGenEmpresa});
        });
			});
    
    this.srvAdmActivo.admActivo = {
      idAdmActivo: null,
      nombre: null
    }
    this.areaNegocioSelected=null;
    this.gerencias_load=[];
		this.displayDialog = true;
	}

  async guardar(){ 
    
    if (this.isEmpty(this.srvAdmActivo.admActivo.nombre) == null || this.srvAdmActivo.admActivo.nombre == null || this.srvAdmActivo.admActivo.nombre == undefined || this.srvAdmActivo.admActivo.nombre=='') {
			this.messageService.clear();
			this.messageService.add({ key: 'tc', severity: 'error', summary: 'Debe ingresar el nombre del activo' });
			return false;
		}
		if (this.areaNegocioSelected == null || this.areaNegocioSelected == undefined) {
			this.messageService.clear();
			this.messageService.add({ key: 'tc', severity: 'error', summary: 'Debe seleccionar una area de Negocio' });
			return false;
		}

    if ( this.srvAdmActivo.admActivo.tipo == null || this.srvAdmActivo.admActivo.tipo == undefined) {
			this.messageService.clear();
			this.messageService.add({ key: 'tc', severity: 'error', summary: 'Debe seleccionar el tipo' });
			return false;
		}

		if (this.gerencias_load == undefined || this.gerencias_load == null || this.gerencias_load.length == 0) {
			this.messageService.clear();
			this.messageService.add({ key: 'tc', severity: 'error', summary: 'Debe seleccionar al menos una(1) gerencia' });
			return false;
		}         
      
      if (this.newActivo) {
        //this.srvAdmActivo.admActivo.fechaAlta= formatDate(Date.now(), 'yyyy-MM-dd', 'en');
        await this.srvAdmActivo.registrar(this.srvAdmActivo.admActivo)
          .toPromise()     
          .then(results => {
            if (!isNaN(this.srvAdmActivo.admActivo.idAdmActivo)){
              this.registrarAreaNegocio(this.srvAdmActivo.admActivo.idAdmActivo);
              this.registrarGerenciasAsociadas(this.srvAdmActivo.admActivo.idAdmActivo);
            }           
            
          })
          .catch(err => { console.log(err) });     
               
        this.showSuccess('Activo creado satisfactoriamente');
        
      }
      else {
        
        if (this.srvAdmActivo.admActivo.fechaModificacion=="" || this.srvAdmActivo.admActivo.fechaModificacion==null){
           
          this.srvAdmActivo.admActivo.fechaAlta= formatDate(this.srvAdmActivo.admActivo.fechaAlta, 'yyyy-MM-dd', 'en');        
          this.srvAdmActivo.admActivo.fechaModificacion= formatDate(Date.now(), 'yyyy-MM-dd', 'en');
        }  
        await this.srvAdmActivo.actualizar(this.srvAdmActivo.admActivo)
          .toPromise()
          .then(results => { 
              this.actualizarListaGcia(this.srvAdmActivo.admActivo.idAdmActivo);
              this.actualizarListaAreaNegocio(this.srvAdmActivo.admActivo.idAdmActivo);              
               })
          .catch(err => { console.log(err) });

        this.showSuccess('Activo actualizado satisfactoriamente');

      }
      
      this.displayDialog = false;      
  }

  private async actualizarListaGcia(id: number){
    await this.srvAdmActivo.eliminarActivosGcias(id)
          .toPromise()
          .then(results => { 
            this.registrarGerenciasAsociadas(id);
            
          })
          .catch(err => { console.log(err) });
  }

  private async actualizarListaAreaNegocio(id:number){
    await this.srvAdmActivo.eliminarActivosAreaNegocio(id)
          .toPromise()
          .then(results => { 
              this.registrarAreaNegocio(id);
              
             })
          .catch(err => { console.log(err) });
  }

  private async listbox(id: number) {
		let result: Iconfig_activos_gerencias[] = [];
		let arre_rela: any[] = [];		
    await this.srvAdmActivo.consultarActivosGcia(id)
          .toPromise()     
          .then(results => {
            result= results;            
            result.forEach(rela => {
              arre_rela.push(rela.idConfigGerencia);
            });            
          })
          .catch(err => { console.log('error garrafal') });		

		//recorro y filtro todas las gerencias
		this.gerencias_load = this.todasGerencias.filter(gere => {
			return arre_rela.indexOf(gere.idConfigGerencia) != -1; //<- este es el criterio de filtrado 
		});
	}
  
  edit(activoActual: Iadm_activos) {
    this.newActivo = false;
    /////////////////////////////////////////////
		this.srvAdmActivo.admActivo = {
      idAdmActivo: activoActual.idAdmActivo,
      nombre: activoActual.nombre,
      descripcion: activoActual.descripcion,
      serial: activoActual.serial,
      fechaAlta: activoActual.fechaAlta,
      fechaModificacion: activoActual.fechaModificacion,
      tipo: activoActual.tipo,
      idAdmProducto: activoActual.idAdmProducto,
      idComprasEmpresa: activoActual.idComprasEmpresa,
      IdEmpresaPropietaria: activoActual.IdEmpresaPropietaria,
      IdAreaNegocio: activoActual.IdAreaNegocio,
      IdactivoPadre: activoActual.IdactivoPadre,
      activo:activoActual.activo
  }
    /////////////////////////////////////////////
    this.areaNegocioSelected=null
    this.displayDialog = true;
		this.tituloDialogo = "Editar: " + this.srvAdmActivo.admActivo.nombre;
    this.consultarActivos(activoActual.idAdmActivo);
    this.llenarDropbox(activoActual);    
    this.listbox(activoActual.idAdmActivo);
	}

  private async llenarDropbox(activoActual: Iadm_activos){
    let areaNeg: AreaNegocioModelo[]=[];
    await this.srvAdmActivo.consultarActivosAreasNeg(activoActual.idAdmActivo)
          .toPromise() 
          .then(results => {
            areaNeg= results;
            this.areaNegocioSelected= areaNeg[0].idGenAreaNegocio;
          })
          .catch(err => { console.log(err) });
    
    this.cargarAreaNegocios();    
    this.cargarEmpresaCompras();
    this.cargarEmpresaPropietaria();    
  }

  private async registrarAreaNegocio(idActivo: number){
    
    const _areaNeg: Iconfig_activos_areas_negocios = {
      idAdmActivo: idActivo,
      idGenAreaNegocio: this.areaNegocioSelected,
      activo:1
    }

    await this.srvAdmActivo.insertarareanegocio(_areaNeg)
          .toPromise()        
          .then(results => { this.consultarActivosJoins(); })
          .catch(err => { console.log(err) });
  }

  private async registrarGerenciasAsociadas(idActivo: number){    
    await this.gerencias_load.forEach(data => {
				this.srvAdmActivo.insertaractivogerencia({
					idConfigGerencia: data.idConfigGerencia,
					idAdmActivo: idActivo,
          activo: 1 
				}).toPromise()        
        .then(results => {            
          this.consultarActivosJoins();    
        })
        .catch(err => { console.log(err) });
		});
  }

  private remove(activoActual: Iadm_activos) {
		this.confirmationService.confirm(
			{
				message: "¿Desea Eliminar el registro?",
				accept: () => {
					this.delete(activoActual);
				}
			});
	}

  private async delete(activoActual: Iadm_activos){
    await this.srvAdmActivo.eliminar(activoActual.idAdmActivo!)
    .toPromise()
			.then(results => { this.consultarActivosJoins(); })
			.catch(err => { console.log(err) });

		this.showSuccess('Activo eliminado satisfactoriamente');
  }

  onPagination(event: any) {
		this.primera_fila = event.first;
	}

  cerrar() {
		this.srvAdmActivo.admActivo = null;
		this.displayDialog = false;
	}

  private showError(errMsg: string) {
		this.messageService.clear();
		this.messageService.add({ key: 'tc', severity: 'error', summary: errMsg });
	}

  private showSuccess(successMsg: string) {
		this.messageService.clear();
		this.messageService.add({ key: 'tc', severity: 'success', summary: successMsg });
	}

  private isEmpty(obj) {
		for (var key in obj) {
			if (obj.hasOwnProperty(key))
				return false;
		}
		return true;
	}

}
