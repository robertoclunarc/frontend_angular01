import { Component, OnInit } from '@angular/core';
import { Notificacion, User, EstadoNotificacion } from '../../models/index';
import { NotificacionesService } from '../../services/index';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { MenuItem } from 'primeng/api';
import { MessageService, } from 'primeng/api';


import { formatDate } from '@angular/common';

import { Subscription, interval } from 'rxjs';



@Component({
	selector: 'notificaciones',
	templateUrl: './notificaciones.component.html',
	providers: [NotificacionesService, MessageService],
	styles: [`
        :host ::ng-deep .ui-splitbutton {
            margin-right: .25em;
        }
    `],
	animations: [
		trigger('rowExpansionTrigger', [
			state('void', style({
				transform: 'translateX(-10%)',
				opacity: 0
			})),
			state('active', style({
				transform: 'translateX(0)',
				opacity: 1
			})),
			transition('* <=> *', animate('400ms cubic-bezier(0.86, 0, 0.07, 1)'))
		])
	]
})
export class NotificacionesComponent implements OnInit {

	cols: any[];
	notificaciones: Notificacion[] = [];
	user: User;

	items: MenuItem[] = [];

	display: boolean = false;
	rangeDates: Date[];

	private intervalNotificaciones: Subscription;

	constructor(private srvNotificaciones: NotificacionesService) { }

	ngOnInit() {

		this.cols = [
			{ field: 'idNotificacionServicio', header: 'idNotificacionServicio', display: 'none', width: '35%' },
			{ field: 'fechaLectura', header: 'fechaLectura', display: 'none', width: '35%' },
			{ field: 'gerencia', header: 'Gerencia', display: 'none', width: '35%' },
			{ field: 'servicio', header: 'Servicio', display: 'none', width: '35%' },
			{ field: 'usuarioEnvio', header: 'De', display: 'table-cell', width: '20%' },
			{ field: 'mensaje', header: 'Mensaje', display: 'table-cell', width: '60%', },
			{ field: 'fechaEnvio', header: 'Fecha', display: 'table-cell', width: '20%' },
			{ field: 'estado', header: 'Estado', display: 'none', width: '10%' }
		];

		this.items = [
			{
				label: 'Leidas.....', icon: 'fas fa-envelope-open', command: () => {
					this.leidas();
				}
			},
			{
				label: 'No leidas', icon: 'fas fa-envelope', command: () => {
					this.noLeidas();
				}
			},
			{
				label: 'Por fecha', icon: 'pi pi-calendar', command: () => {
					this.showDialog();
				}
			},
			{
				label: 'Todas.....', icon: 'pi pi-list', command: () => {
					this.todas();
				}
			}

		];

		let currentUser = sessionStorage.getItem('currentUser');
		this.user = JSON.parse(currentUser);

		this.srvNotificaciones.getAllNotificacionesPorUsuario(this.user.idSegUsuario).subscribe(notificaciones => { this.notificaciones = notificaciones });

		this.intervalNotificaciones = interval(15000).subscribe(x => {
			this.srvNotificaciones.getAllNotificacionesPorUsuario(this.user.idSegUsuario).subscribe(notificaciones => { this.notificaciones = notificaciones });
		});

	}


	leidas() {
		this.srvNotificaciones.getNotificacionesLeidas(this.user.idSegUsuario).subscribe(notificaciones => { this.notificaciones = notificaciones; console.log(this.notificaciones); });
	}

	noLeidas() {
		this.srvNotificaciones.getNotificacionesNoLeidas(this.user.idSegUsuario).subscribe(notificaciones => { this.notificaciones = notificaciones });
	}

	todas() {
		this.srvNotificaciones.getAllNotificacionesPorUsuario(this.user.idSegUsuario).subscribe(notificaciones => { this.notificaciones = notificaciones });
	}

	porFecha() {

		let format = 'yyyy-MM-dd';
		let desde = this.rangeDates[0];
		let hasta = this.rangeDates[1];

		const locale = 'en-ES';
		const formattedDesde = formatDate(desde, format, locale);
		const formattedHasta = formatDate(hasta, format, locale);

		this.srvNotificaciones.getNotificacionesPorFecha(this.user.idSegUsuario, formattedDesde, formattedHasta).subscribe(notificaciones => { this.notificaciones = notificaciones; this.cerrarDialogo(); });

	}

	actualizaNotificacion(id: number, estado: EstadoNotificacion) {
		this.srvNotificaciones.actualizarEstadoNotificacion(id, estado).subscribe(data => { });
	}

	showDialog() {
		this.display = true;
	}

	cerrarDialogo() {
		this.display = false;
		this.rangeDates = null;
	}


	onItemClick(rowData: any, dt: any) {

		if (rowData.estado == 1 || rowData.estado == 2) {

			rowData.estado = 3;
			this.actualizaNotificacion(rowData.idNotificacionServicio, EstadoNotificacion.Leido);
		}

		if (dt.expandedRowKeys[rowData.idNotificacionServicio]) {
			dt.expandedRowKeys[rowData.idNotificacionServicio] = 0;
		}
		else {
			dt.expandedRowKeys[rowData.idNotificacionServicio] = 1;
		}
	}
}


