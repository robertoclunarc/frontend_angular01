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
            ? ''
            : JSON.parse(sessionStorage.getItem('productos-filtro')).filters.global.value;

        this.filtroGerenActual = !JSON.parse(sessionStorage.getItem('filtro-gactual'))
            ? {}
            : JSON.parse(sessionStorage.getItem('filtro-gactual'));

        console.log('filtro-gactual', JSON.parse(sessionStorage.getItem('filtro-gactual')));

        this.verTodosTemp = (await this.srvParametros.getParametros().toPromise())[0].verTodosProductos;

        this.productoService.consultarTodos().subscribe(
            (productos) => {
                this.productos = productos;
                this.productosTemp = productos;

                if (this.verTodosTemp == 0) {
                    if (this.idGerenciaSesion == 7 || this.idGerenciaSesion == 12) {
                        this.productos = this.productos.filter(
                            (producto) =>
                                producto.idGerenciaCreacion == 7 ||
                                producto.idGerenciaCreacion == 12 ||
                                producto.idGerenciaModificacion == 7 ||
                                producto.idGerenciaModificacion == 12 ||
                                producto.idGerenciaAprobacion == 7 ||
                                producto.idGerenciaAprobacion == 12,
                        );
                        this.productosTemp = this.productos;
                    }

                    if (this.idGerenciaSesion == 2 || this.idGerenciaSesion == 8) {
                        this.productos = this.productos.filter(
                            (producto) =>
                                producto.idGerenciaCreacion == 2 ||
                                producto.idGerenciaCreacion == 8 ||
                                producto.idGerenciaModificacion == 2 ||
                                producto.idGerenciaModificacion == 8 ||
                                producto.idGerenciaAprobacion == 2 ||
                                producto.idGerenciaAprobacion == 8,
                        );
                        this.productosTemp = this.productos;
                    }
                }
            },
            (error) => this.showError(error),
        );

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

        if (this.checkedNoAprobados) {
            this.productos = this.productos.filter((producto) => +producto.aprobado === 0);
        }
        if (this.checkedAprobados) {
            this.productos = this.productos.filter((producto) => +producto.aprobado === 1);
        }

        if (this.checkedValidados) {
            this.productos = this.productos.filter((producto) => +producto.validado === 1);
        }
        if (this.checkedNoValidados) {
            this.productos = this.productos.filter((producto) => +producto.validado === 0);
        }

        //*****Gerencia Actual
        if (this.checkedCreadas) {
            this.productos = this.productos.filter(
                (producto) => +producto.idGerenciaCreacion === this.idGerenciaSesion,
            );
            this.filtroGerenActual.creadas = 'true';
            sessionStorage.setItem('filtro-gactual', JSON.stringify(this.filtroGerenActual));
            // console.log('filtro-gactual', JSON.parse(sessionStorage.getItem('filtro-gactual')));
        } else {
            this.filtroGerenActual.creadas = 'false';
            sessionStorage.setItem('filtro-gactual', JSON.stringify(this.filtroGerenActual));
        }

        if (this.checkedAprobadasGerenciaActual) {
            this.filtroGerenActual.aprobadas = 'true';
            sessionStorage.setItem('filtro-gactual', JSON.stringify(this.filtroGerenActual));
            this.productos = this.productos.filter(
                (producto) => producto.idGerenciaAprobacion == this.idGerenciaSesion,
            );
        } else {
            this.filtroGerenActual.aprobadas = 'false';
            sessionStorage.setItem('filtro-gactual', JSON.stringify(this.filtroGerenActual));
        }

        if (this.checkedModificados) {
            this.filtroGerenActual.modificadas = 'true';
            sessionStorage.setItem('filtro-gactual', JSON.stringify(this.filtroGerenActual));
            this.productos = this.productos.filter(
                (producto) => producto.idGerenciaModificacion == this.idGerenciaSesion,
            );
        } else {
            this.filtroGerenActual.modificadas = 'false';
            sessionStorage.setItem('filtro-gactual', JSON.stringify(this.filtroGerenActual));
        }
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
