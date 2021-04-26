import { EstadoNotificacion } from "./estadosNotificacion";

export interface Notificacion {
    idNotificacionServicio?,
    fechaEnvio?,
    fechaLectura?,
    gerencia?
    servicio?,
    rol?,
    mensaje?,
    usuarioEnvio?,
    usuarioRecibe?,
    estado?:EstadoNotificacion,
    accion?
}

