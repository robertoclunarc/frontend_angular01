import { CargosService } from './../../services/cargos.service';
import { Component, Input, OnInit } from '@angular/core';
import { EmpresacomprasService } from 'src/app/services/empresacompras.service';
import { OrdenCompraDetalleService } from 'src/app/services/orden-compra-detalle.service';
import { OrdenCompraService } from 'src/app/services/orden-compra.service';
import { ProveedoresComprasService } from 'src/app/services/proveedores-compras.service';
import { OrdenCompra } from 'src/app/models/orden-compra';
import { detalleOcModelo } from 'src/app/models/oc-Detalle';
import { ProveedorModelo } from 'src/app/models/proveedor-modelo';
import { EmpresaCompras } from 'src/app/models/empresa-compras';

import * as jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import autoTable from 'jspdf-autotable';

@Component({
	selector: 'app-print-oc',
	templateUrl: './print-oc.component.html',
	styleUrls: ['./print-oc.component.scss']
})
export class PrintOcComponent implements OnInit {

	@Input() idOc: number = -1;
	ordenCompra: OrdenCompra = {};
	detallesOC: detalleOcModelo[] = [];
	datosProveedor: ProveedorModelo = {};
	datosEmpresa: EmpresaCompras = {};
	personaGerente: string = "";
	cargoBuscar: string = "gerente";

	desab: boolean = false;
	labelButton: String = "Imprimir...";

	constructor(private svrOc: OrdenCompraService, private svrOcDetalle: OrdenCompraDetalleService,
		private svrProveedor: ProveedoresComprasService, private svrEmpresaCompras: EmpresacomprasService,
		private svrCargos: CargosService) { }

	async ngOnInit(): Promise<void> {
		this.ordenCompra = { ... (await this.svrOc.getOcOne(this.idOc).toPromise()) }
		this.detallesOC = [... await this.svrOc.getDetallesPorOC(this.idOc).toPromise()];
		this.datosProveedor = await this.svrProveedor.getOne(this.ordenCompra.idProveedor).toPromise();
		this.datosEmpresa = (await this.svrEmpresaCompras.getDetalleEmpresaCompras(this.ordenCompra.IdComprasEmpresa).toPromise())[0];
		this.personaGerente = (await this.svrCargos.persona_cargo(this.ordenCompra.idConfigGerencia, this.cargoBuscar).toPromise()).nombre_completo;
		// console.log(this.ordenCompra.idConfigGerencia);
		// console.log("nombre", this.personaGerente);
	}

	imprimir() {
		this.desab = true;
		this.labelButton = "Generando PDF, espere ...";
		let source = document.getElementById("contentTable"); //TOMAR EL DIV PADRE
		html2canvas(source).then(canvas => {
			var imgWidth = 208;
			var pageHeight = 295;
			var imgHeight = canvas.height * imgWidth / canvas.width;
			var heightLeft = imgHeight;
			const contentDataURL = canvas.toDataURL('image/png')
			// let pdf = new jsPDF('p', 'mm', 'a4'); // A4 size page of PDF  
			let pdf = new jsPDF();
			pdf.setProperties({
				orientation: 'portrait',
				unit: 'mm',
				format: 'letter',
				// title: 'Factura_' + this.selectedCompany.cod_empresa + '_' + data.num_factura,
				// subject: data.cli_nombre,
				// author: this.selectedCompany.nombre_empresa,
				// creator: this.selectedCompany.nombre_empresa
			});
			pdf.addImage(contentDataURL, 'PNG', 0, 0, imgWidth, imgHeight)

			// import("jspdf-autotable").then(x => {
			//     pdf.autoTable(this.exportColumns, this.detallesOC);
			// })
			pdf.save(`orden_compra_nro_${this.ordenCompra.idComprasOC}.pdf`); // Generated PDF   
			this.desab = false;
			this.labelButton = "Imprimir...";
		});
	}

}
