export interface Menu {
    idSegMenu?,
    idSegMenuPadre?:number,
    titulo?,
    routeLink?,
    nivel?:number,
    ordenVisualizacion?,
    expandedIcon?:string,
    collapsedIcon?:string
}

export interface MenuUsuario {
    idSegMenu?,
    label?,
    expandedIcon?,
    collapsedIcon?,
    routeLink?,
    nivel?,
    children?: MenuUsuario[],
    idSegMenuPadre?
}

export interface MenuTreeTable {
    data?: Menu;
    children?: MenuTreeTable[];
    leaf?: boolean;
    expanded?: boolean;
}

export interface BreadCrumb {
    idSegMenu?,
    idSegMenuPadre?,
    label?,
}
