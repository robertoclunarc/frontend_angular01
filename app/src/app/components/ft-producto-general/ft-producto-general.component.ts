import { ComplementariaProducto } from './../../models/complementaria-producto';
import { RolesUsuariosService } from './../../services/roles-usuarios.service';
import { NotificacionesService } from './../../services/notificaciones.service';

import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Producto, GrupoProducto, SubGrupoProducto, TipoMedida, UnidadMedida, MaterialProducto, ColorProducto, TipoDesagregacionProducto, TipoClasificacion, SubTipoClasificacion, ProductoImagen } from 'src/app/models';
import { GruposProductoService, SubGruposProductoService, TiposMedidasService, UnidadesMedidaService, ProductosService, UserLocalStorageService, MaterialesProductoService, ColoresProductoService, TiposDesagregacionProductoService, ProductoImagenesService, ComplementariasService, AplicabilidadService, UserService } from 'src/app/services';
import { ResponsablesFuncionalesService } from "../../services/responsables-funcionales.service"
import { ResponsablesValidacionService } from "../../services/responsables-validacion.service"

import { MessageService, ConfirmationService } from 'primeng/api';
import { SelectItem } from 'primeng/api';
import { GerenciasService } from 'src/app/services/gerencias.service';
import { GerenciasModelo } from 'src/app/models/gerencias';
import { environment } from 'src/environments/environment';
import { formatDate } from '@angular/common';

import { FileUpload } from 'primeng/fileupload';
import { ResponFuncionales } from 'src/app/models/respon-funcionales';
import { ResponsablesValidacion } from 'src/app/models/respon-validacion';

@Component({
	selector: 'app-ft-producto-general',
	templateUrl: './ft-producto-general.component.html',
	styleUrls: ['./ft-producto-general.component.scss'],
	providers: [
		MessageService,
		GruposProductoService,
		SubGruposProductoService,
		TiposMedidasService,
		UnidadesMedidaService,
		ProductosService,
		MaterialesProductoService,
		ColoresProductoService,
		UserLocalStorageService,
		GerenciasService,
		TiposDesagregacionProductoService,
		ProductoImagenesService,
		ConfirmationService,
		UserService
	]
})
export class FtProductoGeneralComponent implements OnInit {

	grupos: GrupoProducto[];
	subgrupos: SubGrupoProducto[];
	tiposMedidas: TipoMedida[];
	unidadMedidas: UnidadMedida[];
	materiales: MaterialProducto[];
	colores: ColorProducto[];
	accesorios: SelectItem[];

	gerencias: GerenciasModelo[];
	gerencias_2: GerenciasModelo[] = [];
	tiposDesagregacion: TipoDesagregacionProducto[];

	producto: Producto = {};
	aprobacionAnterior: number = 0;

	idAdmProducto: number;

	rolFtGeneral = 'ROL-V-FT-PRO-GEN';              /* Rol ver ficha tecnica General         */
	rolFtComplementarias = 'ROL-V-FT-PRO-COM';      /* Rol ver ficha tecnica Complementarias */
	rolFtAplicabilidad = 'ROL-V-FT-PRO-APLIC';      /* Rol ver ficha tecnica aplicabilidad   */
	rolFtAlmacen = 'ROL-V-FT-PRO-ALM';              /* Rol ver ficha tecnica Almacen         */
	rolEditProd = 'ROL-E-COD-PRODUCTO';             /* Rol editar codigo de un producto      */
	rolAlmVal = "ROL-ALM-VERIF";                    /* Rol DATOS ALMACEN de un producto  */
	nombreValProd = "ROL-VAL-ADIC-PROD";                    /* Rol Validacion de la info del prodcuto  */
	nombreAprodProd = "ROL-APRO-CATA";                    /* Rol Aprobacion de la info del prodcuto  */
	nombrePostValidad = "ROL-POST-VAL-PROD";                    /* Rol Aprobacion de la info del prodcuto  */
	rolEnvioNotificacion = "ROL-NOTIFICACIONES-PROD";                    /* Rol Aprobacion de la info del prodcuto  */

	isDisabledCodProd: boolean = false;             /* Para uso del rol  ROL-E-COD-PRODUCTO */
	rolValidacionProd: boolean = true;
	rolAprobacionProd: boolean = true;


