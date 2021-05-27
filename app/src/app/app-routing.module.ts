import { ProveedoresListComponent } from './components/proveedores-list/proveedores-list.component';
import { ListsOcsComponent } from './components/lists-ocs/lists-ocs.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


import { LoginComponent, HomeComponent, AuthGuard, LogoutComponent, NoticiasComponent, ConfmenuComponent, NotificacionesComponent, InvoiceComponent, BalanceComponent, CestaTicketComponent, OtherTransactionComponent, ListaProductosComponent, FtProductoGeneralComponent, VideoComponent } from './components/index';

import { PerfilesComponent } from './components/perfiles/perfiles.component';
import { RolesComponent } from './components/roles/roles.component';
import { PerRolModComponent } from "./components/per-rol-mod/per-rol-mod.component";
import { NoticiasCrudComponent } from "./components/noticias-crud/noticias-crud.component";
import { UsuariosComponent } from './components/usuarios/usuarios.component';
import { UsuarioFormComponent } from './components/usuario-form/usuario-form.component';
import { TicketsEnviadosComponent } from "./components/tickets-enviados/tickets-enviados.component";
import { TicketFormComponent } from "./components/ticket-form/ticket-form.component";
import { TicketsRecibidosComponent } from "./components/tickets-recibidos/tickets-recibidos.component";
import { CambioClaveUsrComponent } from "./components/cambio-clave-usr/cambio-clave-usr.component";
import { ParametrosComponent } from './components/parametros/parametros.component';
import { TicketsHistoricoEnviadosComponent } from './components/tickets-historico-enviados/tickets-historico-enviados.component';
import { TicketsHistoricoRecibidosComponent } from './components/tickets-historico-recibidos/tickets-historico-recibidos.component';
import { AdminAdicionalesProductoComponent } from './components/admin-adicionales-producto/admin-adicionales-producto.component';
import { GerenciasComponent } from './components/gerencias/gerencias.component';
import { ServiciosGerenciasComponent } from './components/servicios-gerencias/servicios-gerencias.component';
import { EmpresasComprasComponent } from './components/empresas-compras/empresas-compras.component';
import { EmpreGerenAreaComponent } from './components/empre-geren-area/empre-geren-area.component';
import { ConfigGlobalesComponent } from './components/config-globales/config-globales.component';
import { AreaNegocioComponent } from './components/area-negocio/area-negocio.component';
import { TipomedidaComponent } from './components/tipomedida/tipomedida.component';
import { UnidadmedidasComponent } from  './components/unidadmedidas/unidadmedidas.component';
import  { AreasGerenciasComponent } from './components/areas-gerencias/areas-gerencias.component';
import { AdmAlmacenesComponent } from './components/adm-almacenes/adm-almacenes.component';
import { FtAlmacenProductoComponent } from './components/ft-almacen-producto/ft-almacen-producto.component';
import { LogtransaccComponent } from './components/logtransacc/logtransacc.component';
import { SolpedsdetalleComponent } from './components/solpedsdetalle/solpedsdetalle.component';
import { SolpedOCComponent } from './components/solped-oc/solped-oc.component';
import { FasesSolpedComponent } from './components/fases-solped/fases-solped.component';
import { AprobarSolpedComponent } from './components/aprobar-solped/aprobar-solped.component';
import { RecepcionProductoComponent } from './components/recepcion-producto/recepcion-producto.component'

const appRoutes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'logout',
    component: LogoutComponent
  },
  {
    path: '', //Ruta por defecto
    component: HomeComponent, //Aqui esta el <router-outlet></router-outlet> donde se viaulizaran los componentes
    canActivate: [AuthGuard],
    children: [ //y se visualizaran los hijos segun sea el caso
      {
        path: 'noticias',
        component: NoticiasComponent
      },
      {
        path: 'noticiascrud',
        component: NoticiasCrudComponent
      },
      {
        path: 'perfiles',
        component: PerfilesComponent
      },
      //Se define una ruta "perfilrolmod" para el componente PerRolModComponent
      //Esta podra ser usada en cualquier parte con el "routerLink" o el "navigate" paraa ir hasta el componente
      //y mostrarlo en pantalla...si quiero parametros se los defino con :
      {
        path: 'perfilrolmod/:idperfil',
        component: PerRolModComponent
      },
      {
        path: 'usuarioform/:idusuario',
        component: UsuarioFormComponent
      },
      {
        path: 'cambioclave/:idusuario',
        component: CambioClaveUsrComponent
      },

      {
        path: 'detalleProducto/:idAdmProducto/:rol',
        component: FtProductoGeneralComponent
      },
      {
        path: 'ticketsenviados',
        component: TicketsEnviadosComponent
      },
      {
        path: 'ticketsrecibidos',
        component: TicketsRecibidosComponent
      },
      {
        path: 'ticketsenviadoshis',
        component: TicketsHistoricoEnviadosComponent
      },
      {
        path: 'ticketrecibidoshis',
        component: TicketsHistoricoRecibidosComponent
      },
      {
        path: 'ticketnuevo',
        component: TicketFormComponent
      },

      {
        path: 'confMenu',
        component: ConfmenuComponent
      },
      {
        path: 'roles',
        component: RolesComponent
      },
      {
        path: 'usuarios',
        component: UsuariosComponent
      },
      {
        path: 'notificaciones',
        component: NotificacionesComponent
      },
      {
        path: 'facturacion',
        component: InvoiceComponent
      },
      {
        path: 'balance',
        component: BalanceComponent
      },
      {
        path: 'cestaticket',
        component: CestaTicketComponent
      },
      {
        path: 'otrasTrans',
        component: OtherTransactionComponent
      },
      {
        path: 'parametros',
        component: ParametrosComponent
      },
      {
        path: 'fichatecnica',
        component: ListaProductosComponent
      },
      {
        path: 'adicionales',
        component: AdminAdicionalesProductoComponent
      },
      {
        path: 'gerencias',
        component: GerenciasComponent
      },

      {
        path: 'serviciosgerencias',
        component: ServiciosGerenciasComponent
      },
      {
        path: 'comprasempresas',
        component: EmpresasComprasComponent
      },
      {
        path: 'empre-geren-area',
        component: EmpreGerenAreaComponent
      },
      {
        path: 'globales',
        component: ConfigGlobalesComponent
      },
      {
        path: 'areanegocios',
        component: AreaNegocioComponent
      },
      {
        path: 'video',
        component: VideoComponent
      },
      {
        path: 'tipomedidas',
        component: TipomedidaComponent
      },
      {
        path: 'unidadmedidas',
        component: UnidadmedidasComponent
      },
      {
        path: 'areasgerencias',
        component: AreasGerenciasComponent
      },
      {
        path: 'almacenes',
        component: AdmAlmacenesComponent
      },
      {
        path: 'almacenes-productos',
        component: FtAlmacenProductoComponent
      },
      {
        path: 'visorsucesos',
        component: LogtransaccComponent
      },
      {
        path: 'solpedsoc',
        component: SolpedOCComponent
      },
      {
        path: 'fases-solped/:idSolpedCompras',
        component: FasesSolpedComponent
      },
      {
        path: 'aprobarsolped',
        component: AprobarSolpedComponent
      },
      {
        path: 'listoc',
        component: ListsOcsComponent
      },

      {
        path: 'recepcionproducto',
        component: RecepcionProductoComponent
      },
      {
        path: 'listProveedores',
        component: ProveedoresListComponent
      },

    ]
  },
  {
    path: "**", component: HomeComponent //Por seguridad si no consigue ninguna ruta
  }
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})


export class AppRoutingModule {

  public getRoute() {
    return appRoutes;
  }
}



