import { Component, OnInit } from '@angular/core';

import {Message} from 'primeng/api';
import * as jsPDF from 'jspdf';

import { Company, CompanyImpl, OtherTransaction } from "../../models";
import { CompanyService, RosterService, ExportExcelService } from "../../services";
import { Configuration } from '../../app.configuration';

@Component({
  selector: 'app-other-transaction',
  templateUrl: './other-transaction.component.html',
  styleUrls: ['./other-transaction.component.css'],
  providers: [CompanyService,RosterService, ExportExcelService]
})
export class OtherTransactionComponent implements OnInit {
  receiptTitle : string  = "Otras transacciones";
  es: any;
  today : Date;

  msgs: Message[] = [];

  companys : Company[] = [];
  selectedCompany : Company = {};
  company : CompanyImpl;
  rangeDates: Date[];
  showResult: boolean = false;

  transactions : OtherTransaction[] = [];

  constructor(private srvComp : CompanyService, private srvCest: RosterService, private srvXLS: ExportExcelService) { 
    this.today = new Date(Date.now());
    this.es = {
      firstDayOfWeek: 1,
      dayNames: [ "Domingo","Lunes","Martes","Miércoles","Jueves","Viernes","sábado" ],
      dayNamesShort: [ "Dom","Lun","Mar","Mié","Jue","Vie","Sáb" ],
      dayNamesMin: [ "D","L","M","X","J","V","S" ],
      monthNames: [ "Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre" ],
      monthNamesShort: [ "Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic" ],
      today: 'Hoy',
      clear: 'Borrar'
    }
  }

  ngOnInit() {
    this.srvComp.getCompanys("nomi").subscribe(data => {this.getCompanysCatalog(data);},error => {console.log(error);});
  }

  private getCompanysCatalog(data){
    this.msgs = [];
    if(!data) {
      this.msgs.push({severity:'error', summary:'ERROR', detail:'No hay empresas que mostrar'});
      return;
    }
    this.companys = data;
  }

  getCalcResult(event) {
    this.msgs = [];
    this.showResult = false;
    if(!this.selectedCompany || Configuration.isEmpty(this.selectedCompany)) {
      this.msgs.push({severity:'error', summary:'ERROR', detail:'Debe seleccionar una empresa'});
      return;
    } else {
      this.company = new CompanyImpl(this.selectedCompany.cod_empresa,this.selectedCompany.nombre_empresa,this.selectedCompany.rif,this.selectedCompany.base_de_datos,this.selectedCompany.tipo_factura);
      this.srvCest.getOtherTransaction(this.company.base_de_datos).subscribe(data => {this.loadData(data);},error => {console.log(error);});
    }
  }

  private loadData(data) {
    if(!data){
      this.msgs.push({severity:'info', summary:'Resultado', detail:'No se encontro informacion con esos filtros'});
      return;
    }
    this.transactions = data;
    this.showResult = true;
  }

  printAllReceipt(){
    var doc = new jsPDF();
    doc.setProperties({
      orientation: 'portrait',
      unit: 'mm',
      format: 'letter',
      title: 'Recibo'+this.company.cod_empresa,
      subject: 'OtherTransaction'+this.company.cod_empresa,
      author: this.company.nombre_empresa,
      creator: this.company.nombre_empresa
    });
  
    let firstPage: boolean = true;
    for(let data of this.transactions){
      if(!firstPage) {
        doc.addPage('letter','portrait');
      } else {
        firstPage = false;
      }      
      var document = [doc];
      this.workerReceipt(document,data);
      doc = document[0];
    }

    var blob = doc.output("blob");
    window.open(URL.createObjectURL(blob));
  }

  printReceipt(data:OtherTransaction) {
    var doc = new jsPDF();
    doc.setProperties({
      orientation: 'portrait',
      unit: 'mm',
      format: 'letter',
      title: 'Recibo'+this.company.cod_empresa+'_'+data.cedula_identidad,
      subject: 'OtherTransaction'+data.cedula_identidad,
      author: this.company.nombre_empresa,
      creator: this.company.nombre_empresa
    });

    var document = [doc];
    this.workerReceipt(document,data);
    doc = document[0];

    var blob = doc.output("blob");
    window.open(URL.createObjectURL(blob));

  }

