import { Component, OnInit } from '@angular/core';

import { User } from '../../models/user'
import { UserService } from '../../services/user.service'
import { ConfirmationService } from 'primeng/api';
import { MessageService } from 'primeng/api';

import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { Md5 } from "ts-md5/dist/md5";
import { environment } from "../../../../src/environments/environment";


@Component({
	selector: 'app-cambio-clave-usr',
	templateUrl: './cambio-clave-usr.component.html',
	styleUrls: ['./cambio-clave-usr.component.css'],
	providers: [UserService, MessageService, ConfirmationService]
})
export class CambioClaveUsrComponent implements OnInit {

	idUsuario: number;
	usuarioDetalle: User = {};
	confirmaClave: string = "";
	nuevaClave: string = "";

	API_subir_archivo: string = environment.apiUrl + "subirimgpropia";
	activoCambio: boolean = true;


	constructor(private servUsuarios: UserService, private confirmationService: ConfirmationService, private messageService: MessageService,
		private rouactiva: ActivatedRoute, private router: Router) {
		this.idUsuario = this.rouactiva.snapshot.params.idusuario;
		
	}

	ngOnInit() {

		this.servUsuarios.getUserById(this.idUsuario).subscribe(data => {
			this.usuarioDetalle = data[0];
			this.API_subir_archivo = environment.apiUrl + "subirimgpropia/-1";
			/* if (this.usuarioDetalle.rutaImagen == null) {
				this.API_subir_archivo = environment.apiUrl + "subirimgpropia/-1";
			} else {
				this.API_subir_archivo = environment.apiUrl + "subirimgpropia/" + this.usuarioDetalle.foto;
			} */
		});

	}

	cambiarClave(e) {

		if (!(this.nuevaClave === this.confirmaClave)) {
			this.messageService.clear();
			this.messageService.add({ key: 'tc', severity: 'error', summary: 'Las contraseñas NO conciden' });
			return false;
		}


		this.confirmationService.confirm({
			message: "¿Realmente desea cambiar su clave de acceso?",
			accept: () => {
				const md5Pass = String(Md5.hashStr(this.confirmaClave));
				this.usuarioDetalle.contrasenia = md5Pass;
				this.servUsuarios.actualizarUsuario(this.usuarioDetalle).subscribe(data => {
					this.messageService.clear();
					this.messageService.add({ key: 'tc', severity: 'success', summary: 'Clave actualizada satisfactoriamente. Reinicie sesión' });
					setTimeout(() => {
						this.router.navigate(['/logout']);
					},
						4000);
				});
			}
		});

	}

	antesSubirArchivo(e) {
		this.API_subir_archivo = environment.dirImgsSubidas + "subirimgpropia/-1";
	/* 	if (this.usuarioDetalle.rutaImagen == null) {
			this.API_subir_archivo = environment.dirImgsSubidas + "subirimgpropia/-1";
		} else {
			this.API_subir_archivo = environment.dirImgsSubidas + "/" + this.usuarioDetalle.foto;
		} */
	}

	despuesCargarArchivo(e) {
		this.usuarioDetalle.rutaImagen = environment.dirImgsSubidas + "fotosusers/" + e.files[0].name;
		this.usuarioDetalle.foto = e.files[0].name;
		this.messageService.clear();
		this.messageService.add({ key: 'tc', severity: 'success', summary: 'Imagen cargada. Ahora haga click en "Guardar Cambios" para que tenga efecto' });
		this.activoCambio = false;
	}

	guardarImagen(e) {
		this.servUsuarios.actualizarUsuario(this.usuarioDetalle).subscribe(data => {
			this.messageService.clear();
			this.messageService.add({ key: 'tc', severity: 'success', summary: 'Imagen actualizada satisfactoriamente. Reinicie sesión para ver los cambios' });
			setTimeout(() => {
				this.router.navigate(['/logout']);
			}, 4000);
		});
	}

}
