import { FiltroGeneralProd } from './../../models/filtro-general-prod';
import { FiltroProductoGactual } from './../../models/filtro-producto-gactual';
import { Component, OnInit } from '@angular/core';
import { Producto } from '../../models';
import { ParametrosService, ProductosService, UserLocalStorageService } from 'src/app/services';

import { ConfirmationService, MessageService } from 'primeng/api';
import { Router } from '@angular/router';

@Component({
    selector: 'app-lista-productos',
    templateUrl: './lista-productos.component.html',
    styleUrls: ['./lista-productos.component.scss'],
    providers: [ConfirmationService, MessageService, ProductosService, UserLocalStorageService],
})
export class ListaProductosComponent implements OnInit {
    productos: Producto[];
    productosTemp: Producto[];
    cols: any[];

    nuevoProducto: boolean = false;
    editarProducto: boolean = false;
    verProducto: boolean = false;

    codRolNuevoProducto = 'ROL-N-PRODUCTO';
    codRolEditarProducto = 'ROL-E-PRODUCTO';

    rolUsuario: boolean = false;

    checkedAprobados: boolean = false;
    checkedNoAprobados: boolean = false;
    checkedHabilitados: boolean = false;
    checkedValidados: boolean = false;
    checkedNoValidados: boolean = false;
    checkedCreadas: boolean = false;
    checkedAprobadasGerenciaActual: boolean = false;
    checkedModificados: boolean = false;

    criterioBusqueda: string = '';
    filtroGerenActual: FiltroProductoGactual = {};
    filtroGenerales: FiltroGeneralProd = {};

    idUsuarioSesion: number = -1;
    idGerenciaSesion: number = -1;

    verTodosTemp: number = -1;

    constructor(
        private productoService: ProductosService,
        private confirmationService: ConfirmationService,
        private messageService: MessageService,
        private router: Router,
        private rolesUsr: UserLocalStorageService,
        private srvParametros: ParametrosService,
    ) {}