	verSolGeneral: boolean = true;
	verSolComplementaria: boolean = true;
	verSolAplic: boolean = true;
	verSolAlmacen: boolean = true;
	verSecAlmVal: boolean = true;
	collapsed: boolean = false;

	disabledCodigo: boolean = false;
	disabledGrupo: boolean = false;
	disabledSubGrupo: boolean = false;

	disabledUnidadMedidas: boolean;

	rolEdicion: boolean;
	rolPostValidado: boolean;

	directorioImg: string;
	sinImagen: string;

	tabIndex: number = 0;
	newProducto: boolean;

	imagenPath: string;
	verInfUser: boolean;

	productoImagenes: any[] = [];

	imagenesTemp: FileUpload = <FileUpload>{};

	showImgDialog: boolean = false;
	selectedImg: ProductoImagen = {};

	activo: number = 0;

	API_subir_archivo: string = environment.apiUrl + "subirimagenesproducto/-1";


	responsables_funcio: any[] = [];
	responsables_validacion: any[] = [];

	idUsusarioSesion: number = -1;
	idGerenciaSesion: number = -1;

	responsiveOptions: any[];
	constructor(
		private srvGrupos: GruposProductoService,
		private srvSubGrupos: SubGruposProductoService,
		private messageService: MessageService,
		private srvTiposMedida: TiposMedidasService,
		private srvUnidaMedidas: UnidadesMedidaService,
		private srvProducto: ProductosService,
		private srvMaterial: MaterialesProductoService,
		private srvColor: ColoresProductoService,
		private router: Router,
		private actRouter: ActivatedRoute,
		private rolesUsr: UserLocalStorageService,
		private srvGerencias: GerenciasService,
		private srvTiposDesagregacion: TiposDesagregacionProductoService,
		private srvProductoImagenes: ProductoImagenesService,
		private svrComplementarias: ComplementariasService,
		private svrAplicabilidad: AplicabilidadService,
		private svrConfirmacion: ConfirmationService,
		private svrUsuarios: UserService,
		private svrRespoFuncio: ResponsablesFuncionalesService,
		private srvRespoValida: ResponsablesValidacionService,
		private svrNotificaciones: NotificacionesService,
		private svrRoles: RolesUsuariosService
	) {
		this.responsiveOptions = [
			{
				breakpoint: '1024px',
				numVisible: 3,
				numScroll: 3
			},
			{
				breakpoint: '768px',
				numVisible: 2,
				numScroll: 2
			},
			{
				breakpoint: '560px',
				numVisible: 1,
				numScroll: 1
			}
		];
	}


	ngOnInit() {

		this.directorioImg = environment.dirImgsSubidas + 'fotoproductos/';
		this.sinImagen = 'sinImagen.png';

		this.disabledSubGrupo = true;
		this.disabledUnidadMedidas = true;

		this.producto.adicionales = [];
		this.producto.complementarias = [];
		this.producto.aplicabilidad = [];
		this.idAdmProducto = this.actRouter.snapshot.params.idAdmProducto;

		this.verificarRoles()

		// Carga Inicial de Informacion necesaria para el producto
		// 
		this.cargaInicial();

		// Se captura el rol de ver, nuevo y edicion de un producto
		let rolProducto = (this.actRouter.snapshot.params.rol == "true") ? true : false;
		this.rolEdicion = rolProducto;

		this.rolAprobacionProd = ((JSON.parse(localStorage.getItem('roles')).find(rol => rol.codigo == this.nombreAprodProd)) != null ? false : true);
		this.rolPostValidado = ((JSON.parse(localStorage.getItem('roles')).find(rol => rol.codigo == this.nombrePostValidad)) != null ? true : false);
		this.rolValidacionProd = ((JSON.parse(localStorage.getItem('roles')).find(rol => rol.codigo == this.nombreValProd)) != null ? false : true);

		this.disabledCodigo = ((JSON.parse(localStorage.getItem('roles')).find(rol => rol.codigo == this.rolEditProd)) != null ? false : true);
		this.disabledGrupo = this.disabledCodigo;
		this.disabledSubGrupo = this.disabledCodigo;
		//this.disabledUnidadMedidas = this.disabledCodigo;

		//this.disabledSubGrupo = this.rolEdicion
		//this.disabledUnidadMedidas = this.disabledSubGrupo;

		if (this.idAdmProducto == -1) {
			//this.disabledCodigo = false; 
			//this.disabledGrupo = false;
			//this.disabledSubGrupo = false;
			//this.disabledUnidadMedidas = this.disabledCodigo;
			this.verSolComplementaria = true;
			this.verSolAplic = true;
			this.verSolAlmacen = true;
			this.verSecAlmVal = true;
			this.setearValoresProducto(this.idAdmProducto, 150, 140, this.sinImagen);
			this.imagenPath = this.directorioImg + this.producto.imagenPath;
			this.verInfUser = true;
			this.newProducto = true;
			this.producto.activo = 1;
			this.productoImagenes = [];
		}
		else {
			this.verInfUser = false;
			this.newProducto = false;
			this.consultarDatosProducto(this.idAdmProducto);
			this.consultarProductoImagenes(this.idAdmProducto);
		}

		this.idUsusarioSesion = JSON.parse(sessionStorage.getItem('currentUser')).idSegUsuario;
		this.idGerenciaSesion = JSON.parse(sessionStorage.getItem('currentUser')).idGerencia;

	}

