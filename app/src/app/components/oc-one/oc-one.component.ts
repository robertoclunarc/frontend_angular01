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
	idOrdenCompra: number;	

	constructor() { }

	ngOnInit(): void {

		this.idOrdenCompra=this.idOc
	}	

}
