import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { ProveedorModelo } from 'src/app/models/proveedor-modelo';
import { ProveedoresComprasService } from 'src/app/services/proveedores-compras.service';
import { Component, Input, OnInit } from '@angular/core';
import { MessageService, ConfirmationService } from 'primeng/api';

@Component({
	selector: 'app-proveedores-form',
	templateUrl: './proveedores-form.component.html',
	styleUrls: ['./proveedores-form.component.scss'],
	providers: [MessageService, ConfirmationService]
})
export class ProveedoresFormComponent implements OnInit {

	@Input() proveedor: ProveedorModelo = {};
	formProveedor: FormGroup = new FormGroup({});

	constructor(private svrPrveedores: ProveedoresComprasService,
		private messageService: MessageService, private confirmationService: ConfirmationService,
		private fb: FormBuilder) {

		this.formProveedor = this.fb.group({
			nombre: new FormControl('', [Validators.required]),
			rif: new FormControl('', [Validators.required]),
			direccion: new FormControl(''),
			valoracion: new FormControl('5'),
			telefono: new FormControl(''),
			contacto: new FormControl(''),
			formas_envio: new FormControl(''),
			condiciones: new FormControl(''),
			email: new FormControl(''),		
		});

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

	ngOnInit(): void {
		console.log(this.proveedor);
	}

	registrar(){}

}
