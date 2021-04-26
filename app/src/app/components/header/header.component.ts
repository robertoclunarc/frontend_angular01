import { Component, OnInit, OnDestroy } from '@angular/core';

import { User, Notificacion, EstadoNotificacion, Parametros } from '../../models/index';
import { NotificacionesService, UserLocalStorageService, ParametrosService } from '../../services/index';
import { Subscription, interval } from 'rxjs';

import { Message } from 'primeng/api';
import { RolModelo } from 'src/app/models/rol';
import { Checkbox } from 'primeng/checkbox';

//Variale usada par las notificaciones tipo "popup"
declare const enviarNotificacion: any;

//en la carpeta "assets" esta la libreria "push.js" que permiten los mensajes tipo pupop
//ademas se creo el archivo "notificacion.js" que define la funcion "enviarNotificacion"
// ambos js estan en la carpeta assets y son referenciados en el proyecto en angular.json

@Component({
  selector: 'header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  providers: [NotificacionesService, UserLocalStorageService, ParametrosService]
})
export class HeaderComponent implements OnInit, OnDestroy {

  user: User;
  notificaciones: Notificacion[];
  notificacion: Notificacion;

  msgs: Message[] = [];

  roles: RolModelo[] = [];

  rol: RolModelo;

  displaySide: boolean = false;

  private intervalNotificacion: Subscription;
  private intervalNotificaciones: Subscription;
  private intervalRoles: Subscription;

  activarNotificaciones: boolean = true;

  badgeCounter: number = 0;

  isCollapsed = true;
  isSidebarPinned = true;
  isSidebarToggeled = false; 

  value: boolean = true;
  toggle: boolean = false;

  params: Parametros;

  checked: boolean;

  constructor(
    private srvNotifcacion: NotificacionesService,
    private srvRolesUserLocal: UserLocalStorageService,
    private srvParametros: ParametrosService
  ) { }

  ngOnInit() {

    this.checked = false;

    let currentUser = sessionStorage.getItem('currentUser');
    this.user = JSON.parse(currentUser);

    this.srvRolesUserLocal.getRoles(this.user.idSegUsuario).subscribe(roles => { this.roles = roles; this.srvRolesUserLocal.setRolesLocalStorage(roles); }, error => this.showError(error));

    this.notificaciones = [];
    this.obtenerNotificacionesRecibidas(this.user.idSegUsuario);

    if (this.activarNotificaciones) {

      this.srvParametros.getParametros()
        .toPromise()
        .then(results => {

          this.params = results[0];

          this.intervalNotificacion = interval(this.params.tiempoEsperaRecibirNotificacion * 1000).subscribe(x => {
            this.obtenerNotificacionPorUsuario();

          });

          /*this.intervalNotificaciones = interval(this.params.tiempoEsperaPanelNotificacion * 1000).subscribe(x => {
            this.obtenerNotificacionesRecibidas(this.user.idSegUsuario);
            this.obtenerUltNotificacionesPorUsuario(this.user.idSegUsuario);
          });*/

          this.intervalRoles = interval(this.params.tiempoActualizacionRoles * 1000).subscribe(x => {
            this.srvRolesUserLocal.getRoles(this.user.idSegUsuario).subscribe(roles => { this.roles = roles; this.srvRolesUserLocal.setRolesLocalStorage(roles); }, error => this.showError(error));
          });
        })
        .catch(err => { console.log(err) });
    }
  }

  clickEvent(event) {
    this.toggle != this.toggle;
  }

  actualizarEstadoNotificacion(idNotificacionServicio: number, estado: EstadoNotificacion) {

    this.srvNotifcacion.actualizarEstadoNotificacion(idNotificacionServicio, estado)
      .toPromise()
      .then(results => { })
      .catch(err => { console.log(err) });
  }


  chance(not: Notificacion) {

    this.actualizarEstadoNotificacion(not.idNotificacionServicio, EstadoNotificacion.Leido);

    let index = this.notificaciones.indexOf(not);
    this.notificaciones = this.notificaciones.filter((val, i) => i != index);

    this.badgeCounter = this.notificaciones.length;

  }

  leerTodas(ch: Checkbox) {

    ch.checked = !ch.isChecked;
    let notificaciones = [...this.notificaciones];

    this.notificaciones.forEach((notificacion, index) => {

      this.actualizarEstadoNotificacion(notificacion.idNotificacionServicio, EstadoNotificacion.Leido);

      let indexAux = notificaciones.indexOf(notificacion);
      notificaciones = notificaciones.filter((val, i) => i != indexAux);
    });

    this.notificaciones = notificaciones;
    this.badgeCounter = this.notificaciones.length;
  }

  toggleSidebarPin() {
    this.isSidebarPinned = !this.isSidebarPinned;
  }
  toggleSidebar() {
    this.isSidebarToggeled = !this.isSidebarToggeled;
    //console.log(this.isSidebarToggeled);
  }

  ngOnDestroy() {

    if (this.intervalNotificacion) {
      this.intervalNotificacion.unsubscribe();
      this.intervalRoles.unsubscribe();
    }
  }

  obtenerNotificacionesRecibidas(idUsuario: number) {

    this.srvNotifcacion.getNotificacionesRecibidas(idUsuario)
      .toPromise()
      .then(results => {
        this.notificaciones = results;
        this.badgeCounter = results.length;
      })
      .catch(err => { console.log(err) });
  }

  obtenerUltNotificacionesPorUsuario(idUsuario: number) {

    this.srvNotifcacion.obtenerUltNotificacionesPorUsuario(idUsuario)
      .toPromise()
      .then(results => { this.notificaciones = results; })
      .catch(err => { console.log(err) });
  }

  obtenerNotificacionPorUsuario() {

    this.srvNotifcacion.obtenerNotificacionesPorIdUsuario(this.user.idSegUsuario)
      .toPromise()
      .then(results => {
        this.notificacion = results[0];
        if (this.notificacion) {

          let result = this.notificaciones.filter(e => e.idNotificacionServicio.indexOf(this.notificacion.idNotificacionServicio) >= 0);

          if (result.length == 0) {
            this.notificaciones.push(this.notificacion);
            this.badgeCounter = this.notificaciones.length;
          }
          this.mostrarNotificaciones(this.notificacion);
        }
      })
      .catch(err => { console.log(err) });
  }

  mostrarNotificaciones(notificacion: Notificacion) {

    let titulo = 'Nueva notificacion';
    let gerencia = '';

    if (notificacion) {

      if (notificacion.servicio) {
        titulo = 'Notificacion de ' + notificacion.servicio;
      }
      if (notificacion.gerencia) {
        gerencia = this.notificacion.gerencia;
      }

      let mensaje = notificacion.mensaje + '\r' + 'Emisor: ' + notificacion.usuarioEnvio + '\r' + gerencia;

      this.actualizarEstadoNotificacion(notificacion.idNotificacionServicio, EstadoNotificacion.Recibido);

      //aqui es la llamada a funcion js que esta en el arhcivo notificacion.js      
      enviarNotificacion(titulo, mensaje, 'assets/img/notification.png', 5000);
      //+++++++++

    }
  }

  onItemClick(not: Notificacion) {

    this.actualizarEstadoNotificacion(not.idNotificacionServicio, EstadoNotificacion.Leido);

    let index = this.notificaciones.indexOf(not);
    this.notificaciones = this.notificaciones.filter((val, i) => i != index);

    this.badgeCounter = this.notificaciones.length;

  }

  private showError(errMsg: string) {
    this.msgs = [];
    this.msgs.push({ severity: 'Error', summary: 'Ha ocurrido un error', detail: errMsg });
  }
}
