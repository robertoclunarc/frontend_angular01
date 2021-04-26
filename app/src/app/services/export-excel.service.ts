import { Injectable } from '@angular/core';

//https://www.codeproject.com/Tips/1251189/Excel-Export-from-Angular-2plus
//https://www.npmjs.com/package/exceljs
//https://www.npmjs.com/package/file-saver

import * as Excel from "exceljs/dist/exceljs.min.js";
import * as ExcelProper from "exceljs";
import * as FileSaver from 'file-saver';

@Injectable({
  providedIn: 'root'
})
export class ExportExcelService {
  blobType: string = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';

  constructor() { }

  createSimpleExcel(filename, creator, sheetName, excelColumns, excelData) {
    var workbook = new Excel.Workbook();
    workbook.creator = creator;
    workbook.lastModifiedBy = creator;
    workbook.created = new Date();
    workbook.modified = new Date();
    workbook.addWorksheet(sheetName, { views: [{ activeCell: 'A1', showGridLines: true }] })
    var sheet = workbook.getWorksheet(1);
    sheet.columns = excelColumns;
    sheet.addRows(excelData);
    workbook.xlsx.writeBuffer().then(data => {
     const blob = new Blob([data], { type: this.blobType }); 
     FileSaver.saveAs(blob, filename);
    });
  }

  cestaticketResume(companyName,excelData){
    var filename = companyName+".xlsx";
    var workbook = new Excel.Workbook();
    workbook.creator = companyName;
    workbook.lastModifiedBy = companyName;
    workbook.created = new Date();
    workbook.modified = new Date();
    
    var deparmentData = [];
    var total = 0;
    var totalAll = 0;
    for(let row of excelData) {
      if(!deparmentData[row.cod_departamento]) {
        total = 0;
        deparmentData[row.cod_departamento] = [];
      } else {
        total = deparmentData[row.cod_departamento].total;
      }
      var amount = row.total.replace(".","");
      amount = amount.replace(",",".");
      total = total + Number(amount);
      totalAll = totalAll + Number(amount);
      var element = {cod_departamento : row.cod_departamento, desc_departamento : row.desc_departamento, total : total};
      deparmentData[row.cod_departamento] = element;
    }

    //HOJA DETALLADO
    var excelColumns = [{header: 'Ficha', key: 'cod_integrante', width: 10},
      {header: 'Cedula', key: 'cedula_identidad', width: 10},
      {header: 'Trabajador', key: 'nombre_completo', width: 30},
      {header: 'Fecha Ingreso', key: 'fecha_ingreso', width: 15},
      {header: 'Cargo', key: 'desc_cargo', width: 50},
      {header: 'Departamento', key: 'desc_departamento', width: 50},
      {header: 'Cod Concepto', key: 'cod_concepto', width: 10},
      {header: 'Concepto', key: 'descripcion_concepto', width: 20},
      {header: 'Tipo', key: 'tipo_concepto', width: 20},
      {header: 'Factor', key: 'factor', width: 20},
      {header: 'Monto', key: 'monto', width: 20},
    ];
    var detail = [];
    for(let row of excelData) {
      var e = {cod_integrante : row.cod_integrante, cedula_identidad: row.cedula_identidad, nombre_completo:row.nombre_completo, fecha_ingreso: row.fecha_ingreso, desc_cargo: row.desc_cargo, desc_departamento: row.desc_departamento, cod_concepto:'', descripcion_concepto: '',tipo_concepto:'',factor:'',monto:''};
      for(let c of row.conceptos) {
        e.cod_concepto = c.cod_concepto;
        e.descripcion_concepto = c.descripcion_concepto;
        e.tipo_concepto = c.tipo_concepto;
        e.factor = c.factor;
        e.monto = c.monto;
        detail.push(e);
      }
    }
    workbook.addWorksheet("Detalle", { views: [{ activeCell: 'A1', showGridLines: true }] })
    var sheet = workbook.getWorksheet(1);
        sheet.columns = excelColumns;
        sheet.addRows(detail);
        sheet.addRow({cod_integrante : "", cedula_identidad : "", nombre_completo: "", fecha_ingreso: "", desc_cargo: "", desc_departamento:"", cod_concepto: "", descripcion_concepto:"", tipo_concepto:"", factor: "TOTAL", monto : totalAll});


    //HOJA RESUMEN POR TRABAJADOR
    excelColumns = [{header: 'Ficha', key: 'cod_integrante', width: 10},
      {header: 'Cedula', key: 'cedula_identidad', width: 10},
      {header: 'Trabajador', key: 'nombre_completo', width: 30},
      {header: 'Fecha Ingreso', key: 'fecha_ingreso', width: 15},
      {header: 'Cargo', key: 'desc_cargo', width: 50},
      {header: 'Departamento', key: 'desc_departamento', width: 50},
      {header: 'Monto Total', key: 'total', width: 20},
    ];
    workbook.addWorksheet("PorTrabajador", { views: [{ activeCell: 'A1', showGridLines: true }] })
    var sheet = workbook.getWorksheet(2);
    sheet.columns = excelColumns;
    sheet.addRows(excelData);
    sheet.addRow({cod_integrante : "", cedula_identidad : "", nombre_completo: "", fecha_ingreso: "", desc_cargo: "", desc_departamento:"TOTAL", total : totalAll});

    //HOJA RESUMEN POR DEPARTAMENTO
    excelColumns = [{header: 'Cod Departamento', key: 'cod_departamento', width: 10},
      {header: 'Departamento', key: 'desc_departamento', width: 50},
      {header: 'Monto Total', key: 'total', width: 20},
    ];

    workbook.addWorksheet("PorDepartamento", { views: [{ activeCell: 'A1', showGridLines: true }] })
    var sheet = workbook.getWorksheet(3);
        sheet.columns = excelColumns;
        sheet.addRows(deparmentData);
        sheet.addRow({cod_departamento : "", desc_departamento : "TOTAL", total : totalAll});
    workbook.xlsx.writeBuffer().then(data => {
     const blob = new Blob([data], { type: this.blobType }); 
     FileSaver.saveAs(blob, filename);
    });
  }

}
