import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { ProveedorModelo } from 'src/app/models/proveedor-modelo';
import { ProveedoresComprasService } from 'src/app/services/proveedores-compras.service';
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { MessageService, ConfirmationService } from 'primeng/api';

@Component({
	selector: 'app-proveedores-form',
	templateUrl: './proveedores-form.component.html',
	styleUrls: ['./proveedores-form.component.scss'],
	providers: [MessageService, ConfirmationService]
})
export class ProveedoresFormComponent implements OnInit {

	@Input() proveedor: ProveedorModelo;
	@Output() procesar = new EventEmitter<string>();

	formProveedor: FormGroup = new FormGroup({});

	constructor(private svrPrveedores: ProveedoresComprasService,
		private messageService: MessageService, private confirmationService: ConfirmationService,
		private fb: FormBuilder) {


	}

	get nombre() { return this.formProveedor.get('nombre'); }
	get rif() { return this.formProveedor.get('rif'); }
	get direccion() { return this.formProveedor.get('direccion'); }
	get valoracion() { return this.formProveedor.get('valoracion'); }
	get telefono() { return this.formProveedor.get('telefono'); }
	get contacto() { return this.formProveedor.get('contacto'); }
	get formas_envio() { return this.formProveedor.get('formas_envio'); }
	get condiciones() { return this.formProveedor.get('condiciones'); }
	get email() { return this.formProveedor.get('email'); }
	get rubros() { return this.formProveedor.get('rubros'); }

	ngOnInit(): void {

		this.formProveedor = this.fb.group({
			nombre: new FormControl(this.proveedor?.nombre, [Validators.required]),
			rif: new FormControl(this.proveedor?.rif, [Validators.required]),
			direccion: new FormControl(this.proveedor?.rif),
			valoracion: new FormControl(this.proveedor?.valoracion || '5'),
			telefono: new FormControl(this.proveedor?.telefono),
			contacto: new FormControl(this.proveedor?.contacto),
			formas_envio: new FormControl(this.proveedor?.formas_envio),
			condiciones: new FormControl(this.proveedor?.condiciones),
			email: new FormControl(this.proveedor?.email, [Validators.required, Validators.email]),
			rubros: new FormControl(this.proveedor?.rubros, [Validators.required]),
		});

		//Object.assign(this.formProveedor.value, this.proveedor);
		this.formProveedor.updateValueAndValidity({ onlySelf: true });
		// console.log(this.proveedor);
	}

	async registrar() {
		if (this.formProveedor.valid) {
			if (!this.proveedor.idProveedor) {
				// console.log(this.proveedor);
				await this.svrPrveedores.save({ ... this.formProveedor.value }).toPromise();
			} else {
				// this.proveedor = { ... this.formProveedor.value };
				await this.svrPrveedores.update(this.proveedor.idProveedor, { ... this.formProveedor.value }).toPromise();
			}
			// this.messageService.clear();
			// this.messageService.add({ key: 'tc', severity: 'success', summary: 'Proveedor registrado correctamente' });
			this.procesar.emit("registrado");
		} else {
			// console.log("algo: ", this.email.value);
			// if (!this.nombre.value) {
			// 	this.messageService.clear();
			// 	this.messageService.add({ key: 'tc', severity: 'error', summary: 'El nombre es obligatorio y debe ser valido' });
			// 	return false;
			// }
			// if (!this.email.value) {
			// 	this.messageService.clear();
			// 	this.messageService.add({ key: 'tc', severity: 'error', summary: 'Email es obligatorio y debe ser valido' });
			// 	return false;
			// }
			// if (!this.rubros.value) {
			// 	this.messageService.clear();
			// 	this.messageService.add({ key: 'tc', severity: 'error', summary: 'Los rubros son obligatorios y debe ser valido' });
			// 	return false;
			// }
			// this.email.invalid && this.email.markAllAsTouched();
			this.formProveedor.markAllAsTouched();
			this.messageService.clear();
			this.messageService.add({ key: 'tc', severity: 'error', summary: 'No se pudo enviar!. Revise el formulario por errores' });
			return false;
		}
	}

	cerrar() {
		this.procesar.emit("cerrar");
	}
}