  private workerReceipt(document, data:OtherTransaction) {
    var pageWith = 215.9;
    var pageHeight = 279.4;
    var middleWith = pageWith/2;
    var middleHeight = pageHeight/2;
    var doc = document[0];
    doc.line(0, middleHeight, pageWith, middleHeight);
    var document1 = [doc];
    this.individualReceipt(document1,10,data);
    doc = document1[0];
    var document2 = [doc];
    this.individualReceipt(document2,middleHeight+10,data);
    doc = document2[0];
  }

  private individualReceipt(document, posY, data:OtherTransaction) {


    var pageWith = 215.9;
    var pageHeight = 279.4;
    var middleWith = pageWith/2;
    var middleHeight = pageHeight/2;

    var doc = document[0];
    var y : number = posY;

    //Line 1
    doc.addImage(this.company.logo, 'JPEG', 15, posY-5,this.company.logo_width,this.company.logo_height);
    doc.setFont("helvetica");
    doc.setFontSize(12);
    doc.setFontStyle("bold");
    doc.text(middleWith, y, this.company.nombre_empresa, {align: 'center'});

    //Line 2
    y = y + 6;
    doc.text(middleWith, y, this.receiptTitle, {align: 'center'});

    //Line 3
    y = y + 6;
    doc.setFontSize(8);
    doc.setFontStyle("normal");
    var hasta = data.periodo_hasta;
    if(data.periodo_hasta) {
      hasta = data.periodo_hasta.substring(8,10)+"/"+data.periodo_hasta.substring(5,7)+'/'+data.periodo_hasta.substring(0,4)
      //hasta = data.periodo_hasta.substring(8,10)+" de "+this.es.monthNames[data.periodo_hasta.substring(5,7)-1]+' de '+data.periodo_hasta.substring(0,4)
    }
    var desde = data.periodo_desde;
    if(data.periodo_desde) {
      desde = data.periodo_desde.substring(8,10)+"/"+data.periodo_desde.substring(5,7)+'/'+data.periodo_desde.substring(0,4)
      //desde = data.periodo_desde.substring(8,10)+" de "+this.es.monthNames[data.periodo_desde.substring(5,7)-1]+' de '+data.periodo_desde.substring(0,4)
    }
    doc.text(middleWith, y, 'DESDE ' + desde + ' HASTA ' + hasta, {align: 'center'});
    y = y + 2;
  
    var bottomY = middleHeight - 5;
    if(posY > 10) {
      bottomY = pageHeight-5;
    }
    doc.line(10, y+2, pageWith-15, y+2); //top line
    var top = y+2;
    var yC = y+2;

    //Line 3
    doc.setFontSize(7);
    y = y + 6;
    doc.setFontStyle("bold");
    doc.text(30, y, 'Ficha: ' + data.cod_integrante, {align: 'center'});
    doc.text(51, y, 'Apellidos / Nombres: ' + data.nombre_completo);
    doc.line(10, y+1, pageWith-15, y+1);

    //Line 4
    y = y + 5;
    doc.setFontStyle("bold");
    doc.text(30, y, 'Cedula Id.: ' + data.cedula_identidad, {align: 'center'});
    doc.text(51, y, 'Cargo: ' + data.desc_cargo);
    doc.line(10, y+1, pageWith-15, y+1);

    //Line 5
    var yS = y;
    y = y + 5;
    doc.setFontStyle("bold");
    var fecha_ingreso = data.fecha_ingreso;
    if(data.fecha_ingreso) {
      fecha_ingreso = data.fecha_ingreso.substring(8,10)+"/"+data.fecha_ingreso.substring(5,7)+'/'+data.fecha_ingreso.substring(0,4)
      //fecha_ingreso = data.fecha_ingreso.substring(8,10)+" de "+this.es.monthNames[data.fecha_ingreso.substring(5,7)-1]+' de '+data.fecha_ingreso.substring(0,4)
    }
    doc.text(30, y, 'Fecha Ing.: ' + fecha_ingreso, {align: 'center'});
    doc.text(51, y, 'Salario: '+data.sueldo_basico);
    doc.text(81, y, 'Departamento: ' + data.desc_departamento);
    doc.line(80, yS, 80, y+2);
    doc.line(50, yC, 50, y+2);
    
    //Line 6
    y = y + 6;
    yC = y-4;
    doc.setFillColor(180,180,180);
    doc.rect(10,yC,pageWith-25,6,'F');
    doc.line(10, yC, pageWith-15, yC);
    doc.setFontStyle("bold");
    doc.text(12, y, 'Codigo');
    doc.text(26, y, 'Descripción Concepto');
    doc.text(81, y, 'Factor');
    doc.text(101, y, 'Unid.');
    doc.text(121, y, 'Razón');
    doc.text(151, y, 'Asignación');
    doc.text(176, y, 'Deducción');

    //Line 7
    doc.setFontStyle("normal");
    y = y + 1;
    for(let concepto of data.conceptos){
      y = y + 4;
      doc.text(12, y, concepto.cod_concepto, {align: 'left'});
      doc.text(26, y, concepto.descripcion_concepto, {align: 'left'});
      doc.text(81, y, concepto.factor, {align: 'left'});
      doc.text(101, y, concepto.unidad);
      doc.text(148, y, concepto.monto, {align: 'right'});
      doc.text(174, y, (concepto.tipo_concepto=='Asignacion'?concepto.monto:'0,00'), {align: 'right'});
      doc.text(pageWith-16, y, (concepto.tipo_concepto=='Deduccion'?concepto.monto:'0,00'), {align: 'right'});  
      doc.line(10, y+1, pageWith-15, y+1);
    }
    doc.setFontStyle("bold");
    doc.line(25, yC, 25, y+1);
    doc.line(80, yC, 80, y+1);
    doc.line(100, yC, 100, y+1);
    doc.line(120, yC, 120, y+1);
    y = y + 4;
    doc.text(70, y, 'TOTALES', {align: 'center'});
    doc.text(174, y, data.subtotalA, {align: 'right'});
    doc.text(pageWith-16, y, data.subtotalD, {align: 'right'});
    doc.line(10, y+1, pageWith-15, y+1);
    doc.line(150, yC, 150, y+1);
    doc.line(175, yC, 175, y+1);
    doc.line(10, top, 10, y+1);
    doc.line(pageWith-15, top, pageWith-15, y+1);

    //Line 8
    y = y + 4;
    doc.line(140, y, pageWith-15, y);

    //Line 9
    yC = y;
    y = y + 3;
    doc.setFontStyle("bold");
    doc.text(170, y, 'Neto Pagado', {align: 'center'});
    y = y + 1;
    doc.line(140, y, pageWith-15, y);

    //Line 16
    y = y + 3;
    doc.setFontStyle("bold");
    doc.text(pageWith-16, y, data.total, {align: 'right'});
    y = y + 1;
    doc.line(140, y, pageWith-15, y);
    doc.line(140, yC, 140, y);
    doc.line(pageWith-15, yC, pageWith-15, y);
    doc.line(15, y, 80, y);

    //Line 20
    y = y+3;
    doc.text(15, y, 'Firma del trabajador');
    y = y+3;
    doc.text(15, y, 'CI:');
  }

  exportToExcel() {
    /*
    var columns = [{header: 'Ficha', key: 'cod_integrante', width: 10},
      {header: 'Cedula', key: 'cedula_identidad', width: 10},
      {header: 'Trabajador', key: 'nombre_completo', width: 30},
      {header: 'Fecha Ingreso', key: 'fecha_ingreso', width: 15},
      {header: 'Cargo', key: 'desc_cargo', width: 50},
      {header: 'Departamento', key: 'desc_departamento', width: 50},
      {header: 'Monto Total', key: 'total', width: 20},
    ];
    this.srvXLS.createSimpleExcel(this.selectedCompany.nombre_empresa+'.xlsx',this.selectedCompany.nombre_empresa,'CestaTicketResumen', columns, this.cestatickets);
    */
    this.srvXLS.cestaticketResume(this.selectedCompany.nombre_empresa, this.transactions);
    
  }



}