	selectImg(img: any) {
		this.selectedImg = {};
		this.showImgDialog = true;
		//console.log(img);
		this.selectedImg.idAdmImgProducto = img.id;
		this.selectedImg.imagePath = img.source;
	}

	cerrarImgDialog() {
		this.showImgDialog = false;
	}

	validadEntradas() {
		//*****validar que nos sea servicio */
		//console.log("tiene: " + this.producto.esservicio);
		if (this.producto.esservicio != true) {
			if (!this.producto.idAdmTipoMedida) {
				this.messageService.clear();
				this.messageService.add({ key: 'tc', severity: 'error', summary: 'Debe seleccionar el tipo de medida de un producto' });
				return false;
			}
			if (!this.producto.idAdmUnidadMedida) {
				this.messageService.clear();
				this.messageService.add({ key: 'tc', severity: 'error', summary: 'Debe seleccionar la unidad de medida de un producto' });
				return false;
			}
			if (!this.producto.idAdmMaterialProducto) {
				this.messageService.clear();
				this.messageService.add({ key: 'tc', severity: 'error', summary: 'Debe seleccionar tipo de material de un producto' });
				return false;
			}
			if (!this.producto.idAdmColorProducto) {
				this.messageService.clear();
				this.messageService.add({ key: 'tc', severity: 'error', summary: 'Debe seleccionar el color del producto' });
				return false;

			}
		}
		return true;
	}

	consultarProductoImagenes(idAdmProducto: number) {
		this.srvProductoImagenes.consultarPorId(idAdmProducto)
			.toPromise()
			.then(results => {
				//this.productoImagenes = results;
				this.productoImagenes = [];
				results.forEach(prodImg => {
					let imgPath = this.directorioImg + prodImg.imagePath;
					let img = {
						source: imgPath, alt: prodImg.titulo, title: prodImg.titulo,
						id: prodImg.idAdmImgProducto, thumbnail: imgPath
					};
					this.productoImagenes.push(img);
				})

			})
			.catch(err => { console.log(err) });
	}

