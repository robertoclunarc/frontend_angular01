export interface Iadm_activos {
    idAdmActivo?: number;
    nombre: string;
    descripcion?: string;
    fechaAlta?: string;
    fechaModificacion?: string;
    serial?: string;
    idAdmProducto?: number;
    idComprasEmpresa?: number;
    tipo?: string;
    activo?: number;
    IdEmpresaPropietaria?: number;
    IdAreaNegocio?: number;
    IdactivoPadre?: string;
    idGciaCreado?: number;
}

export interface Iconfig_activos_areas_negocios {
    idConfigActivoAreaNegocio?:number;
    idAdmActivo?:number;
    idGenAreaNegocio?:number;
    activo?:number;
}

export interface Iconfig_activos_gerencias {    
    idConfigActivoGcia?:number;
    idAdmActivo?:number;
    idConfigGerencia?:number;
    activo?:number;
}

export interface IactivosJoin {
    idAdmActivo?,
    nombre,
    descripcion?,
    fechaAlta?,
    fechaModificacion?,
    serial?,
    idAdmProducto?,
    idComprasEmpresa?,
    tipo?,
    activo?,
    IdEmpresaPropietaria?,
    IdAreaNegocio?,
    IdactivoPadre?,
    nombre_empresa?,
    nombre_gerencia,
    nombre_area_negocio?,
    nombreActivoPadre?,
    empresa_propietaria?,
    gciaCreado?,
}