import { detalleOcModelo } from 'src/app/models/oc-Detalle';

export interface OrdenCompra {
	idComprasOC?,
	fechaAlta?,
	observaciones?,
	idProveedor?,
    nombreProveedor?,
    rifEmpresaProv?,
	idAdmActivo?,
    nombreActivo?,
	IdComprasEmpresa?,
    nombreEmpresa?,
	idSolpedCompras?,
	monto_total?,
	condiciones?,
	formas_envio?,
	idConfigGerencia?,
    nombreGerencia?,
	idUsuarioAprobo?,
	fechaAprobacion?,
	fechaRequerida? : string,
	monto_total_usd?: number,
	tasa_usd?: number,
	fecha_tasa_usd? : string,
	idEstado? : number,
	estadoActual? : string,
	correlativo? : string,
	justificacion? : string,
	idSegUsuario? : number,
    login?,	
	nombre_asignado? :string,
	nombre_gerencia? : string,
	nombre_activo?,
	nombre_proveedor?,
	nombre_aprobo? : string,
	nombre_empresa_facturar?: string,
    detalles?: detalleOcModelo[];
}