	consultarDatosProducto(idAdmProducto: number) {

		/* Datos del Producto */
		this.srvProducto.consultarPorId(idAdmProducto)
			.toPromise()
			.then(results => {
				this.producto = results[0];
				this.producto.activo = (this.producto.activo == 1 ? true : false);
				this.producto.esservicio = (this.producto.esservicio == 1 ? true : false);
				//this.producto.validado = (this.producto.validado == 1 ? true : false);
				this.aprobacionAnterior = this.producto.aprobado;
				//this.producto.aprobadoAlmacen = (this.producto.aprobadoAlmacen == 1 ? true : false);
				//this.producto.aprobado = (this.producto.aprobado == 1 ? true : false);

				/* Datos Adicionales del Producto */
				this.consultarDatosAdicionales(idAdmProducto);

				/* Datos Complementarios del producto */
				this.consultarDatosComplementarios(idAdmProducto);

				/* Datos aplicabilidad del producto */
				this.consultarAplicabilidad(idAdmProducto);
				return true;
			})
			.then(result => {
				let gerenciaActual = JSON.parse(sessionStorage.getItem('currentUser')).idGerencia;
				this.svrUsuarios.getUserById(this.producto.idUsuarioCreacion).subscribe(data => {
					let gerenciaCreacion = data[0].idGerencia;
					//console.log("gerencia creacion: ", gerenciaCreacion);
					//console.log("gerencia actual: ", gerenciaActual);
					this.rolValidacionProd = !((JSON.parse(localStorage.getItem('roles')).find(rol => rol.codigo == this.nombreValProd)) != null ? true : false
						&& ((gerenciaActual != gerenciaCreacion) ? true : false));
					//console.log(this.rolValidacionProd);
					//console.log("gerencia: ", (gerenciaActual != gerenciaCreacion) ? true : false);
					//console.log("roles: ", JSON.parse(localStorage.getItem('roles')));
					//console.log("valida: ", (JSON.parse(localStorage.getItem('roles')).find(rol => rol.codigo == this.nombreValProd)) != null ? true : false);

				});
				return true;
			})
			.then(result => {
				this.srvGerencias.getTodos()
					.then(results => {
						this.gerencias = results;
						//console.log("gerecias: ", this.gerencias);
						this.gerencias_2 = Object.assign([], results);
					});

				return true;
			})
			.then(result => {
				if (this.producto.idAdmProducto != null) {
					this.svrRespoFuncio.getTodosPorProducto(this.producto.idAdmProducto)
						.then(data => {
							this.responsables_funcio = [];
							data.forEach(respo => {
								this.responsables_funcio.push(respo.idConfigGerencia);
							});

						})
						.then(result => {
							if (this.responsables_funcio.length > 0) {
								let i = 0;
								//console.log("gerecias aquis: ", this.gerencias);
								this.gerencias.forEach(gerencia => {
									gerencia.ordenCalcu = (gerencia.idConfigGerencia == this.responsables_funcio.find(respo => { return respo == gerencia.idConfigGerencia; })) ? 1 : 0;
								});
							}
							this.gerencias.sort((a, b) => b.ordenCalcu - a.ordenCalcu);
							//this.gerencias_2 = this.gerencias;
						});
				}

			})
			/*.then(result => {
				if (this.responsables_funcio.length > 0) {
					let i = 0;
					this.gerencias.forEach(gerencia => {
						gerencia.ordenCalcu = gerencia.idConfigGerencia == this.responsables_funcio.find(respo => { return respo = gerencia.idConfigGerencia; })
					});
				}
				console.log("Gerencias: ", this.gerencias);
				return true
			})*/
			.then(result => {
				if (this.producto.idAdmProducto != null) {
					this.srvRespoValida.getTodosPorProducto(this.producto.idAdmProducto)
						.then(data => {
							data.forEach(respo => {
								this.responsables_validacion.push(respo.idConfigGerencia);
							});
							//console.log("Entro", this.responsables_funcio);
						})
						.then(result => {
							if (this.responsables_validacion.length > 0) {

								this.gerencias_2.forEach(gerencia => {
									gerencia.ordenCalcu = 0;
									gerencia.ordenCalcu = (gerencia.idConfigGerencia == this.responsables_validacion.find(respo => { return respo == gerencia.idConfigGerencia; })) ? 1 : 0;
								});
							}
							this.gerencias_2.sort((a, b) => b.ordenCalcu - a.ordenCalcu);
						});
				}
			})
			.catch(err => { console.log(err) });

	}

	consultarDatosAdicionales(idAdmProducto: number) {
		this.srvProducto.consultarDatosAdicionales(idAdmProducto)
			.toPromise()
			.then(results => { this.producto.adicionales = results; })
			.catch(err => { console.log(err) });
	}

	async consultarDatosComplementarios(idAdmProducto: number) {
		//const datos : ComplementariaProducto[] =  [...await this.srvProducto.consultarComplementarias(idAdmProducto).toPromise()];

		this.srvProducto.consultarComplementarias(idAdmProducto)
			.toPromise()
			.then(results => { this.producto.complementarias = results; })
			.catch(err => { console.log(err) });
	}

	consultarAplicabilidad(idAdmProducto: number) {
		this.srvProducto.consultarAplicabilidad(idAdmProducto)
			.toPromise()
			.then(results => { this.producto.aplicabilidad = results; })
			.catch(err => { console.log(err) });
	}

