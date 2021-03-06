export enum EstadosOC {
	REGISTRADO = 1,
	MODIFICADO = 2,
	APROBADO = 3,
	ANULADO = 4
}

export interface EstadosOc {
	id?: number;
	nombre?: string;
	descripcion?: string;
	fechaAlta?: any;
	estatus?: number;
	orden?: number;
}


export interface OrdenCompra {
	idComprasOC?,
	fechaAlta?,
	observaciones?,
	idProveedor?,
	idAdmActivo?,
	IdComprasEmpresa?,
	idSolpedCompras?,
	monto_total?,
	condiciones?,
	formas_envio?,
	idConfigGerencia?,
	idUsuarioAprobo?,
	fechaAprobacion?,
	fechaRequerida? : string,
	monto_total_usd?: number,
	tasa_usd?: number,
	fecha_tasa_usd? : string,
	idEstado? : number,
	estadoActual? : string,
	correlativo? : string,
	// notas?,
	justificacion? : string,
	idSegUsuario? : number,
	idGenCentroCostos? : number,
		
	nombre_cc? :string,
	nombre_asignado? :string,
	nombre_gerencia? : string,
	nombre_activo?,
	nombre_proveedor?,
	nombre_aprobo? : string,
	nombre_empresa_facturar?: string,
}
