import { EmpresaCompras } from './../../models/empresa-compras';
import { EmpresacomprasService } from './../../services/empresacompras.service';
import { ProveedoresComprasService } from './../../services/proveedores-compras.service';
import { ProveedorModelo } from 'src/app/models/proveedor-modelo';
import { OrdenCompraDetalleService } from './../../services/orden-compra-detalle.service';
import { detalleOcModelo } from './../../models/oc-Detalle';
import { OrdenCompra } from './../../models/orden-compra';
import { OrdenCompraService } from './../../services/orden-compra.service';
import { Component, Input, OnInit, } from '@angular/core';

// import * as html2canvas from 'html2canvas';
// const html2canvas = require('../../../../node_modules/html2canvas');
// import * as jsPDF from 'jspdf';
// import html2canvas from 'html2canvas';
// import autoTable from 'jspdf-autotable';

@Component({
	selector: 'app-oc-one',
	templateUrl: './oc-one.component.html',
	styleUrls: ['./oc-one.component.scss']
})
export class OcOneComponent implements OnInit {

	@Input() idOc: number = -1;
	ordenCompra: OrdenCompra = {};
	detallesOC: detalleOcModelo[] = [];
	datosProveedor: ProveedorModelo = {};
	datosEmpresa: EmpresaCompras = {};
	cols: any[] = [];
	exportColumns: any[] = [];

	constructor(private svrOc: OrdenCompraService, private svrOcDetalle: OrdenCompraDetalleService,
		private svrProveedor: ProveedoresComprasService, private svrEmpresaCompras: EmpresacomprasService) { }

	ngOnInit(): void {

		this.cols = [
			{ field: 'codigo', header: 'Codigo', witdh: "10%" },
			{ field: 'nombre', header: 'Nombre', witdh: "20%" },
			{ field: 'descripcion', header: 'Descripcion', witdh: "20%" },
			{ field: 'cantidad_encontrada', header: 'Cant.', witdh: "5%" },
			{ field: 'unidad_medida', header: 'UND', witdh: "5%" },
			{ field: 'precio', header: 'Precio', witdh: "10%" },
			//{ field: 'nombre_activo', header: 'Proposito', witdh: "30%" }
		];
		/* 
				if (this.dataExtra === 1) {
					this.cols.push(
						{ field: 'cant_encontrada', header: 'Encon', witdh: "5%" },
						{ field: 'nombre_proveedor', header: 'Provee', witdh: "17%" },
						{ field: 'precio_neto', header: 'Precio (BsS)', witdh: "10%" }
					);
				} */
		this.exportColumns = this.cols.map(col => ({ title: col.header, dataKey: col.field }));
		this.cargaData();
	}

	async cargaData() {
		// console.log(this.idOc);

		this.ordenCompra = await this.svrOc.getOcOne(this.idOc).toPromise();
		this.detallesOC = [... await this.svrOc.getDetallesPorOC(this.idOc).toPromise()];
		this.datosProveedor = await this.svrProveedor.getOne(this.ordenCompra.idProveedor).toPromise();
		this.datosEmpresa = (await this.svrEmpresaCompras.getDetalleEmpresaCompras(this.ordenCompra.IdComprasEmpresa).toPromise())[0];
		// let ele = document.getElementById("ocMu");
		// console.log(ele.innerHTML);
		// console.log(this.datosEmpresa);
		//this.svrEmpresaCompras.getDetalleEmpresaCompras(this.ordenCompra.IdComprasEmpresa).toPromise().then(data=>{console.log(data);})
		// IdComprasEmpresa?,
		// nombre_empresa?,
		// rif?,
		// base_de_datos?,
		// fecha_ope?,
		// cerrada?,
		// direccion_fiscal?

		// let source = document.getElementById("contentTable"); //TOMAR EL DIV PADRE
		// html2canvas(source).then(canvas => {
		// 	var imgWidth = 208;
		// 	var pageHeight = 295;
		// 	var imgHeight = canvas.height * imgWidth / canvas.width;
		// 	var heightLeft = imgHeight;
		// 	const contentDataURL = canvas.toDataURL('image/png')
		// 	// let pdf = new jsPDF('p', 'mm', 'a4'); // A4 size page of PDF  
		// 	let pdf = new jsPDF();
		// 	pdf.setProperties({
		// 		orientation: 'portrait',
		// 		unit: 'mm',
		// 		format: 'letter',
		// 		// title: 'Factura_' + this.selectedCompany.cod_empresa + '_' + data.num_factura,
		// 		// subject: data.cli_nombre,
		// 		// author: this.selectedCompany.nombre_empresa,
		// 		// creator: this.selectedCompany.nombre_empresa
		// 	});
		// 	pdf.addImage(contentDataURL, 'PNG', 0, 10, imgWidth, imgHeight)

		// 	// import("jspdf-autotable").then(x => {
		// 	//     pdf.autoTable(this.exportColumns, this.detallesOC);
		// 	// })
		// 	autoTable(pdf, { head: this.exportColumns });
		// 	pdf.save('MYPdf.pdf'); // Generated PDF   

		// });




		// <b>A FAVOR DE: </b> <br>{{ordenCompra.nombre_proveedor}} <br>
		// import("jspdf").then(jsPDF => {
		// 	import("html2canvas").then((_) => {
		// 		const doc = new jsPDF.default(0, 0);
		// 		doc.html(source, {
		// 			callback: function (doc) {
		// 				doc.save();
		// 			},
		// 			x: 10,
		// 			y: 10
		// 		});
		// 	})
		// import("jspdf-autotable").then(x => {
		// const doc = new jsPDF.default(0, 0);
		// console.log(source);
		// html2pdf(source);
		// doc.html(source, {
		// 	callback: function (doc) {
		// 	  doc.save();
		// 	},
		// 	x: 10,
		// 	y: 10
		//  });
		// doc.fromHTML(
		// 	source,
		// 	15,
		// 	15,
		// );

		// doc.html(`OCtable`);
		// doc.fromHTML(ele, 0, 0);
		// doc.table(1, 1, [{empre:`b>A FAVOR DE: </b> <br>${this.ordenCompra.nombre_proveedor}<br>`}] ,[`empre`], { autoSize: true });
		// doc.autoTable({ html: '#OCtable' });
		//doc.autoTable(this.exportColumns, this.detallesOC);
		// doc.save('primengTable.pdf');
		// })
		// })
		// window.open(``);
		// console.log("proveedor", this.datosProveedor.rif);
	}

}
