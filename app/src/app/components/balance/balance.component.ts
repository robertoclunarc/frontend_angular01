import { Component, OnInit } from '@angular/core';

import { Message } from 'primeng/api';
import * as jsPDF from 'jspdf';

import { Company, CompanyImpl, Balance, BalanceP } from "../../models";
import { CompanyService, BalanceService } from "../../services";
import { Configuration } from '../../app.configuration';

@Component({
	selector: 'app-balance',
	templateUrl: './balance.component.html',
	styleUrls: ['./balance.component.css'],
	providers: [CompanyService, BalanceService]
})
export class BalanceComponent implements OnInit {
	es: any;
	maxDate: Date;

	msgs: Message[] = [];

	companys: Company[] = [];
	selectedCompany: Company = {};
	company: CompanyImpl;
	rangeDates: Date[];
	showResult: boolean = false;

	accounts: BalanceP[] = [];
	accountLevel1: BalanceP = null;
	cantAccountLevel1: number = 0;
	accountLevel2: BalanceP = null;
	cantAccountLevel2: number = 0;
	accountLevel3: BalanceP = null;
	cantAccountLevel3: number = 0;
	accountLevel4: BalanceP = null;
	cantAccountLevel4: number = 0;

	constructor(private srvComp: CompanyService, private srvBal: BalanceService) {
		this.maxDate = new Date(Date.now());
		this.es = {
			firstDayOfWeek: 1,
			dayNames: ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "sábado"],
			dayNamesShort: ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"],
			dayNamesMin: ["D", "L", "M", "X", "J", "V", "S"],
			monthNames: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"],
			monthNamesShort: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"],
			today: 'Hoy',
			clear: 'Borrar'
		}
	}

	ngOnInit() {
		this.srvComp.getCompanys("conta").subscribe(data => { this.getCompanysCatalog(data); }, error => { console.log(error); });
	}

	private getCompanysCatalog(data) {
		this.msgs = [];
		if (!data) {
			this.msgs.push({ severity: 'error', summary: 'ERROR', detail: 'No hay empresas que mostrar' });
			return;
		}
		this.companys = data;
	}

	getBalance() {
		this.msgs = [];
		this.showResult = false;
		if (!this.selectedCompany || Configuration.isEmpty(this.selectedCompany)) {
			this.msgs.push({ severity: 'error', summary: 'ERROR', detail: 'Debe seleccionar una empresa' });
			return;
		} else {
			var since = "";
			var until = "";
			if (this.rangeDates && (this.rangeDates.length >= 1 || this.rangeDates.length <= 2)) {
				since = this.rangeDates[0].getFullYear() + '-' + (this.rangeDates[0].getMonth() + 1) + '-' + this.rangeDates[0].getDate();
				if (this.rangeDates[1] == null || Configuration.isEmpty(this.rangeDates[1])) {
					until = since;
				} else {
					until = this.rangeDates[1].getFullYear() + '-' + (this.rangeDates[1].getMonth() + 1) + '-' + this.rangeDates[1].getDate();
				}
				this.company = new CompanyImpl(this.selectedCompany.cod_empresa, this.selectedCompany.nombre_empresa, this.selectedCompany.rif, this.selectedCompany.base_de_datos, this.selectedCompany.tipo_factura);
				this.srvBal.getBalance(this.company.base_de_datos, since, until).subscribe(
					data => {
						//console.log("Datos Compañia ", this.company.base_de_datos);
						//console.log("Datos: ", data);
						this.getBalanceData(data);
					},
					error => {
						console.log(error);
					});
			} else {
				this.msgs.push({ severity: 'error', summary: 'ERROR', detail: 'Debe indicar el rango de fecha utilizar para calcular o mostrar la informacion' });
			}
		}
	}

	getBalanceData(data) {
		if (!data) {
			this.msgs.push({ severity: 'info', summary: 'Resultado', detail: 'No se encontro informacion con esos filtros' });
			return;
		}
		this.accounts = data;
		this.showResult = true;
		console.log("filling accounts");
		this.printBalance(); //Llamada a lo que desarrollo 
	}

	private printBalance() {
		var pageWith = 215.9;
		var pageHeight = 279.4;

		var doc = new jsPDF();
		doc.setProperties({
			orientation: 'portrait',
			unit: 'mm',
			format: 'letter',
			title: 'Balance_' + this.company.cod_empresa,
			subject: 'Balance_Comprobacion_' + this.company.cod_empresa,
			author: this.company.nombre_empresa,
			creator: this.company.nombre_empresa
		});

		let firstPage: boolean = true;
		var totalSaldoIni: number = 0
		var totalSaldoFin: number = 0
		var totalDebe: number = 0
		var totalHaber: number = 0
		var y = 46;
		for (let data of this.accounts) {
			if (!firstPage && y >= (pageHeight - 10)) {
				y = 46;
				doc.addPage('letter', 'portrait');
				//var document = [doc];
				this.addHeader(document);
				doc = document[0];
			} else if (firstPage) {
				firstPage = false;
				var document = [doc];
				this.addHeader(document);
				doc = document[0];
			}
			var document = [doc];
			y = this.addAccount(document, data, y);
			doc = document[0];
			totalSaldoIni += Configuration.stringToNumber(data.total.inicial);
			totalDebe += Configuration.stringToNumber(data.total.debe);
			totalHaber += Configuration.stringToNumber(data.total.haber);
			totalSaldoFin += Configuration.stringToNumber(data.total.final);
		}

		doc.line(10, y, pageWith - 10, y);
		doc.line(10, y + 1, pageWith - 10, y + 1);
		doc.setFontSize(8);
		doc.setFontStyle("bold");
		doc.text(pageWith - 120, y + 4, "TOTAL  GENERAL", { align: 'right' });
		doc.text(pageWith - 92, y + 4, Configuration.numberFormat(totalSaldoIni, true), { align: 'right' });
		doc.text(pageWith - 65, y + 4, Configuration.numberFormat(totalDebe, true), { align: 'right' });
		doc.text(pageWith - 39, y + 4, Configuration.numberFormat(totalHaber, true), { align: 'right' });
		doc.text(pageWith - 12, y + 4, Configuration.numberFormat(totalSaldoFin, true), { align: 'right' });

		var totalPage: number = doc.internal.getNumberOfPages();
		for (let page = 1; page <= totalPage; page++) {
			doc.setPage(page);
			y = 30;
			doc.setFontSize(9);
			doc.setFontStyle("bold");
			doc.text(pageWith - 25, y, "Página " + page + " de " + totalPage, { align: 'right' });
		}

		var blob = doc.output("blob");
		window.open(URL.createObjectURL(blob));
	}

	private addHeader(document) {
		var pageWith = 215.9;
		var middleWith = pageWith / 2;

		var doc = document[0];
		var y: number = 15;

		if (this.company.logo) {
			//console.log("Logo: ", this.company.logo);
			doc.addImage(this.company.logo, 'JPEG', 12, y - 5, this.company.logo_width, this.company.logo_height);
		}
		doc.setFont("helvetica");
		doc.setFontSize(14);
		doc.setFontStyle("bold");
		doc.text(middleWith, y, this.selectedCompany.nombre_empresa, { align: 'center' });

		y = y + 6;
		doc.setFontSize(12);
		doc.setFontStyle("bold");
		doc.text(middleWith, y, "BALANCE DE COMPROBACION", { align: 'center' });

		var since = "";
		var until = "";
		if (this.rangeDates && (this.rangeDates.length >= 1 || this.rangeDates.length <= 2)) {
			since = this.rangeDates[0].getDate() + '/' + (this.rangeDates[0].getMonth() + 1) + '/' + this.rangeDates[0].getFullYear();
			if (this.rangeDates[1] == null || Configuration.isEmpty(this.rangeDates[1])) {
				until = since;
			} else {
				until = this.rangeDates[1].getDate() + '/' + (this.rangeDates[1].getMonth() + 1) + '/' + this.rangeDates[1].getFullYear();
			}
		}
		y = y + 4;
		doc.setFontSize(12);
		doc.setFontStyle("bold");
		doc.text(middleWith, y, "DESDE: " + since + "  HASTA: " + until, { align: 'center' });

		y = y + 10;
		doc.setFontSize(9);
		doc.setFontStyle("normal");
		var today = new Date();
		doc.text(pageWith - 25, y, Configuration.getdatetime(today), { align: 'right' });

		y = y + 5
		doc.setFontSize(9);
		doc.setFontStyle("bold");
		doc.text(pageWith - 92, y, "Saldo Inicial", { align: 'right' });
		doc.text(pageWith - 65, y, "Debe", { align: 'right' });
		doc.text(pageWith - 39, y, "Haber", { align: 'right' });
		doc.text(pageWith - 12, y, "Saldo Final", { align: 'right' });

		y = y + 1;
		doc.line(10, y, pageWith - 10, y);
	}

	private addAccount(document, account: Balance, posY) {
		var pageWith = 215.9;
		var pageHeight = 279.4;

		var y: number = posY;
		var doc = document[0];

		switch (account.nivel) {
			case "1":
				doc.setFontSize(13);
				doc.setFontStyle("bold");
				var splitTitle = doc.splitTextToSize(account.cuenta.trim() + "  " + account.descripcion.trim(), pageWith - 125);
				doc.text(12, y, splitTitle);
				y += (splitTitle.length * 5);
				break;
			case "2":
				doc.setFontSize(11);
				doc.setFontStyle("bold");
				var splitTitle = doc.splitTextToSize(account.cuenta.trim() + "    " + account.descripcion.trim(), pageWith - 125);
				doc.text(12, y, splitTitle);
				y += (splitTitle.length * 5);
				break;
			case "3":
				doc.setFontSize(9);
				doc.setFontStyle("bold");
				var splitTitle = doc.splitTextToSize(account.cuenta.trim() + "      " + account.descripcion.trim(), pageWith - 125);
				doc.text(12, y, splitTitle);
				y += (splitTitle.length * 5);
				break;
			case "4":
				doc.setFontSize(8);
				doc.setFontStyle("bold");
				var splitTitle = doc.splitTextToSize(account.cuenta.trim() + "        " + account.descripcion.trim(), pageWith - 125);
				doc.text(12, y, splitTitle);
				y += (splitTitle.length * 5);
				break;
			case "5":
				doc.setFontSize(8);
				doc.setFontStyle("normal");
				//var splitTitle = doc.splitTextToSize(account.cuenta.trim() +"          "+ account.descripcion.trim(), pageWith-125);

				var splitTitle = doc.splitTextToSize(account.cuenta.trim() + "          " + account.descripcion.trim(), pageWith - 125);

				var yy = y;
				var zz = yy;
				var xx = 12;

				for (var i = 0; i < splitTitle.length; i++) {

					if (i > 0) { xx += 22; }

					doc.text(xx, yy, splitTitle[i]);
					yy += (splitTitle.length * 2);


				}
				y = zz;

				doc.text(pageWith - 92, y, account.total.inicial, { align: 'right' });
				doc.text(pageWith - 65, y, account.total.debe, { align: 'right' });
				doc.text(pageWith - 39, y, account.total.haber, { align: 'right' });
				doc.text(pageWith - 12, y, account.total.final, { align: 'right' });

				y += (splitTitle.length * 4);
				break;
			default:
				break;
		}

		if (account.subcuenta && account.subcuenta.length > 0) {
			for (let data of account.subcuenta) {
				if (y >= (pageHeight - 10)) {
					y = 46;
					doc.addPage('letter', 'portrait');
					var documentAux = [doc];
					this.addHeader(documentAux);
					doc = documentAux[0];
				}
				var documentAux = [doc];
				y = this.addAccount(documentAux, data, y);
				doc = documentAux[0];
			}
			if (y >= (pageHeight - 10)) {
				y = 46;
				doc.addPage('letter', 'portrait');
				var documentAux = [doc];
				this.addHeader(documentAux);
				doc = documentAux[0];
			}
			switch (account.nivel) {
				case "1":
					doc.setFontSize(13);
					doc.setFontStyle("bold");
					var splitTitle = doc.splitTextToSize("TOTAL  " + account.cuenta.trim() + "  " + account.descripcion.trim(), pageWith - 125);
					doc.text(12, y, splitTitle);
					doc.setFontSize(8);
					doc.text(pageWith - 92, y, account.total.inicial, { align: 'right' });
					doc.text(pageWith - 65, y, account.total.debe, { align: 'right' });
					doc.text(pageWith - 39, y, account.total.haber, { align: 'right' });
					doc.text(pageWith - 12, y, account.total.final, { align: 'right' });
					y += (splitTitle.length * 5);
					break;
				case "2":
					doc.setFontSize(11);
					doc.setFontStyle("bold");
					var splitTitle = doc.splitTextToSize("TOTAL  " + account.cuenta.trim() + "  " + account.descripcion.trim(), pageWith - 125);
					doc.text(12, y, splitTitle);
					doc.setFontSize(8);
					doc.text(pageWith - 92, y, account.total.inicial, { align: 'right' });
					doc.text(pageWith - 65, y, account.total.debe, { align: 'right' });
					doc.text(pageWith - 39, y, account.total.haber, { align: 'right' });
					doc.text(pageWith - 12, y, account.total.final, { align: 'right' });
					y += (splitTitle.length * 5);
					break;
				case "3":
					doc.setFontSize(9);
					doc.setFontStyle("bold");
					var splitTitle = doc.splitTextToSize("TOTAL  " + account.cuenta.trim() + "  " + account.descripcion.trim(), pageWith - 125);
					doc.text(12, y, splitTitle);
					doc.setFontSize(8);
					doc.text(pageWith - 92, y, account.total.inicial, { align: 'right' });
					doc.text(pageWith - 65, y, account.total.debe, { align: 'right' });
					doc.text(pageWith - 39, y, account.total.haber, { align: 'right' });
					doc.text(pageWith - 12, y, account.total.final, { align: 'right' });
					y += (splitTitle.length * 5);
					break;
				case "4":
					doc.setFontSize(8);
					doc.setFontStyle("bold");
					var splitTitle = doc.splitTextToSize("TOTAL  " + account.cuenta.trim() + "  " + account.descripcion.trim(), pageWith - 125);
					doc.text(12, y, splitTitle);
					doc.setFontSize(8);
					doc.text(pageWith - 92, y, account.total.inicial, { align: 'right' });
					doc.text(pageWith - 65, y, account.total.debe, { align: 'right' });
					doc.text(pageWith - 39, y, account.total.haber, { align: 'right' });
					doc.text(pageWith - 12, y, account.total.final, { align: 'right' });
					y += (splitTitle.length * 5);
					break;
				default:
					break;
			}
		}
		return y;
	}
}
