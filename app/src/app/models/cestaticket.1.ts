export interface Cestaticket {
    cod_integrante?,
    nombre_completo?,
    periodo_desde?,
    periodo_hasta?,
    cod_cargo?,
    desc_cargo?,
    cod_departamento?,
    desc_departamento?,
    cedula_identidad?,
    fecha_ingreso?,
    nro_cuenta_banco?,
    total?,
    subtotalA?,
    subtotalD?,
    valor_diario?,
    valor_mensual,
    conceptos?: CestaticketConcepts[]
}

export interface CestaticketConcepts {
    cod_concepto?,
    descripcion_concepto?,
    tipo_concepto?,
    factor?,
    monto?
}
