export interface Almacen {
idAdmAlmacen?,
codAlmacen?,
nombreAlmacen?
descripcion?
}

export interface Piso {
nombre?
idAdmPisoAlmacen?,
descripcion?,
idAlmacen?,
codigo?
}

export interface Pasillo {
nombre?
idPasillo?,
codPasillo?,
idPiso?,
descripcion?
}

export interface Estante {
nombre?
idAdmEstante?,
descripcion?,
idPasillo?,
codigo?,
}

export interface Nivel {
nombre?,
idAdmNivel?,
descripcion?,
idAdmEstante?
codigo?
}

export interface Puesto {
nombre?
idAdmPuesto?,
idAdmNivelEstante?,
descripcion?,
codigo?,
idAdmProducto?
}
export interface SelectedNode {
    
    //tabla?,
    idPropio?,
    codigo?,
    nombre?,
    descripcion?,
    idPadre?,
    nivel?,
    permiso_cargo?,
    permiso_descargo?,
    esLogico?,
    aceptaPuesto?
    
    }