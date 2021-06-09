export enum estadosDetalle {
	proceso = 0, 
	aprobado = 1, 
	anulado = 2 
}


export interface SolpedDetalleModelo {
	idDetalleSolped?,
	codigo?,
	nombre?,
	descripcion?,
	unidadMedidaC?,
	cantidad?,
	nroActivo?,
	fechaAlta?,
	fechaRequerida?,
	justificacion?,
	IdComprasEmpresa?,
	idGenAreaNegocio?,
	idGenCentroCostos?,
	idSolpedCompras?,
	idAreaTrabajo?,
	cant_encontrada? : number,
	cant_recibida?,
	precio? : number,
	idProveedor?,
	notas?,
	nombre_empresa?,
	nombre_an?,
	nombre_cc?,
	nombre_trabajo?,
	nombre_activo?,
	nombre_proveedor?;
	tipo?: string; //Original, Encontrado
	tasa_iva?: number, //para calculo
	precio_neto?: number, //para calculo
	precio_neto_usd? :number,
	precio_total_neto? : number, //para calculo
	subtotal? : number, //precio neto * cantidad
	precio_usd?: number,
	precio_usd_sutotal? : number,
	estado?: any, // si ya generado en una solped 
	opcion_aprobar? : number, //para guardar que se va ha hacer a la hora de aprobar
}
