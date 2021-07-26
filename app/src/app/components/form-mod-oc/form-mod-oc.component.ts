import { TrazasocService } from './../../services/trazasoc.service';
import { TrazaOc } from './../../models/traza-oc';
import { OrdenCompra } from './../../models/orden-compra';
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { OrdenCompraService } from 'src/app/services/orden-compra.service';
import { formatDate } from '@angular/common';
import { SelectItem } from 'primeng-lts/api';
import { Subscription } from 'rxjs';
import { MessageService, ConfirmationService } from 'primeng/api';

@Component({
	selector: 'app-form-mod-oc',
	templateUrl: './form-mod-oc.component.html',
	styleUrls: ['./form-mod-oc.component.scss'],
	providers: [MessageService, ConfirmationService]

})
export class FormModOcComponent implements OnInit {

	@Input() oc!: OrdenCompra;
	@Output() result: EventEmitter<String> = new EventEmitter<String>();

	formOC: FormGroup = new FormGroup({});
	estadosOcItems: SelectItem[] = [];
	disabledEstado: boolean = false;

	// mysubs: Subscription[] = [];

	constructor(
		private formBuilder: FormBuilder,
		private svrTrazaOc: TrazasocService,
		private messageService: MessageService, private confirmationService: ConfirmationService,
		private srvOc: OrdenCompraService) { }

	ngOnInit(): void {

		this.formOC = this.formBuilder.group({
			correlativo: new FormControl(this.oc.correlativo, []),
			tasa: new FormControl(this.oc.tasa_usd, [Validators.required]),
			estado: new FormControl({ value: this.oc.idEstado, disabled: false }, [Validators.required]),
			justificacion: new FormControl(``, [Validators.required]),
		});

		this.formOC.updateValueAndValidity();

		this.srvOc.getEstadosOcActualySigui(this.oc.idComprasOC).toPromise().then((data) => {
			for (const estado of data) {
				this.estadosOcItems.push({ label: estado.nombre, value: estado.id });
			}
			this.estado.setValue(this.oc.idEstado);
		});
		
	}

	// private acondicianarOc(oc: OrdenCompra) {
	// 	delete oc.nombre_activo;
	// 	delete oc.nombre_aprobo;
	// 	delete oc.nombre_empresa_facturar;
	// 	delete oc.nombre_proveedor;
	// 	delete oc.nombre_asignado;

	// 	oc.fechaAprobacion = formatDate(oc.fechaAprobacion, 'yyyy-MM-dd HH:MM:SS', 'en');
	// 	oc.fechaRequerida = formatDate(oc.fechaRequerida, 'yyyy-MM-dd HH:MM:SS', 'en');
	// 	oc.fecha_tasa_usd = formatDate(oc.fecha_tasa_usd, 'yyyy-MM-dd HH:MM:SS', 'en');

	// 	return oc;
	// }

	get correlativo() { return this.formOC.controls['correlativo'] }
	get tasa() { return this.formOC.controls['tasa'] }
	get estado() { return this.formOC.controls['estado'] }
	get justificacion() { return this.formOC.controls['justificacion'] }

	async registrar() {
		
		this.formOC.markAllAsTouched();

		if (this.formOC.valid) {
		
			let estadoSelected = this.estadosOcItems.find((e) => +e.value === +this.estado.value);
			let idSegUsuario = JSON.parse(sessionStorage.getItem('currentUser')).idSegUsuario;
			await this.srvOc.updateOc(this.oc.idComprasOC,
				{
					correlativo: this.correlativo.value,
					tasa_usd: this.tasa.value,
					idEstado: this.estado.value,
					estadoActual: estadoSelected.label
				})
			.toPromise();

			let newTrazaOc: TrazaOc = {
				justificacion: this.justificacion.value,
				idComprasOC: this.oc.idComprasOC,
				idEstadoOC: this.estado.value,
				estadoAnterior: this.oc.estadoActual,
				estadoActual: estadoSelected.label,
				idSegUsuario,
			};

			await this.svrTrazaOc.insertTrazaOc(newTrazaOc).toPromise()
			this.result.emit("registrado");
		}
	}

	cerrar() {
		this.result.emit("cerrar");
	}

}
