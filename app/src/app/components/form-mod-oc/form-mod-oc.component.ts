import { TrazaOc } from './../../models/traza-oc';
import { OrdenCompra } from './../../models/orden-compra';
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { OrdenCompraService } from 'src/app/services/orden-compra.service';
import { formatDate } from '@angular/common';
import { SelectItem } from 'primeng-lts/api';
import { Subscription } from 'rxjs';

@Component({
	selector: 'app-form-mod-oc',
	templateUrl: './form-mod-oc.component.html',
	styleUrls: ['./form-mod-oc.component.scss']
})
export class FormModOcComponent implements OnInit {

	@Input() oc: OrdenCompra;
	@Output() result: EventEmitter<String> = new EventEmitter<String>();

	formOC: FormGroup = new FormGroup({});
	estadosOcItems: SelectItem[] = [];
	disabledEstado: boolean = false;

	mysubs: Subscription[] = [];

	constructor(private formBuilder: FormBuilder,
		private srvOc: OrdenCompraService) { }

	ngOnInit(): void {

		this.formOC = this.formBuilder.group({
			correlativo: new FormControl(this.oc.correlativo, [Validators.required]),
			tasa: new FormControl(this.oc.tasa_usd, [Validators.required]),
			estado: new FormControl({ value: this.oc.idEstado, disabled: false }, [Validators.required]),
			justificacion: new FormControl(``, [Validators.required]),
		});


		this.srvOc.getEstadosOcActualySigui(this.oc.idEstado).toPromise().then((data) => {
			for (const estado of data) {
				this.estadosOcItems.push({ label: estado.nombre, value: estado.id });
			}
			// this.oc.estadoActual === "APROBADO" && this.estadosOcItems.splice(0, 1);
			this.estado.setValue(this.oc.idEstado);
		});
		// 
		//this.formOC.updateValueAndValidity();
		// this.

		// this.mysubs[this.mysubs.length] = this.correlativo.valueChanges
		// 	.pipe()
		// 	.subscribe((result) => this.correlativo.disable());
		// this.mysubs[this.mysubs.length] = this.tasa.valueChanges
		// 	.pipe()
		// 	.subscribe((result) => this.tasa.disable());
	}

	private acondicianarOc(oc: OrdenCompra) {
		delete oc.nombre_activo;
		delete oc.nombre_aprobo;
		delete oc.nombre_empresa_facturar;
		delete oc.nombre_proveedor;
		delete oc.nombre_asignado;

		oc.fechaAprobacion = formatDate(oc.fechaAprobacion, 'yyyy-MM-dd HH:MM:SS', 'en');
		oc.fechaRequerida = formatDate(oc.fechaRequerida, 'yyyy-MM-dd HH:MM:SS', 'en');
		oc.fecha_tasa_usd = formatDate(oc.fecha_tasa_usd, 'yyyy-MM-dd HH:MM:SS', 'en');

		return oc;
	}

	get correlativo() { return this.formOC.controls['correlativo'] }
	get tasa() { return this.formOC.controls['tasa'] }
	get estado() { return this.formOC.controls['estado'] }
	get justificacion() { return this.formOC.controls['justificacion'] }

	async registrar() {
		this.formOC.markAllAsTouched();
		if (this.formOC.valid) {
			// await this.srvOc.updateOc(this.oc.idComprasOC,
			// 	{
			// 		correlativo: this.correlativo.value,
			// 		tasa_usd: this.tasa.value,
			// 		idEstado: this.idEstado.value,
			// 		estadoActual: this.idEstado.value.label
			// 	})
			// 	.toPromise();
			let estadoSelected = this.estadosOcItems.find((e) => +e.value === +this.estado.value);
			let idSegUsuario = JSON.parse(sessionStorage.getItem('currentUser')).idSegUsuario;

			// console.log("selectd", this.estadosOcItems.find((e) => +e.value === +this.estado.value));
			let newTrazaOc: TrazaOc = {
				justificacion: this.justificacion.value,
				idComprasOC: this.oc.idComprasOC,
				idEstadoOC: this.estado.value,
				estadoAnterior: this.oc.estadoActual,
				estadoActual: estadoSelected.label,
				idSegUsuario, 
			};
			// 	if (!this.proveedor.idProveedor) {
			// 		// console.log(this.proveedor);
			// 		await this.svrPrveedores.save({ ... this.formProveedor.value }).toPromise();
			// 	} else {
			// 		// this.proveedor = { ... this.formProveedor.value };
			// 		await this.svrPrveedores.update(this.proveedor.idProveedor, { ... this.formProveedor.value }).toPromise();
			// 	}
			// 	// this.messageService.clear();
			// 	// this.messageService.add({ key: 'tc', severity: 'success', summary: 'Proveedor registrado correctamente' });
			// 	this.procesar.emit("registrado");
			// } else {

			// 	this.formProveedor.markAllAsTouched();
			// 	this.messageService.clear();
			// 	this.messageService.add({ key: 'tc', severity: 'error', summary: 'No se pudo enviar!. Revise el formulario por errores' });
			// 	return false;
		}
	}

	cerrar() {
		this.result.emit("cerrar");
	}

}
