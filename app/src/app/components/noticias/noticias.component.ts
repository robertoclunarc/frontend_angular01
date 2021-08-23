import { Component, OnInit } from '@angular/core';
import { NoticiaModelo } from '../../models/index';
import { NoticiasService } from 'src/app/services/noticias.service';
import { Message } from 'primeng/api';


// import { NoticiasCrud } from "../../actions/noticias.actions";
import { Store, Select } from "@ngxs/store";
import { NoticiasState } from 'src/app/states/noticias.state';
import { Observable } from 'rxjs';


@Component({
	selector: 'noticias',
	templateUrl: './noticias.component.html',
	styleUrls: ['./noticias.component.css'],
	providers: [NoticiasService]
})
export class NoticiasComponent implements OnInit {

	noticias: NoticiaModelo[] = [];
	msgs: Message[] = [];

	noticia: NoticiaModelo;

	//@Select(NoticiasCrud.AllActives) noticias$ :Observable<NoticiaModelo[]>;
	@Select(NoticiasState.getAllActives) noticias$ :Observable<NoticiaModelo[]>; 
	//@Select(NoticiasState.getAll) noticias$ :Observable<NoticiaModelo[]>; 
	//@Select(NoticiasState.getAllActParam(new NoticiasStateModel(), 2)) noticias$ :Observable<NoticiaModelo[]>; 

	constructor(private srvNotic: NoticiasService, //private srv: TsTicketServicioService 
			private store : Store
		) { }

	ngOnInit() {
		// this.srvNotic.test(5, "analista de").subscribe((data)=>console.log("data test", data));
		//this.srvNotic.getAllPublico().subscribe(data => { this.getNoticias(data); }, error => { console.log(error); });
		//this.store.dispatch(new NoticiasCrud.All());
	}

	private getNoticias(data) {
/* 		this.msgs = [];
		if (!data) {
			this.msgs.push({ severity: 'error', summary: 'ERROR', detail: 'No hay noticias que mostrar' });
			return;
		}
		this.noticias = data; */
	}


}
