export interface Balance {
    cuenta?,
    descripcion?,
    nivel?,
    total?: BalanceAmounts,
    cantsubcuenta? : number,
    subcuenta?: Balance[]
}

export interface BalanceAmounts {
    inicial : number,
    debe : number,
    haber : number,
    final: number
}

export interface BalanceP {
    prefijo?,
    cuenta?,
    descripcion?,
    nivel: number,    
    total?: BalanceAmounts,
    cantsubcuenta? : number,
    subcuenta?: BalanceP[]
}


