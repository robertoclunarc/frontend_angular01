import { Component, OnInit } from '@angular/core';
import {Message} from 'primeng/api';
import * as jsPDF from 'jspdf';

import { Company, Cestaticket, CompanyImpl } from "../../models";
import { CompanyService, RosterService, ExportExcelService } from "../../services";
import { Configuration } from '../../app.configuration';


@Component({
  selector: 'app-cesta-ticket',
  templateUrl: './cesta-ticket.component.html',
  styleUrls: ['./cesta-ticket.component.css'],
  providers: [CompanyService,RosterService, ExportExcelService]
})
export class CestaTicketComponent implements OnInit {
  es: any;
  maxDate : Date;

  msgs: Message[] = [];

  companys : Company[] = [];
  selectedCompany : Company = {};
  rangeDates: Date[];
  showResult: boolean = false;
  company : CompanyImpl;

  cestatickets: Cestaticket[] = [];

  
  posXCedula:number=7;
  posXTrabajador:number=20;

  posXCargo:number=80;
  posXFechaIngreso:number=0;
  posXAsignacion:number=146;
  posXDeduccion:number=165;
  posXTotal:number=183;


  constructor(private srvComp : CompanyService, private srvCest: RosterService, private srvXLS: ExportExcelService) {
    this.maxDate = new Date(Date.now());
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

  execCalc(event) {
    this.msgs = [];
    this.showResult = false;
    if(!this.selectedCompany || Configuration.isEmpty(this.selectedCompany)) {
      this.msgs.push({severity:'error', summary:'ERROR', detail:'Debe seleccionar una empresa'});
      return;
    } else {
      var since = "";
      var until = "";
      if(this.rangeDates && (this.rangeDates.length >= 1 || this.rangeDates.length <= 2)) {
        since = this.rangeDates[0].getFullYear()+'-'+(this.rangeDates[0].getMonth()+1)+'-'+this.rangeDates[0].getDate();
        if(this.rangeDates[1] == null || Configuration.isEmpty(this.rangeDates[1])) {
          until = since;
        } else {
          until = this.rangeDates[1].getFullYear()+'-'+(this.rangeDates[1].getMonth()+1)+'-'+this.rangeDates[1].getDate(); 
        }
        this.srvCest.calcCestaticket(this.selectedCompany.base_de_datos,since,until).subscribe(data => {this.getCestaticketData(data);},error => {console.log(error);});
      } else {
        this.msgs.push({severity:'error', summary:'ERROR', detail:'Debe indicar el rango de fecha utilizar para calcular o mostrar la informacion'});
      }
    }
  }
  
  private getCestaticketData(data){
    if(!data){
      this.msgs.push({severity:'error', summary:'ERROR', detail: 'Hubo algun problema en el calculo'});
      return;
    }
    if(data.error) {
      this.msgs.push({severity:'error', summary:'ERROR', detail: data.error});
      return;
    }

    this.srvCest.getCestaticket(this.selectedCompany.base_de_datos).subscribe(data => {this.loadData(data);},error => {console.log(error);});
  }

  private loadData(data) {
    if(!data){
      this.msgs.push({severity:'info', summary:'Resultado', detail:'No se encontro informacion con esos filtros'});
      return;
    }
    this.cestatickets = data;
    this.showResult = true;
  }

  getCalcResult(event) {
    this.msgs = [];
    this.showResult = false;
    if(!this.selectedCompany || Configuration.isEmpty(this.selectedCompany)) {
      this.msgs.push({severity:'error', summary:'ERROR', detail:'Debe seleccionar una empresa'});
      return;
    } else {
      this.srvCest.getCestaticket(this.selectedCompany.base_de_datos).subscribe(data => {this.loadData(data);},error => {console.log(error);});
    }
  }

  printPreAll(){

    var doc = new jsPDF();
    var pageWith = 215.9;
    var pageHeight = 279.4;
    var totalCancelar:number=0;

    doc.setProperties({
      orientation: 'portrait',
      unit: 'mm',
      format: 'letter',
      title: 'Recibo'+this.selectedCompany.cod_empresa,
      subject: 'Cestaticket'+this.selectedCompany.cod_empresa,
      author: this.selectedCompany.nombre_empresa,
      creator: this.selectedCompany.nombre_empresa
    });

    this.company = new CompanyImpl(this.selectedCompany.cod_empresa,this.selectedCompany.nombre_empresa,this.selectedCompany.rif,this.selectedCompany.base_de_datos,this.selectedCompany.tipo_factura);

    let firstPage: boolean = true;
    var y = 46;
    for(let data of this.cestatickets){
      if(!firstPage && y >= (pageHeight - 10)) {
        y = 46;
        doc.addPage('letter','portrait');
        //var document = [doc];
        this.addHeader(document);
        doc = document[0];
      } else if(firstPage){
        firstPage = false;
        var document = [doc];
        this.addHeader(document);
        doc = document[0];
      }
      var document = [doc];
      y = this.addWorker(document, data, y);

      totalCancelar = totalCancelar + Configuration.stringToNumber(data.total);
      doc = document[0];
    }

    doc.setFontSize(9);
    doc.setFontStyle("bold");
    doc.text(this.posXTotal-10, y+5, 'Total General a Cancelar:', {align: 'right'});
    doc.text(this.posXTotal+21, y+5, Configuration.numberFormat(totalCancelar, true), {align: 'right'});
    
    var blob = doc.output("blob");
    window.open(URL.createObjectURL(blob));
 }

 private addHeader(document) {
  var pageWith = 215.9;
  var middleWith = pageWith/2;

  var doc = document[0];
  var y : number = 15;

  if(!Configuration.isEmpty(this.company.logo)) {
    doc.addImage(this.company.logo, 'JPEG', 12, y-5,this.company.logo_width,this.company.logo_height);
  }
  doc.setFont("helvetica");
  doc.setFontSize(14);
  doc.setFontStyle("bold");
  doc.text(middleWith, y, this.selectedCompany.nombre_empresa, {align: 'center'});

  y = y + 6;
  doc.setFontSize(12);
  doc.setFontStyle("bold");
  doc.text(middleWith, y, "REPORTE CESTATICKET", {align: 'center'});

  var since = "";
  var until = "";
  if(this.rangeDates && (this.rangeDates.length >= 1 || this.rangeDates.length <= 2)) {
    since = this.rangeDates[0].getDate()+'/'+(this.rangeDates[0].getMonth()+1)+'/'+this.rangeDates[0].getFullYear();
    if(this.rangeDates[1] == null || Configuration.isEmpty(this.rangeDates[1])) {
      until = since;
    } else {
      until = this.rangeDates[1].getDate()+'/'+(this.rangeDates[1].getMonth()+1)+'/'+this.rangeDates[1].getFullYear();
    }
  }
  y = y + 4;
  doc.setFontSize(12);
  doc.setFontStyle("bold");
  
  y = y + 10;
  doc.setFontSize(9);
  doc.setFontStyle("normal");
  var today = new Date();
  doc.text(pageWith-25, y, Configuration.getdatetime(today), {align: 'right'});

  y = y + 5
  doc.setFontSize(9);
  doc.setFontStyle("bold");
  doc.text(this.posXCedula, y, "Cédula");
  doc.text(this.posXTrabajador, y, "Trabajador");
  doc.text(this.posXCargo,  y, "Cargo");
  
  
  // De derecha a izquierda 
  doc.text(this.posXTotal+5,  y, "T. Cancelar");
  this.posXDeduccion = this.posXTotal-7;
  doc.text(this.posXDeduccion,  y, "Deduc.");
  this.posXAsignacion =  this.posXDeduccion - 10;
  doc.text(this.posXAsignacion,  y, "Asig.");
  
  this.posXFechaIngreso=  this.posXAsignacion - 27;
  doc.text(this.posXFechaIngreso,  y, "Fecha Ingreso");

  y = y + 1;
  doc.line(this.posXCedula, y, pageWith-10, y);
}


private addWorker(document, data:Cestaticket, posY){

  var pageWith = 215.9;
  var pageHeight = 279.4;
  var middleWith = pageWith/2;
  var middleHeight = pageHeight/2;
  var doc = document[0];
  var y : number = posY;
  var cont:number=4;

  doc.setFontSize(7);
  doc.setFontStyle("normal");
  doc.text(this.posXCedula+10, y, data.cedula_identidad.trim(), {align: 'right'});

  var splitTitle = doc.splitTextToSize(data.nombre_completo.trim(), (pageWith - this.posXTrabajador - 135));
 
  if(splitTitle.length>1){
    cont=7;
    console.log(splitTitle.length);
  }
    
  doc.text(this.posXTrabajador, y, splitTitle);
  
  var splitTitle = doc.splitTextToSize(data.desc_cargo.trim(), (pageWith - this.posXCargo - 80));

  if(splitTitle.length>1){
    cont=4;
  }
 
  doc.text(this.posXCargo, y, splitTitle);

  // de derecha a izquierda
  
  doc.text(this.posXTotal+21, y, data.total.trim(), {align: 'right'});
  
  doc.text(this.posXDeduccion+10, y, data.subtotalD.trim(), {align: 'right'});

  doc.text(this.posXAsignacion-10, y, data.fecha_ingreso.trim(), {align: 'right'});
  doc.text(this.posXAsignacion+7, y, data.subtotalA.trim(), {align: 'right'});


  y += (splitTitle.length*cont);
  return y;
}

  

  printAllReceipt(){
    var doc = new jsPDF();
    doc.setProperties({
      orientation: 'portrait',
      unit: 'mm',
      format: 'letter',
      title: 'Recibo'+this.selectedCompany.cod_empresa,
      subject: 'Cestaticket'+this.selectedCompany.cod_empresa,
      author: this.selectedCompany.nombre_empresa,
      creator: this.selectedCompany.nombre_empresa
    });
  
    let firstPage: boolean = true;
    for(let data of this.cestatickets){
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

  printReceipt(data:Cestaticket) {
    var doc = new jsPDF();
    doc.setProperties({
      orientation: 'portrait',
      unit: 'mm',
      format: 'letter',
      title: 'Recibo'+this.selectedCompany.cod_empresa+'_'+data.cedula_identidad,
      subject: 'Cestaticket'+data.cedula_identidad,
      author: this.selectedCompany.nombre_empresa,
      creator: this.selectedCompany.nombre_empresa
    });

    var document = [doc];
    this.workerReceipt(document,data);
    doc = document[0];

    var blob = doc.output("blob");
    window.open(URL.createObjectURL(blob));

  }

  private workerReceipt(document, data:Cestaticket) {
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

  private individualReceipt(document, posY, data:Cestaticket) {
    var pageWith = 215.9;
    var pageHeight = 279.4;
    var middleWith = pageWith/2;
    var middleHeight = pageHeight/2;

    var doc = document[0];
    var y : number = posY;

    //Line 1
    doc.setFont("helvetica");
    doc.setFontSize(8);
    doc.setFontStyle("bold");
    doc.text(15, y, this.selectedCompany.nombre_empresa + " / RIF " + this.selectedCompany.rif);

    //global framework
    var bottomY = middleHeight - 5;
    if(posY > 10) {
      bottomY = pageHeight-5;
    }
    doc.line(10, y+2, pageWith-15, y+2); //top line
    doc.line(10, y+2, 10, bottomY); //left line
    doc.line(10, bottomY, pageWith-15, bottomY); //bottom line
    doc.line(pageWith-15, y+2, pageWith-15, bottomY); //right line

    //Line 2
    y = y + 6;
    doc.setFillColor(210,210,210);
    doc.rect(10,y-4,pageWith-25,6,'F');
    doc.text(middleWith, y, 'RECIBO CESTATICKET ALIMENTACION SOCIALISTA GACETA No. 354, ART. 01 DECRETO CON FUERZA DE LEY No 3.233', {align: 'center'});

    //Line 3
    doc.setFontSize(7);
    y = y + 6;
    doc.text(11, y, 'APELLIDO Y NOMBRE');
    doc.setFontStyle("normal");
    doc.text(45, y, data.nombre_completo);
    doc.text(pageWith-20, y, data.cod_integrante, {align: 'right'});

    //Line 4
    y = y + 5;
    doc.setFontStyle("bold");
    doc.text(11, y, 'CEDULA DE IDENTIDAD');
    doc.setFontStyle("normal");
    doc.text(45, y, data.cedula_identidad);

    //Line 5
    y = y + 5;
    doc.setFontStyle("bold");
    doc.text(11, y, 'DEPARTAMENTO');
    doc.setFontStyle("normal");
    doc.text(45, y, data.desc_departamento);

    //Line 6
    y = y + 5;
    doc.setFontStyle("bold");
    doc.text(11, y, 'CARGO');
    doc.setFontStyle("normal");
    doc.text(45, y, data.desc_cargo);

    //Line 7
    y = y + 4;
    doc.line(50, y, 50, y+22);
    doc.setFillColor(210,210,210);
    doc.rect(10,y-2,pageWith-25,4,'F');
    doc.line(130, y-2, 130, y+22);
    doc.setFontStyle("bold");
    doc.text(70, y+1, 'CALCULO DEL TIEMPO', {align: 'center'});
    doc.text(165, y+1, 'PERIODO DE COBRO', {align: 'center'});

    //Line 8
    y = y + 5;
    doc.setFontStyle("bold");
    doc.text(11, y+2, 'FECHA DE INGRESO');
    var fecha = "";
    if(data.fecha_ingreso) {
      fecha = data.fecha_ingreso.substring(8,10)+"/"+data.fecha_ingreso.substring(5,7)+'/'+data.fecha_ingreso.substring(0,4)
    }
    doc.text(90, y+2, fecha, {align: 'center'});
    doc.text(165, y, 'DESDE', {align: 'center'});
    doc.setFillColor(180,180,180);
    doc.rect(130.2,y+1,pageWith-145.2,5,'F');
    doc.line(130, y+1, pageWith-15, y+1);
    y = y + 4;
    if(data.periodo_desde) {
      //fecha = data.periodo_desde.substring(8,10)+"/"+data.periodo_desde.substring(5,7)+'/'+data.periodo_desde.substring(0,4)
      fecha = data.periodo_desde.substring(8,10)+" de "+ this.es.monthNames[data.periodo_desde.substring(5,7)-1] +' de '+data.periodo_desde.substring(0,4) 
    }
    doc.text(165, y, fecha, {align: 'center'});
    y = y + 2;
    doc.line(10, y, pageWith-15, y);

    //Line 9
    y = y + 3;
    doc.setFontStyle("normal");
    doc.text(11, y, 'VALOR MENSUAL TICKET');
    doc.setFontStyle("bold");
    doc.text(90, y, 'Bs. '+ data.valor_mensual, {align: 'center'});
    doc.text(165, y, 'HASTA', {align: 'center'});
    y = y + 2;
    doc.line(10, y, pageWith-15, y);
    doc.setFillColor(180,180,180);
    doc.rect(130.2,y,pageWith-145.2,6,'F');

    //Line 10
    y = y + 3;
    doc.setFontStyle("normal");
    doc.text(11, y, 'VALOR DIARIO TICKET');
    doc.setFontStyle("bold");
    doc.text(90, y, 'Bs. '+data.valor_diario, {align: 'center'});
    if(data.periodo_hasta) {
      //fecha = data.periodo_hasta.substring(8,10)+"/"+data.periodo_hasta.substring(5,7)+'/'+data.periodo_hasta.substring(0,4)
      fecha = data.periodo_hasta.substring(8,10)+" de "+this.es.monthNames[data.periodo_hasta.substring(5,7)-1]+' de '+data.periodo_hasta.substring(0,4)
    }
    doc.text(165, y, fecha, {align: 'center'});
    y = y + 2;
    doc.line(10, y, pageWith-15, y);

    //Line 11
    y = y + 2;
    doc.setFillColor(210,210,210);
    doc.rect(10,y-2,pageWith-25,4,'F');
    doc.setFontStyle("bold");
    doc.text(middleWith, y+1, 'DEVENGADO', {align: 'center'});
    
    
    //Line 12
    y = y + 6;
    var yC = y-4;
    doc.setFillColor(180,180,180);
    doc.rect(10,yC,pageWith-25,6,'F');
    doc.line(10, yC, pageWith-15, yC);
    doc.setFontStyle("bold");
    doc.text(50, y, 'CONCEPTO', {align: 'center'});
    doc.text(110, y, 'DIAS', {align: 'center'});
    doc.text(140, y, 'ASIGNACIONES', {align: 'center'});
    doc.text(180, y, 'DEDUCCIONES', {align: 'center'});

    //Line 13
    doc.setFontStyle("normal");
    //doc.setFontSize(6);
    y = y + 1;
    for(let concepto of data.conceptos){
      y = y + 4;
      doc.text(11, y, concepto.descripcion_concepto, {align: 'left'});
      doc.text(110, y, concepto.factor, {align: 'center'});
      doc.text(159, y, (concepto.tipo_concepto=='Asignacion'?concepto.monto:'0,00'), {align: 'right'});
      doc.text(pageWith-16, y, (concepto.tipo_concepto=='Deduccion'?concepto.monto:'0,00'), {align: 'right'});
      doc.line(10, y+1, pageWith-15, y+1);
    }
    doc.setFontStyle("bold");
    doc.line(100, yC, 100, y+1);
    y = y + 4;
    doc.text(70, y, 'SUB TOTALES', {align: 'center'});
    doc.text(159, y, data.subtotalA, {align: 'right'});
    doc.text(pageWith-16, y, data.subtotalD, {align: 'right'});
    doc.line(10, y+1, pageWith-15, y+1);
    doc.line(120, yC, 120, y+1);
    doc.line(160, yC, 160, y+1);

    //Line 13
    y = y + 1.2;
    doc.setFillColor(255,255,255);
    doc.rect(9,y,pageWith-20,3,'F');
    y = y + 3;
    doc.line(10, y, pageWith-15, y);

    //Line 14
    y = y + 2;
    doc.setFillColor(210,210,210);
    doc.rect(10,y-2,pageWith-25,4,'F');
    doc.setFontStyle("bold");
    doc.text(middleWith, y+1, 'TOTAL PAGADO (BOLIVARES)', {align: 'center'});

    //Line 15
    y = y + 5;
    yC = y-3;
    doc.setFontStyle("bold");
    doc.text(40, y, 'TOTAL ASIGNACIONES', {align: 'center'});
    doc.text(110, y, 'TOTAL DEDUCCIONES', {align: 'center'});
    doc.text(170, y, 'TOTAL PAGADO', {align: 'center'});
    y = y + 1;
    doc.line(10, y, pageWith-15, y);

    //Line 16
    y = y + 3;
    doc.setFontStyle("bold");
    doc.text(79, y, data.subtotalA, {align: 'right'});
    doc.text(139, y, data.subtotalD, {align: 'right'});
    doc.text(pageWith-16, y, data.total, {align: 'right'});
    y = y + 1;
    doc.line(10, y, pageWith-15, y);
    doc.line(80, yC, 80, y);
    doc.line(140, yC, 140, y);

    //Line 17
    y = y + 0.2;
    doc.setFillColor(255,255,255);
    doc.rect(9,y,pageWith-20,3,'F');
    y = y + 3;
    doc.line(10, y, pageWith-15, y);

    //Line 18
    y = y + 2;
    doc.setFillColor(210,210,210);
    doc.rect(10,y-2,pageWith-25,4,'F');
    doc.setFontStyle("bold");
    doc.text(middleWith, y+1, 'CONSTANCIA DE LIQUIDACION', {align: 'center'});

    //Line 19
    y = y + 4;
    doc.setFontSize(6);
    doc.setFontStyle("normal");
    var texto = 'El trabajador conviene y reconoce recibir la cantidad de Bs. ' + data.total + ', en el acto de parte de la empresa ' + this.selectedCompany.nombre_empresa + ', queda satisfecho todos y cada uno de los conceptos, derechos y acciones que como consecuencia del Contrato de trabajo que  se sostiene  con  la  mencionada  empresa,  le corresponden,  de  conformidad  con el detalle de este recibo, de igual manera AUTORIZO se me realicen los descuentos correspondientes a los operativos de alimentacion realizados por la empresa y de los prestamos personales solicitados por mi por bienes y servcios, segun sea el caso. En consecuencia, el trabajador declara y reconoce que lo recibido no tendra incidencia salarial  para el calculo de las prestaciones sociales y otros beneficios segun lo dispuesto en el Art. 1 del Decreto con Fuerza de  Ley N° 3.601 de fecha Viernes 31 de agosto de 2018 de la Gaceta oficial Extraordinaria AÑO CXLV - MES XI No. 41.472';
    var splitTitle = doc.splitTextToSize(texto, pageWith-28);
    doc.text(11, y, splitTitle);
    y = y + (splitTitle.length*2);
    y = y + 1;
    doc.line(10, y, pageWith-15, y);

    //Line 20
    y = bottomY-1;
    doc.setFontSize(8);
    doc.setFontStyle("bold");
    doc.text(11, y, 'RECIBI CONFORME :');
    doc.line(40, y, 138, y);
    doc.text(140, y, 'CI :');
    doc.line(145, y, pageWith-16, y);
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
    this.srvXLS.cestaticketResume(this.selectedCompany.nombre_empresa, this.cestatickets);
    
  }

}
