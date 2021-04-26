export interface RolModelo {
    idSegRol?,
    codigo? : string,
    nombre? : string,
    descripcion? : string,
    fechaAlta? : Date,
    estatus? : number,
    auditable?: number,
    idSegMenu?: any
}