	setearValoresProducto(idAdmProducto: number, imgHeight: number, imgWidth: number, imgPath: string) {
		this.producto = {};
		this.producto.idAdmProducto = idAdmProducto
		this.producto.imagenPath = imgPath;
		this.producto.adicionales = [];
		this.producto.complementarias = [];
		this.responsables_funcio = [];
		this.responsables_validacion = [];
	}

	verificarRoles() {
		this.verSolGeneral = this.rolesUsr.buscarRolPorCodigo(this.rolFtGeneral).length > 0 ? false : true;
		this.verSolComplementaria = this.rolesUsr.buscarRolPorCodigo(this.rolFtComplementarias).length > 0 ? false : true;
		this.verSolAplic = this.rolesUsr.buscarRolPorCodigo(this.rolFtAplicabilidad).length > 0 ? false : true;
		this.verSolAlmacen = this.rolesUsr.buscarRolPorCodigo(this.rolFtAlmacen).length > 0 ? false : true;
		this.isDisabledCodProd = this.rolesUsr.buscarRolPorCodigo(this.rolEditProd).length > 0 ? false : true;
		this.verSecAlmVal = this.rolesUsr.buscarRolPorCodigo(this.rolAlmVal).length > 0 ? false : true;

	}

	cargaInicial() {

		/* Grupo de productos */
		this.srvGrupos.consultarTodos()
			.toPromise()
			.then(results => { this.grupos = results; })
			.catch(err => { console.log(err) });

		/* SubGrupos de productos */
		this.srvSubGrupos.consultarTodos()
			.toPromise()
			.then(results => { this.subgrupos = results; })
			.catch(err => { console.log(err) });

		/* Tipos de medidas para un producto */
		this.srvTiposMedida.consultarTodos()
			.toPromise()
			.then(results => { this.tiposMedidas = results; })
			.catch(err => { console.log(err) });

		/* Unidades de medidas de un producto */
		this.srvUnidaMedidas.consultarTodos()
			.toPromise()
			.then(results => { this.unidadMedidas = results; })
			.catch(err => { console.log(err) });

		/* Tipo de Material de un producto */
		this.srvMaterial.consultarTodos()
			.toPromise()
			.then(results => { this.materiales = results; })
			.catch(err => { console.log(err) });

		/* Color de un producto */
		this.srvColor.consultarTodos()
			.toPromise()
			.then(results => { this.colores = results; })
			.catch(err => { console.log(err) });

		/* Gerencias */
		/*	this.srvGerencias.getTodos()
				.then(results => {
					this.gerencias = results; //this.gerencias.forEach(gerencia => {
					//this.gerencias_lista.push({label:gerencia.nombre, value:gerencia.idConfigGerencia});})
				})
				.catch(err => { console.log(err) });*/

		/* Tipos de desagregacion de un producto */
		this.srvTiposDesagregacion.consultarTodos()
			.toPromise()
			.then(results => { this.tiposDesagregacion = results; })
			.catch(err => { console.log(err) });

		this.accesorios = [
			{ label: 'No', value: '0' },
			{ label: 'Si', value: '1' }
		];

	}

	onTabChange(e) {
		this.tabIndex = e.index;
	}

	async cuandoSelecciona(event, archis: FileUpload) {
		this.imagenesTemp = archis;
		for (let file of event.files) {
		
			// let myRegex=/^[^\\/:\*\?"<>\|]+$/;¨
			let reg = /([a-zA-Z0-9\s_\\.\-\(\):])+(.jpg|.png)$/i
			if (!reg.test(file.name)) {
				//console.log(file.name.indexOf("#"));
				this.messageService.clear();
				this.messageService.add({
					key: 'tc', severity: 'error', summary: `Nombre del archivo NO PERMITIDO. Ejemplo permitido: lampara-3.jpg`,
					life: 5000
				});
				archis.files.splice(archis.files.length - 1, 1);
				return false;
			}
			if ((file.name.length > 120)) {
				this.messageService.clear();
				this.messageService.add({
					key: 'tc', severity: 'error', summary: 'Nombre del archivo Excede los 120 caracteres',
					life: 5000
				});
				archis.files.splice(archis.files.length - 1, 1);
				return false;
			}
		}
	}