    async ngOnInit() {
        this.nuevoProducto = this.rolesUsr.buscarRolPorCodigo(this.codRolNuevoProducto).length > 0 ? true : false;
        this.editarProducto = this.rolesUsr.buscarRolPorCodigo(this.codRolEditarProducto).length > 0 ? true : false;
        this.idUsuarioSesion = JSON.parse(sessionStorage.getItem('currentUser')).idSegUsuario;
        this.idGerenciaSesion = JSON.parse(sessionStorage.getItem('currentUser')).idGerencia;
        this.verProducto = true;
        // console.log("filtro", JSON.parse(sessionStorage.getItem('productos-filtro')));

        this.criterioBusqueda = !JSON.parse(sessionStorage.getItem('productos-filtro'))?.filters
            ? ``
            : JSON.parse(sessionStorage.getItem('productos-filtro')).filters.global.value;
        this.filtroGerenActual = !JSON.parse(sessionStorage.getItem('filtro-gactual'))
            ? {}
            : JSON.parse(sessionStorage.getItem('filtro-gactual'));
        this.filtroGenerales = !JSON.parse(sessionStorage.getItem('filtro-generales'))
            ? {}
            : JSON.parse(sessionStorage.getItem('filtro-generales'));

        this.checkedCreadas = this.filtroGerenActual.creadas ? JSON.parse(this.filtroGerenActual.creadas) : false;
        this.checkedAprobadasGerenciaActual = this.filtroGerenActual.aprobadas
            ? JSON.parse(this.filtroGerenActual.aprobadas)
            : false;
        this.checkedModificados = this.filtroGerenActual.modificadas
            ? JSON.parse(this.filtroGerenActual.modificadas)
            : false;

        this.checkedValidados = this.filtroGenerales.validado ? JSON.parse(this.filtroGenerales.validado) : false;
        this.checkedNoValidados = this.filtroGenerales.novalidado ? JSON.parse(this.filtroGenerales.novalidado) : false;
        this.checkedAprobados = this.filtroGenerales.aprobado ? JSON.parse(this.filtroGenerales.aprobado) : false;
        this.checkedNoAprobados = this.filtroGenerales.noaprobado ? JSON.parse(this.filtroGenerales.noaprobado) : false;

        // if (this.filtroGerenActual?.creadas) {
        //     this.checkedCreadas = JSON.parse(this.filtroGerenActual?.creadas);
        // }

        // if (this.filtroGerenActual?.aprobadas) {
        //     this.checkedAprobadasGerenciaActual = JSON.parse(this.filtroGerenActual?.aprobadas);
        // }

        // console.log('filtro-gactual', JSON.parse(sessionStorage.getItem('filtro-gactual')));

        this.verTodosTemp = (await this.srvParametros.getParametros().toPromise())[0].verTodosProductos;
        this.productos = this.productosTemp = [...(await this.productoService.consultarTodos().toPromise())];
        this.filtroGeneral(null);

        // this.productoService.consultarTodos().subscribe(
        //     (productos) => {
        //         this.productos = productos;
        //         this.productosTemp = productos;

        //         if (this.verTodosTemp == 0) {
        //             if (this.idGerenciaSesion == 7 || this.idGerenciaSesion == 12) {
        //                 this.productos = this.productos.filter(
        //                     (producto) =>
        //                         producto.idGerenciaCreacion == 7 ||
        //                         producto.idGerenciaCreacion == 12 ||
        //                         producto.idGerenciaModificacion == 7 ||
        //                         producto.idGerenciaModificacion == 12 ||
        //                         producto.idGerenciaAprobacion == 7 ||
        //                         producto.idGerenciaAprobacion == 12,
        //                 );
        //                 this.productosTemp = this.productos;
        //             }

        //             if (this.idGerenciaSesion == 2 || this.idGerenciaSesion == 8) {
        //                 this.productos = this.productos.filter(
        //                     (producto) =>
        //                         producto.idGerenciaCreacion == 2 ||
        //                         producto.idGerenciaCreacion == 8 ||
        //                         producto.idGerenciaModificacion == 2 ||
        //                         producto.idGerenciaModificacion == 8 ||
        //                         producto.idGerenciaAprobacion == 2 ||
        //                         producto.idGerenciaAprobacion == 8,
        //                 );
        //                 this.productosTemp = this.productos;
        //             }
        //         }
        // 		this.filtroGeneral(null);

        //     },
        //     (error) => this.showError(error),
        // );

        this.cols = [
            { field: 'codigo', header: 'Codigo', width: '15%', display: 'true' },
            { field: 'nombre', header: 'Nombre', width: '30%', display: 'true' },
            { field: 'grupo', header: 'Grupo', width: '20%', display: 'true' },
            { field: 'activo', header: 'Estatus', width: '15%', display: 'true' },
            { field: 'uso', header: 'uso', width: '15%', display: 'none' },
            { field: 'subgrupo', header: 'SubGrupo', width: '20%', display: 'none' },
            { field: 'usuarioModificacion', header: 'usuarioModificacion', width: '0%', display: 'none' },
        ];
    }

    //GENERAL ********
    onChanceAprobados(event) {
        this.productos = this.checkedAprobados
            ? this.productosTemp.filter((producto) => producto.aprobado == 1)
            : this.productosTemp.filter((producto) => {
                  return producto.aprobado == 0 || producto.aprobado == 1;
              });
    }

    filtroGeneral(event) {
        this.productos = this.productosTemp;

        this.filtroGenerales.aprobado = 'false';
        this.filtroGenerales.noaprobado = 'false';
        this.filtroGenerales.validado = 'false';
        this.filtroGenerales.novalidado = 'false';
        if (this.checkedNoAprobados) {
            this.productos = this.productos.filter((producto) => +producto.aprobado === 0);
            this.filtroGenerales.noaprobado = 'true';
        }
        if (this.checkedAprobados) {
            this.productos = this.productos.filter((producto) => +producto.aprobado === 1);
            this.filtroGenerales.aprobado = 'true';
        }
        if (this.checkedValidados) {
            this.productos = this.productos.filter((producto) => +producto.validado === 1);
            this.filtroGenerales.validado = 'true';
        }
        if (this.checkedNoValidados) {
            this.productos = this.productos.filter((producto) => +producto.validado === 0);
        }
        sessionStorage.setItem('filtro-generales', JSON.stringify(this.filtroGenerales));

        //*****Gerencia Actual
        this.filtroGerenActual.creadas = 'false';
        this.filtroGerenActual.aprobadas = 'false';
        this.filtroGerenActual.modificadas = 'false';
        if (this.checkedCreadas) {
            this.productos = this.productos.filter(
                (producto) => +producto.idGerenciaCreacion === this.idGerenciaSesion,
            );
            this.filtroGerenActual.creadas = 'true';
        }
        if (this.checkedAprobadasGerenciaActual) {
            this.productos = this.productos.filter(
                (producto) => producto.idGerenciaAprobacion == this.idGerenciaSesion,
            );
            this.filtroGerenActual.aprobadas = 'true';
        }
        if (this.checkedModificados) {
            this.productos = this.productos.filter(
                (producto) => producto.idGerenciaModificacion == this.idGerenciaSesion,
            );
            this.filtroGerenActual.modificadas = 'true';
        }
        sessionStorage.setItem('filtro-gactual', JSON.stringify(this.filtroGerenActual));
    }

