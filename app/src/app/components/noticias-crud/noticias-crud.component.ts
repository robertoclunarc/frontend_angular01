import { Component, OnInit } from '@angular/core';
import { NoticiaModelo } from '../../models/noticia'
import { NoticiasState } from "../../states/noticias.state";
import { NoticiasService } from '../../services/noticias.service'
import { MenusItemsService } from '../../services/menus-items.service'
import { MessageService } from 'primeng/api';
import { ConfirmationService } from 'primeng/api';
import { MenuItem } from 'primeng/api';


import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { Select, Store } from '@ngxs/store';
import { NoticiasCrud } from "../../actions/noticias.actions"


@Component({
	selector: 'app-noticias-crud',
	templateUrl: './noticias-crud.component.html',
	styleUrls: ['./noticias-crud.component.css'],
	providers: [NoticiasService, MessageService, ConfirmationService]
})

export class NoticiasCrudComponent implements OnInit {
	//@ViewChild('myfile', { static: false }) fileInput: FileUpload;


	cant_filas_pag: number = 10;
	rows: number = this.cant_filas_pag;
	primera_fila = 0;
	displayDialog: boolean = false;

	tituloDialogo: string = "";


	Noticias: NoticiaModelo[] = [];
	Noticia: NoticiaModelo = {};

	cols: any[];
	items: MenuItem[];
	activeItemTab: MenuItem;

	@Select(NoticiasState.getAll) noticias$: Observable<NoticiaModelo[]>;

	noti$ : Observable<NoticiaModelo[]>;


	API_subir_arch: string = environment.apiUrl + "subirimagen";


	constructor( private servNoticias: NoticiasService,  private messageService: MessageService,
		private confirmationService: ConfirmationService, /*private servMenus: MenusItemsService,*/
		private store: Store) { }

	async ngOnInit() {


		//Arreglo usado para aplicar al funcionalidad "Ordenar por columna" de los componentes PrimeNGs
		this.cols = [
			{ field: 'idConfigNoticia', header: 'Nro.' },
			{ field: 'titulo', header: 'Titulo' },
			// { field: 'descripcion', header: 'Descripción' },
			{ field: 'fechaAlta', header: 'Fecha registro' },
		];

		if (this.Noticia.rutaImagen == null) {
			//console.log("NOOPP imagen");
			this.API_subir_arch = environment.apiUrl + "subirimagen/-1";

		} else { 
			//console.log("tiene imagen");
			this.API_subir_arch = environment.apiUrl + "subirimagen/" + this.Noticia.nombreImg;
		}

		//this.actualizarLista();
		//console.log("valor bruto: ", this.store.snapshot());

		//this.store.dispatch(new NoticiasCrud.All());
		//console.log("Estado: ", this.noticias$);

		//testing......acero.2
		//this.noti$ = this.servNoticias.getAll();
		//this.noti$.pipe(map((data)=>{return data.filter((noti)=>noti.idConfigNoticia == 6)}));

		//this.noti$.map((data)=>data.filter((noti)=>noti.idConfigNoticia == 6));
		//this.noti$.subscribe((resp)=>console.log("Susbcrito", resp));
	}

	actualizarLista() {
		/* this.servNoticias.getAll().subscribe(
			(data: NoticiaModelo[]) => {
				data.forEach((noti) => {
					noti.activo = noti.activo == 1 ? true : false;
				});
				this.Noticias = data;
			}
		);
		this.rows = this.cant_filas_pag; */
	}

	onPagination(event: any) {
		this.primera_fila = event.first;
		//console.log(event.first);
	}

	change(e: any) {
		//window.alert("Algo");
	}

	cerrarDialogo() {
		this.displayDialog = false;
	}

	confirmacion(noticia: NoticiaModelo, indice: number) {

		this.confirmationService.confirm({
			message: "¿Desea Eliminar el registro?",
			accept: () => {
				this.eliminarNoticia(noticia, indice);
			}
		});

	}

	verDialogo(noticia: NoticiaModelo) {
		/* 
				let elemento  = document.getElementById(noticia.idConfigNoticia) as HTMLElement;
				console.log("ele:", elemento); */

		this.tituloDialogo = "Noticia: " + noticia.idConfigNoticia;
		this.Noticia = { ...noticia };
		this.displayDialog = true;
		this.API_subir_arch = environment.apiUrl + "subirimagen/" + noticia.nombreImg;
	}

	nuevaNoticia() {
		this.tituloDialogo = "Nueva Noticia";
		this.Noticia = null;
		this.Noticia = {};
		this.displayDialog = true;
		this.API_subir_arch = environment.apiUrl + "subirimagen/-1";
		//this.Roles.splice(this.primera_fila + this.rows, 0, this.Rol);
		//this.rows += 1;
	}



	eliminarNoticia(noticia: NoticiaModelo, indice: number) {
		//this.API_subir_arch = environment.apiUrl + "subirimagen/" + noticia.nombreImg;
		/* 	this.servNoticias.eliminarImagenNoticia(noticia.nombreImg).subscribe();
			this.servNoticias.eliminarNoticia(noticia).subscribe(
				(data) => {
	
					this.Noticia = null;
					this.actualizarLista();
					this.messageService.clear();
					this.messageService.add({ key: 'tc', severity: 'success', summary: 'Registro eliminado' });
				}
			); */

		this.store.dispatch(new NoticiasCrud.Delete(noticia));

	}
	despuesCargarArchivo(e) {
		this.Noticia.rutaImagen = environment.dirImgsSubidas + e.files[0].name;
		this.Noticia.nombreImg = e.files[0].name;
	}

	bArchivo(e) {
		//console.log("eeee imagen");
		//console.log(e.formData);

		if (this.Noticia.rutaImagen == null) {
			//console.log("NOOPP imagen");
			this.API_subir_arch = environment.apiUrl + "subirimagen/-1";

		} else {
			//console.log("tiene imagen");
			this.API_subir_arch = environment.apiUrl + "subirimagen/" + this.Noticia.nombreImg;
		}
	}

	setearDatosNoticia(Noticia: NoticiaModelo) {
		//Validaciones
		// console.log(this.fileInput);
		// this.fileInput.upload();`
		//if (this.Editando == true) {
		// this.archivosSubidos.forEach (archivo =>{
		//   console.log(archivo.upload);
		// })

		let noti = { ...Noticia };

		if (noti.titulo == null) {
			this.messageService.clear();
			this.messageService.add({ key: 'tc', severity: 'error', summary: 'Debe ingresar el titulo' });
			return false;
		}
		if (noti.descripcion == null) {
			this.messageService.clear();
			this.messageService.add({ key: 'tc', severity: 'error', summary: 'Debe ingresar la descripción' });
			return false;
		}

		noti.activo = (Noticia.activo == true ? 1 : 0);
		//Nuevo
		if (noti.idConfigNoticia == null) {
			/* 		this.servNoticias.nuevoNoticia(Noticia).subscribe(data => {
						this.actualizarLista();
					}); */
			this.store.dispatch(new NoticiasCrud.Add(noti));
			this.displayDialog = false;
			this.messageService.clear();
			this.messageService.add({ key: 'tc', severity: 'success', summary: 'Noticia Registrada Satisfactoriamente' });
		} else { //Actualizar
			/* 	this.servNoticias.actualizarNoticia(Noticia).subscribe(data => {
					this.actualizarLista();
				}); */
			this.store.dispatch(new NoticiasCrud.Update(noti));
			this.displayDialog = false;
			this.messageService.clear();
			this.messageService.add({ key: 'tc', severity: 'success', summary: 'Noticia Actualizada Satisfactoriamente' });
		}
	}

}