	async nuevoProducto(imgs: FileUpload) {

		switch (this.tabIndex) {
			case 0:
				/* 	if (this.producto.existenciaMinima == null) {
						this.messageService.clear();
						this.messageService.add({ key: 'tc', severity: 'error', summary: 'Debe Ingresar la existencia minima' });
						return false;
					} */
				if (this.producto.nombre == null || this.producto.nombre.trim().length == 0) {
					this.messageService.clear();
					this.messageService.add({ key: 'tc', severity: 'error', summary: 'Debe ingresar el nombre del producto o servicio' });
					return false;
				}

				if (this.producto.uso == null || this.producto.uso.length == 0) {
					this.messageService.clear();
					this.messageService.add({ key: 'tc', severity: 'error', summary: 'Debe ingresar el uso del producto o servicio' });
					return false;
				}

				if (!this.imagenesTemp.files) {
					this.messageService.clear();
					this.messageService.add({ key: 'tc', severity: 'error', summary: 'Debe ingresar al menos 1 imagen' });
					return false;
				}


				//if (this.validadEntradas()) {
				this.producto.activo = 1;
				this.producto.aprobado = 0;
				this.producto.validado = 0;
				this.producto.esservicio = (this.producto.esservicio == true ? 1 : 0);
				this.producto.fechaModificacion = formatDate(new Date(), "yyyy-MM-dd", "en-US");
				this.producto.idUsuarioModificacion = JSON.parse(sessionStorage.getItem('currentUser')).idSegUsuario;
				//this.producto. = formatDate(new Date(), "yyyy-MM-dd", "en-US");
				this.producto.idUsuarioCreacion = JSON.parse(sessionStorage.getItem('currentUser')).idSegUsuario;
				this.producto.idGerenciaCreacion = JSON.parse(sessionStorage.getItem('currentUser')).idGerencia;
				//console.log(this.producto.usuarioModificacion);
				//return false;
				this.producto.codigo = (!this.producto.codigo ? "" : this.producto.codigo);
				this.producto.idAdmGrupoProducto = (!this.producto.idAdmGrupoProducto ? -1 : this.producto.idAdmGrupoProducto);
				this.producto.idAdmSubGrupoProducto = (!this.producto.idAdmSubGrupoProducto ? -1 : this.producto.idAdmSubGrupoProducto);
				let data = await this.srvProducto.registrar(this.producto);
				this.producto.idAdmProducto = data["ObjectId"];
				this.idAdmProducto = data["ObjectId"];
				if (this.producto.adicionales.length > 0) {
					this.producto.adicionales.forEach(adicional => {
						this.svrComplementarias.registrar(adicional);
					});
				}
				if (this.producto.complementarias.length > 0) {
					this.producto.complementarias.forEach(async comple => {
						await this.svrComplementarias.registrar(comple);
					});
				}
				if (this.producto.aplicabilidad) {
					this.producto.aplicabilidad.forEach(aplicable => {
						this.svrAplicabilidad.registrar(aplicable);
					});
				}
				if (this.imagenesTemp) {
					if (this.imagenesTemp.files.length > 0) {

						for (let index = 0; index < this.imagenesTemp.files.length; index++) {
							let data = {
								idAdmProducto: this.producto.idAdmProducto,
								imagePath: this.imagenesTemp.files[index].name,
								titulo: this.imagenesTemp.files[index].name
							}
							//console.log(data);
							//const element = this.imagenesTemp.files[index];
							await this.srvProductoImagenes.insertar(data).then((result)=>{
								this.messageService.clear();
								this.messageService.add({ key: 'tc2', severity: 'info', summary: `Imagen: ${this.imagenesTemp.files[index].name} insertada correctamente` });
							});
						}

						this.imagenesTemp.upload();
						this.verInfUser = false;
						this.newProducto = false;
						this.consultarDatosProducto(this.idAdmProducto);
						this.consultarProductoImagenes(this.idAdmProducto);
						this.messageService.clear();
						this.messageService.add({ key: 'tc', severity: 'success', summary: 'Producto Ingresado' });
					}
				}
				if (this.responsables_funcio.length > 0) {
					let respodata: ResponFuncionales = {};
					respodata.idAdmProducto = this.idAdmProducto;
					this.responsables_funcio.forEach(respo => {
						respodata.idConfigGerencia = respo;
						this.svrRespoFuncio.insertarRespoFuncional(respodata).then();
					});
				}
				//}
				//this.disabledSubGrupo = false;
				//this.disabledUnidadMedidas = false;
				this.consultarDatosProducto(this.idAdmProducto);
				this.consultarProductoImagenes(this.idAdmProducto);
				this.verSolComplementaria = true;
				this.verSolAplic = true;
				break;
			case 1:
				break;
			case 2:
				break;
		}
	}