    onChanceNOAprobados(event) {
        //let filter = this.checkedNoAprobados ? 0 : false;
        //this.productos = this.productosTemp;
        /* this.productos = (this.checkedNoAprobados ? this.productosTemp.filter(producto => producto.aprobado == 0) :
			this.productosTemp.filter(producto => { return producto.aprobado == 0 || producto.aprobado == 1 })); */
        this.productos = this.checkedNoAprobados
            ? this.productosTemp.filter((producto) => producto.aprobado == 0)
            : this.productosTemp.filter((producto) => {
                  return producto.aprobado == 0 || producto.aprobado == 1;
              });
    }
    onChanceValidados(event) {
        this.productos = this.productosTemp;
        this.productos = this.checkedValidados
            ? this.productosTemp.filter((producto) => producto.validado == 1)
            : this.productosTemp.filter((producto) => {
                  return producto.validado == 0 || producto.validado == 1;
              });
    }
    onChanceNoValidados(event) {
        this.productos = this.checkedNoValidados
            ? this.productosTemp.filter((producto) => producto.validado == 0)
            : this.productosTemp.filter((producto) => {
                  return producto.validado == 0 || producto.validado == 1;
              });
    }
    // ******************************************************************

    onChanceHabilitados(event) {
        //let filter = this.checkedHabilitados ? 0 : 1;
        this.productos = this.productosTemp;
        this.productos = this.checkedHabilitados
            ? this.productosTemp.filter((producto) => producto.activo == 0)
            : this.productosTemp.filter((producto) => {
                  return producto.activo == 0 || producto.activo == 1;
              });
    }

    onChanceCreadas(event) {
        //let filter = this.checkedHabilitados ? 0 : 1;
        this.productos = this.productosTemp;
        /* this.productos = (this.checkedCreadas ? this.productosTemp.filter(producto => producto.activo == 1) :
		this.productosTemp.filter(producto => { return producto.idGerenciaCreacion == this.idGerenciaSesion || producto.activo == 1 })); */
        this.productos = this.checkedCreadas
            ? this.productosTemp.filter((producto) => {
                  return producto.idGerenciaCreacion == this.idGerenciaSesion || producto.activo == 1;
              })
            : this.productosTemp.filter((producto) => producto);
    }

    onChanceModGerenciaActual(event) {
        console.log(this.idGerenciaSesion);
        //let filter = this.checkedHabilitados ? 0 : 1;
        //this.productos = this.productosTemp;
        this.productos = this.checkedModificados
            ? this.productosTemp.filter((producto) => producto.idGerenciaModificacion == this.idGerenciaSesion)
            : this.productosTemp.filter((producto) => producto);
    }

    onChanceAprobadasGerenciaActual(event) {
        //let filter = this.checkedHabilitados ? 0 : 1;
        this.productos = this.productosTemp;
        this.productos = this.checkedAprobadasGerenciaActual
            ? this.productosTemp.filter((producto) => producto.idGerenciaAprobacion == this.idGerenciaSesion)
            : this.productosTemp.filter((producto) => {
                  return producto.activo == 0 || producto.activo == 1;
              });
    }

    registro(e) {
        console.log('regsitro:', e);
    }

    /* Nuevo producto */
    add() {
        this.rolUsuario = !this.verProducto;
        this.router.navigate(['detalleProducto', -1, this.rolUsuario]);
    }

    /* Ver informacion de un producto */
    ver(idAdmProducto: number) {
        this.rolUsuario = this.verProducto;
        this.router.navigate(['detalleProducto', idAdmProducto, this.rolUsuario]);
    }

    /* Modificar un producto */
    edit(idAdmProducto: number) {
        this.rolUsuario = !this.verProducto;
        console.log('editar', this.rolUsuario, '  ', idAdmProducto);

        this.router.navigate(['detalleProducto', idAdmProducto, this.rolUsuario]);
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
