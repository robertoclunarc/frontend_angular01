import { Component, OnInit } from '@angular/core';

import { PerfilesService } from "../../services/perfiles/perfiles.service";
import { RolesPerfilesService } from "../../services/roles-perfiles.service";

import { RolesNoAsignados } from "../../models/roles-no-asignados";
import { RolesAsignados } from "../../models/roles-asignados";
import { RolesPerfiles } from "../../models/roles-perfiles";
import { PerfilModelo } from "../../models/perfil";

import { ActivatedRoute } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { SelectItem } from 'primeng/api';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';


@Component({
	selector: 'app-per-rol-mod',
	templateUrl: './per-rol-mod.component.html',
	styleUrls: ['./per-rol-mod.component.css'],
	providers: [MessageService]
})
export class PerRolModComponent implements OnInit {

	detallePerfil: PerfilModelo = {};

	rolesNoAsignados: RolesNoAsignados[] = [];
	rolesNASelected: RolesPerfiles[] = [];
	rolesItems: SelectItem[] = [];

	rolesAsignados: RolesAsignados[] = [];
	rolesASelected: RolesPerfiles[] = [];
	rolesAItems: SelectItem[] = [];


	items: MenuItem[];
	activeItemTab: MenuItem;

	private idPerfil: number;

	status_str: string = "";

	constructor(private srvPerfil: PerfilesService, private rouactiva: ActivatedRoute,
		private srvRolesPerfiles: RolesPerfilesService, private messageService: MessageService, private router: Router) { }

	ngOnInit() {
		//let this.idPerfil: number;
		this.idPerfil = this.rouactiva.snapshot.params.idperfil;

		this.srvPerfil.getDetallePefil(this.idPerfil).subscribe(
			(data) => {
				this.detallePerfil = data[0];
				this.status_str = (this.detallePerfil.estatus == 1 ? "Activado" : "Desactivado");
				//this.detallePerfil.estatus = (this.detallePerfil.estatus == 0 ? "": "");
			}
		);

		this.actualizarRolesNOAsignados();
		this.actualizarRolesAsignados();
		//this.actualizarModulosAsignados();
		//this.actualizarModulosNOAsignados();

		this.items = [
			{ label: 'Perfiles', icon: 'fa fa-fw fa-book', routerLink: "/perfiles" },
			//{ label: 'Modulos', icon: 'fa fa-fw fa-book', routerLink: "/modulos" },
			//{ label: 'Roles', icon: 'fa fa-fw fa-book', routerLink: "/roles" }
		];

		//this.activeItemTab = this.items[0];

	}

	actualizarRolesNOAsignados() {
		this.rolesNoAsignados = [];
		this.rolesNASelected = [];
		this.srvRolesPerfiles.getRolesNoAsignados(this.idPerfil).subscribe(
			data => {
				this.rolesNoAsignados = data;
				//console.table(data);
				//console.table(data);
				this.rolesItems = [];
				this.rolesNoAsignados.forEach(rn => {
					this.rolesItems.push({
						label: rn.nombreRol,
						value: { idSegRol: rn.idSegRol, idSegPerfil: this.idPerfil }
					});
					//console.log(this.rolesItems);
				});
			}
		);
	}

	actualizarRolesAsignados() {
		this.rolesAsignados = [];
		this.rolesASelected = [];
		this.srvRolesPerfiles.getRolesAsignados(this.idPerfil).subscribe(
			data => {
				this.rolesAsignados = data;
				//console.table(data);
				this.rolesAItems = [];
				this.rolesAsignados.forEach(rn => {
					this.rolesAItems.push({
						label: rn.nombreRol,
						value: { idSegRol: rn.idSegRol, idSegPerfil: this.idPerfil }
					});
				});
			}
		);
	}



	asignarRoles() {
		//console.table(this.rolesNASelected);
		this.rolesNASelected.forEach(rolPerfil => {
			this.srvRolesPerfiles.insertarRolesAPerfil(rolPerfil).subscribe(result => {
				this.actualizarRolesNOAsignados();
				this.actualizarRolesAsignados();

			});
		});
		this.messageService.add({ key: 'tc', severity: 'success', summary: 'Cambios Realizados Satisfactoriamente' });
	}

	quitarRoles() {
		//console.table(this.rolesASelected);
		this.rolesASelected.forEach(rolPerfil => {
			this.srvRolesPerfiles.eliminarRolesAPerfil(rolPerfil).subscribe(result => {
				this.actualizarRolesAsignados();
				this.actualizarRolesNOAsignados();

			});
		});
		this.messageService.add({ key: 'tc', severity: 'success', summary: 'Cambios Realizados Satisfactoriamente' });
	}

	volver() {
		this.router.navigate(["perfiles"]);
	}

}