	volver() {
		this.router.navigate(["fichatecnica"]);
	}

	volverGeneral() {
		this.activo = 1;
	}

	handleChange(e, produc) {
		produc.activo = (e.checked == true ? 1 : 0);

	}

	eliminarImg(imagenSelect: any) {
		this.svrConfirmacion.confirm(
			{
				message: "¿Desea eliminar la foto del producto?",
				accept: () => {
					//console.log(imagenSelect.idAdmImgProducto); return false;
					this.srvProductoImagenes.eliminar(imagenSelect.idAdmImgProducto).then(() => {
						this.showImgDialog = false;
						this.messageService.clear();
						this.messageService.add({ key: 'tc', severity: 'success', summary: 'Foto Eliminada con exito!' });
						this.consultarProductoImagenes(this.idAdmProducto);
					});
				}
			});
		//console.log(this.producto.idAdmProducto);
	}

	confirmaEditar() {
		this.svrConfirmacion.confirm(
			{
				message: "¿Desea Modificar el producto?",
				accept: () => {
					this.edit();
				}
			});
	}

	seleccionResFuncio($event) {
		//console.log("Selected ", this.responsables_funcio);
	}

	async aprobarInfoProducto() {
		//console.log("Selected ", this.responsables_funcio);
		//return false;
		this.svrConfirmacion.confirm(
			{
				message: "¿Desea Aprobar el producto?",
				accept: () => {
					this.producto.aprobado = 1;
					if (this.producto.aprobado == 1 && this.aprobacionAnterior == 0) {
						this.producto.fechaAprobacion = formatDate(new Date(), "yyyy-MM-dd", "en-US");
						this.producto.idUsuarioValidacion = JSON.parse(sessionStorage.getItem('currentUser')).idSegUsuario;
						this.producto.idGerenciaAprobacion = JSON.parse(sessionStorage.getItem('currentUser')).idGerencia;

						this.producto.activo = (this.producto.activo == true ? 1 : 0);
						this.producto.esservicio = (this.producto.esservicio == true ? 1 : 0);

						this.srvProducto.actualizar(this.producto, 4)
							.then(data => {
								this.verInfUser = false;
								this.newProducto = false;
								this.consultarDatosProducto(this.idAdmProducto);
								this.consultarProductoImagenes(this.idAdmProducto);
								this.messageService.clear();
								this.messageService.add({ key: 'tc', severity: 'success', summary: 'Producto Aprobado' });
								return true;
							});
					}
				}
			});

	}

	validarInfoProducto() {
		this.svrConfirmacion.confirm(
			{
				message: "¿Desea Validar la información del producto?",
				accept: () => {
					this.producto.validado = 1
					this.producto.fechaValInfo = formatDate(new Date(), "yyyy-MM-dd", "en-US");
					this.producto.idUsuarioValInfo = JSON.parse(sessionStorage.getItem('currentUser')).idSegUsuario;
					this.producto.idGerenciaValidacion = JSON.parse(sessionStorage.getItem('currentUser')).idGerencia;

					this.producto.activo = (this.producto.activo == true ? 1 : 0);
					this.producto.esservicio = (this.producto.esservicio == true ? 1 : 0);

					this.srvProducto.actualizar(this.producto, 5)
						.then(data => {
							this.verInfUser = false;
							this.newProducto = false;
							this.consultarDatosProducto(this.idAdmProducto);
							this.consultarProductoImagenes(this.idAdmProducto);
							this.messageService.clear();
							this.messageService.add({ key: 'tc', severity: 'success', summary: 'Producto Validado' });
							return true;
						});
				}

			});
	}

