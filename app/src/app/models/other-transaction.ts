export interface OtherTransaction {
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
    sueldo_basico?,
    total?,
    subtotalA?,
    subtotalD?,
    conceptos?: OtherConcepts[]
}

export interface OtherConcepts {
    cod_concepto?,
    descripcion_concepto?,
    tipo_concepto?,
    factor?,
    monto?,
    unidad?
}
