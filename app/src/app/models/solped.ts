import { SolpedDetalleModelo } from 'src/app/models/solped-detalle';
export enum estadosSolped { 
    "asignado" = 5, 
    "enproceso" = 6, 
    "preorden" = 7, 
    "cerrado" = 11, 
    "enpresidencia" = 12, 
    "anulado" = 15,
    "OC" = 13 
}

// private readonly estados = { "OC": 13, "enproceso": 6, "preorden": 7, "cerrado": 11, "enpresidencia": 12, "aprobPresidencia": 14 };

export interface SolpedModelo {
    idSolpedCompras?,
    fechaAlta?,
    fechaRequerida? : string,
    descripcion?
    fechaAOrdenC?,
    idTicketServicio?,
    idEstadoActual?,
    estadoActual?,
    idSolpedPadre?,
    idConfigGerencia?,
    idAdmActivo?,
    idSegUsuario?,
    nombre_asignado?,
    nombre_gerencia?,
    monto_total?,
    idEmpresa?: number,
    idUsuarioRegistro?: number,
    nombre_empresa_facturar?: string,
    monto_total_usd? : number, 
	tasa_usd? : number,     
	fecha_tasa_usd?: string,
    fecha_aprobo_presi?: string,
    totDetallesNoProc?: number,
    formas_envio?: string,
    condiciones?: string,

    observacionesPresi? : string,

    justificacion? : string;

    detalles? : SolpedDetalleModelo[];
}