	edit() {

		this.producto.activo = (this.producto.activo == true ? 1 : 0);
		this.producto.esservicio = (this.producto.esservicio == true ? 1 : 0);
		this.producto.aprobado = 0;
		this.producto.validado = 0;

		this.producto.fechaModificacion = formatDate(new Date(), "yyyy-MM-dd", "en-US");
		this.producto.idUsuarioModificacion = JSON.parse(sessionStorage.getItem('currentUser')).idSegUsuario;
		this.producto.idGerenciaModificacion = JSON.parse(sessionStorage.getItem('currentUser')).idGerencia;


		this.srvProducto.actualizar(this.producto, 2)
			.then(data => {
				return true;
			})
			.then(data => {
				this.producto.adicionales.forEach(adicional => {
					//console.log(adicional);
					if (adicional.esNuevo == true) {
						this.svrComplementarias.registrar(adicional);
					} else {
						this.svrComplementarias.actualizar(adicional);
					}
				});
				return true;
			})
			.then(data => {
				this.producto.complementarias.forEach(comple => {
					if (comple.esNuevo == true) {
						this.svrComplementarias.registrar(comple);
					} else {
						this.svrComplementarias.actualizar(comple);
					}

				});
				return true;
			})
			.then(result => {
				this.producto.aplicabilidad.forEach(aplicable => {
					if (aplicable.esNuevo == true) {
						//console.log("Nuevo aplicabilidad: ", aplicable);
						this.svrAplicabilidad.registrar(aplicable);
					} else {
						//console.log("Actualizar aplica: ", aplicable);
						this.svrAplicabilidad.actualizar(aplicable);
					}

				});
				return true;
			})
			.then(result => {
				if (this.imagenesTemp) {
					if (this.imagenesTemp.files != undefined) {
						this.imagenesTemp.files.forEach(img => {
							let data = {
								idAdmProducto: this.producto.idAdmProducto,
								imagePath: img.name,
								titulo: img.name
							}
							//console.log(data);
							//return false;
							this.srvProductoImagenes.insertar(data).then(result => {
								this.imagenesTemp.upload();
								this.messageService.clear();
								this.messageService.add({ key: 'tc2', severity: 'info', summary: `Imagen: ${img.name} insertada correctamente` });
							});
						});
					}
				}
				return true;
			})
			.then(result => {
				if (this.responsables_funcio.length > 0) {
					this.svrRespoFuncio.delPorProducto(this.producto.idAdmProducto)
						.then(data => {
							let respodata: ResponFuncionales = {};
							respodata.idAdmProducto = this.producto.idAdmProducto;
							this.responsables_funcio.forEach(respo => {
								respodata.idConfigGerencia = respo;
								this.svrRespoFuncio.insertarRespoFuncional(respodata).then();
							});

						});
				}
				return true;
			})
			.then(result => {
				if (this.responsables_validacion.length > 0) {
					this.srvRespoValida.delPorProducto(this.producto.idAdmProducto)
						.then(data => {
							let respodata: ResponsablesValidacion = {};
							respodata.idAdmProducto = this.producto.idAdmProducto;
							this.responsables_validacion.forEach(respo => {
								respodata.idConfigGerencia = respo;
								this.srvRespoValida.insertarRespoValidacion(respodata).then();
							});

						});
				}
			})
			.then(result => {
				this.verInfUser = false;
				this.newProducto = false;
				this.consultarDatosProducto(this.idAdmProducto);
				this.consultarProductoImagenes(this.idAdmProducto);
				this.messageService.clear();
				this.messageService.add({ key: 'tc', severity: 'success', summary: 'Producto actualizado' });
				this.svrRoles.getUsuariosPorRol(this.rolEnvioNotificacion).then((usuario) => {
					usuario.forEach(async ({ idSegUsuario }) => {
						await this.svrNotificaciones.enviarNotificacionPorUsuario(`Producto: ${this.producto.codigo} fue modificado`, this.idUsusarioSesion, idSegUsuario).toPromise();
					});
				})

			});
		this.productoImagenes = [];

	}


	onChangeGrupo(event) {

		this.disabledSubGrupo = false;
		let idAdmGrupoProducto = event.value;

		this.srvGrupos.consultarSubGruposPorIdAdmGrupo(idAdmGrupoProducto)
			.toPromise()
			.then(results => { this.subgrupos = results; })
			.catch(err => { console.log(err) });
	}

	onChangeTipoMedida(event) {
		this.disabledUnidadMedidas = false;
		this.srvTiposMedida.consultarUnidadesMedidasPoridAdmTipoMedida(event.value)
			.toPromise()
			.then(results => { this.unidadMedidas = results; })
			.catch(err => { console.log(err) });
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
