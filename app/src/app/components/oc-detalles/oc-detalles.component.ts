import { EmpresaCompras } from './../../models/empresa-compras';
import { EmpresacomprasService } from './../../services/empresacompras.service';
import { OrdenCompraDetalleService } from './../../services/orden-compra-detalle.service';
import { detalleOcModelo } from './../../models/oc-Detalle';
import { Component, Input, OnInit, } from '@angular/core';
import { OrdenCompraService } from './../../services/orden-compra.service';
import { OrdenCompra } from './../../models/orden-compra';

@Component({
  selector: 'app-oc-detalles',
  templateUrl: './oc-detalles.component.html',
  styleUrls: ['./oc-detalles.component.scss']
})
export class OcDetallesComponent implements OnInit {

  @Input() idOc: number = -1;
	ordenCompra: OrdenCompra = {};
	detallesOC: detalleOcModelo[] = [];	
	datosEmpresa: EmpresaCompras = {};
	cols: any[] = [];
	exportColumns: any[] = [];

  constructor( 
    private svrOc: OrdenCompraService,   
    private svrOcDetalle: OrdenCompraDetalleService,	
    private svrEmpresaCompras: EmpresacomprasService
    ) { }

  ngOnInit(): void {
    this.cols = [
			{ field: 'codigo', header: 'Codigo', witdh: "10%" },
			{ field: 'nombre', header: 'Nombre', witdh: "20%" },
			{ field: 'descripcion', header: 'Descripcion', witdh: "20%" },
			{ field: 'cantidad_encontrada', header: 'Cant.', witdh: "5%" },
			{ field: 'unidad_medida', header: 'UND', witdh: "5%" },
			{ field: 'precio', header: 'Precio', witdh: "10%" },			
		];
		
		this.exportColumns = this.cols.map(col => ({ title: col.header, dataKey: col.field }));
		this.cargaData();
  }

  async cargaData() {
		// console.log(this.idOc);
    this.ordenCompra = await this.svrOc.getOcOne(this.idOc).toPromise();		
		this.detallesOC = [... await this.svrOc.getDetallesPorOC(this.idOc).toPromise()];		
		this.datosEmpresa = (await this.svrEmpresaCompras.getDetalleEmpresaCompras(this.ordenCompra.IdComprasEmpresa).toPromise())[0];
		
	}

}
