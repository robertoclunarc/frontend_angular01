import { InvoiceDetail } from './../../models/invoice-detail';
import { Invoice } from './../../models/invoice';
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { InvoiceService } from 'src/app/services/invoice.service';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
	selector: 'app-form-invoice',
	templateUrl: './form-invoice.component.html',
	styleUrls: ['./form-invoice.component.scss'],
	providers: [ConfirmationService, MessageService]
})

export class FormInvoiceComponent implements OnInit {


	@Input() factura: number;
	@Input() bd: string;

	@Output() cerrardialogo = new EventEmitter<boolean>();
	Invoice: Invoice[] = [];
	detalles: InvoiceDetail[] = [];

	formFactura: FormGroup = new FormGroup({
		valor_dolar: new FormControl('', Validators.required),
		tasa: new FormControl('', Validators.required),
	});

	constructor(private _srvInvo: InvoiceService, private confirmationService: ConfirmationService, private messageService: MessageService) { }

	async ngOnInit(): Promise<void> {
		this.Invoice = [...await this._srvInvo.getInvoicesById(this.bd, this.factura).toPromise()];
		this.detalles = this.Invoice[0].detalle;
		this.formFactura.setValue({ valor_dolar: this.Invoice[0].valor_dolar, tasa: this.Invoice[0].tasa });
	}

	get valor_dolar() { return this.formFactura.controls['valor_dolar'] }
	get tasa() { return this.formFactura.controls['tasa'] }



	async modFactura() {

		if (this.formFactura.invalid) { return this.formFactura.markAllAsTouched(); };

		this.confirmationService.confirm({
			message: "¿Esta seguro de modificar la información de la factura?",
			accept: async () => { 
				if (this.formFactura.valid) {
					const updateInvoice: Invoice = {
						numero: this.Invoice[0].numero,
						valor_dolar: this.valor_dolar.value,
						tasa: this.tasa.value
					}

					//console.log('Enviando...', updateInvoice);
					//this._srvInvo.updateDolarData(this.bd, updateInvoice).subscribe((result) => console.log(result));
					await this._srvInvo.updateDolarData(this.bd, updateInvoice).toPromise()
					/* this.detalles.forEach(async (row) => {
						await this._srvInvo.updateDetailsInvoice(row, this.bd).toPromise();
					}); */

					for (let pos in this.detalles) {
						// console.log("neuvos", this.detalles[pos]);
						await this._srvInvo.updateDetailsInvoice(this.detalles[pos], this.bd).toPromise();
					}

					this.messageService.clear();
					this.messageService.add({
						key: 'tc2', severity: 'info',
						detail: 'Factura Modificada Satisfactoriamente',
						life: 5000
					});
					this.cerrarDialogo();

				}

			}
		});
		//this.cerrarDialogo(); 
	}

	cerrarDialogo() {
		this.cerrardialogo.next(false);
	}
}
