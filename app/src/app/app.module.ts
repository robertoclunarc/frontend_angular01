
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { NgModule, LOCALE_ID } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgxsModule } from "@ngxs/store";
import { NgxsLoggerPluginModule } from '@ngxs/logger-plugin';

import { registerLocaleData } from '@angular/common';
import localeES from '@angular/common/locales/es';
registerLocaleData(localeES);


import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { ButtonModule } from 'primeng/button';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { PanelModule } from 'primeng/panel';
import { KeyFilterModule } from 'primeng/keyfilter';
import { ToastModule } from 'primeng/toast'
import { PaginatorModule } from 'primeng/paginator';
import { TabMenuModule } from 'primeng/tabmenu';
import { TreeModule } from 'primeng/tree';
import { TreeTableModule } from 'primeng/treetable';
import { SplitButtonModule } from 'primeng/splitbutton';
import { AccordionModule } from 'primeng/accordion';
import { CheckboxModule } from 'primeng/checkbox';
import { RadioButtonModule } from 'primeng/radiobutton';
import { ContextMenuModule } from 'primeng/contextmenu';
import { ListboxModule } from 'primeng/listbox';


import { CardModule } from 'primeng/card';
import { DialogModule } from "primeng/dialog";
import { ScrollPanelModule } from "primeng/scrollpanel";
import { SpinnerModule } from "primeng/spinner";
import { StepsModule } from "primeng/steps";
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { MultiSelectModule } from 'primeng/multiselect';
import { FileUploadModule } from 'primeng/fileupload';
import { MenubarModule } from 'primeng/menubar';
import { SidebarModule } from 'primeng/sidebar';

import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

// used to create fake backend
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import {
	AuthGuard, LoginComponent, HeaderComponent, HomeComponent,
	NoticiasComponent, InvoiceComponent, BalanceComponent, CestaTicketComponent,
	OtherTransactionComponent, FooterComponent
} from './components/index';

import { AuthenticationService, UserService } from './services/index';
import { LogoutComponent } from './components/logout/logout.component';
import { MenuComponent } from './components/menu/menu.component';

import { PerfilesComponent } from './components/perfiles/perfiles.component';
import { DataViewModule } from 'primeng/dataview';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TooltipModule } from 'primeng/tooltip';
import { GalleriaModule } from 'primeng/galleria';
import { EditorModule } from 'primeng/editor';
import { RatingModule } from 'primeng/rating';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputNumberModule } from 'primeng/inputnumber';

//import { ClipboardModule } from 'ngx-clipboard';

import { RolesComponent } from './components/roles/roles.component';
import { HttpErrorInterceptor } from './http-e-handler.interceptor';
import { ConfmenuComponent } from './components/confmenu/confmenu.component';
import { BreadcrumbComponent } from './components/breadcrumb/breadcrumb.component';
import { PerRolModComponent } from './components/per-rol-mod/per-rol-mod.component';
import { NoticiasCrudComponent } from './components/noticias-crud/noticias-crud.component';
import { UsuariosComponent } from './components/usuarios/usuarios.component';
import { UsuarioFormComponent } from './components/usuario-form/usuario-form.component';
import { TicketsEnviadosComponent } from './components/tickets-enviados/tickets-enviados.component';
import { TicketFormComponent } from './components/ticket-form/ticket-form.component';
import { TicketsRecibidosComponent } from './components/tickets-recibidos/tickets-recibidos.component';
import { NotificacionesComponent } from './components/notificaciones/notificaciones.component';
import { CambioClaveUsrComponent } from './components/cambio-clave-usr/cambio-clave-usr.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { AutoCompleteModule } from 'primeng/autocomplete';

import { GalleriaComponent } from './components/galleria/galleria.component';
import { CarouselModule } from 'primeng/carousel';
import { LightboxModule } from 'primeng/lightbox';


import { ParametrosComponent } from './components/parametros/parametros.component';
import { TicketsHistoricoEnviadosComponent } from './components/tickets-historico-enviados/tickets-historico-enviados.component';
import { TicketsHistoricoRecibidosComponent } from './components/tickets-historico-recibidos/tickets-historico-recibidos.component';
import { ListaProductosComponent } from './components/lista-productos/lista-productos.component';
import { TabViewModule } from 'primeng/tabview';
import { FtProductoGeneralComponent } from './components/ft-producto-general/ft-producto-general.component';
import { FtComplementariasProductoComponent } from './components/ft-complementarias-producto/ft-complementarias-producto.component';
//import { ConfigGeneralesComponent } from './components/config-generales/config-generales.component';
import { ConfigListGerenciasComponent } from './components/config-list-gerencias/config-list-gerencias.component';
import { ConfigItemGerenciaComponent } from './components/config-item-gerencia/config-item-gerencia.component';
import { ConfigListServGerenciasComponent } from './components/config-list-serv-gerencias/config-list-serv-gerencias.component';
import { ConfigItemServGerenciaComponent } from './components/config-item-serv-gerencia/config-item-serv-gerencia.component';
import { ConfigListAreasTrabajoComponent } from './components/config-list-areas-trabajo/config-list-areas-trabajo.component';
import { FtDatosAdicionalesProductoComponent } from './components/ft-datos-adicionales-producto/ft-datos-adicionales-producto.component';
import { FtAplicabilidadProductoComponent } from './components/ft-aplicabilidad-producto/ft-aplicabilidad-producto.component';
import { AdminAdicionalesProductoComponent } from './components/admin-adicionales-producto/admin-adicionales-producto.component';
import { AdmGruposComponent } from './components/adm-grupos/adm-grupos.component';
import { AdmSubgruposComponent } from './components/adm-subgrupos/adm-subgrupos.component';
import { AdmMaterialesComponent } from './components/adm-materiales/adm-materiales.component';
import { GerenciasComponent } from './components/gerencias/gerencias.component';
import { ServiciosGerenciasComponent } from './components/servicios-gerencias/servicios-gerencias.component';
import { EmpresasComprasComponent } from './components/empresas-compras/empresas-compras.component';
import { EmpreGerenAreaComponent } from './components/empre-geren-area/empre-geren-area.component';
import { AdmColoresComponent } from './components/adm-colores/adm-colores.component';
import { AdmTiposDesagregacionComponent } from './components/adm-tipos-desagregacion/adm-tipos-desagregacion.component';
import { AdmTiposClasificacionComponent } from './components/adm-tipos-clasificacion/adm-tipos-clasificacion.component';
import { AdmSubtiposClasificacionComponent } from './components/adm-subtipos-clasificacion/adm-subtipos-clasificacion.component';
import { AdmTiposMedidasComponent } from './components/adm-tipos-medidas/adm-tipos-medidas.component';
import { ConfigGlobalesComponent } from './components/config-globales/config-globales.component';
import { AdmUnidadesMedidasComponent } from './components/adm-unidades-medidas/adm-unidades-medidas.component';
import { AdmPropiedadesComponent } from './components/adm-propiedades/adm-propiedades.component';
import { AdmAreasTrabajoComponent } from './components/adm-areas-trabajo/adm-areas-trabajo.component';
import { AreaNegocioComponent } from './components/area-negocio/area-negocio.component';
import { VideoComponent } from './components/video/video.component';


import { AdmAlmacenesComponent } from './components/adm-almacenes/adm-almacenes.component';
import { TipomedidaComponent } from './components/tipomedida/tipomedida.component';
import { UnidadmedidasComponent } from './components/unidadmedidas/unidadmedidas.component';
import { AreasGerenciasComponent } from './components/areas-gerencias/areas-gerencias.component';
import { LogtransaccComponent } from './components/logtransacc/logtransacc.component';
import { DetalleSolpedComponent } from './components/detalle-solped/detalle-solped.component';
import { SolpedsdetalleComponent } from './components/solpedsdetalle/solpedsdetalle.component';
import { FtAlmacenProductoComponent } from './components/ft-almacen-producto/ft-almacen-producto.component';
import { SolpedOCComponent } from './components/solped-oc/solped-oc.component';
import { DetalleSolpedOcComponent } from './components/detalle-solped-oc/detalle-solped-oc.component';
import { FasesSolpedComponent } from './components/fases-solped/fases-solped.component';
import { SolpedOneComponent } from './components/solped-one/solped-one.component';
import { TrazasSolpedComponent } from './components/trazas-solped/trazas-solped.component';
import { AprobarSolpedComponent } from './components/aprobar-solped/aprobar-solped.component';
import { RecepcionProductoComponent } from './components/recepcion-producto/recepcion-producto.component';
import { NoticiasState } from "./states/noticias.state"
import { environment } from 'src/environments/environment';
import { CopyAsyncPipe } from './pipes/copy-async.pipe';
import { SolalmacenComponent } from './components/solalmacen/solalmacen.component';
import { FormInvoiceComponent } from './components/form-invoice/form-invoice.component';
import { ListsOcsComponent } from './components/lists-ocs/lists-ocs.component';
import { OcOneComponent } from './components/oc-one/oc-one.component';
import { PrintOcComponent } from './components/print-oc/print-oc.component';
import { ProveedoresListComponent } from './components/proveedores-list/proveedores-list.component';
import { ProveedoresFormComponent } from './components/proveedores-form/proveedores-form.component';
import { AdmActivosComponent } from './components/config-generales/adm-activos/adm-activos.component';

@NgModule({
	declarations: [
		AppComponent,
		HeaderComponent,
		InvoiceComponent,
		BalanceComponent,
		CestaTicketComponent,
		OtherTransactionComponent,
		LoginComponent,
		LogoutComponent,
		MenuComponent,
		HomeComponent,
		NoticiasComponent,
		PerfilesComponent,
		RolesComponent,
		ConfmenuComponent,
		BreadcrumbComponent,
		PerRolModComponent,
		NoticiasCrudComponent,
		UsuariosComponent,
		UsuarioFormComponent,
		TicketsEnviadosComponent,
		TicketFormComponent,
		TicketsRecibidosComponent,
		NotificacionesComponent,
		CambioClaveUsrComponent,
		FooterComponent,
		SidebarComponent,
		GalleriaComponent,
		ParametrosComponent,
		TicketsHistoricoEnviadosComponent,
		TicketsHistoricoRecibidosComponent,
		ListaProductosComponent,
		FtProductoGeneralComponent,
		FtComplementariasProductoComponent,
		//ConfigGeneralesComponent,
		ConfigListGerenciasComponent,
		ConfigItemGerenciaComponent,
		ConfigListServGerenciasComponent,
		ConfigItemServGerenciaComponent,
		ConfigListAreasTrabajoComponent,
		FtDatosAdicionalesProductoComponent,
		FtAplicabilidadProductoComponent,
		AdminAdicionalesProductoComponent,
		AdmGruposComponent,
		AdmSubgruposComponent,
		AdmMaterialesComponent,
		GerenciasComponent,
		ServiciosGerenciasComponent,
		EmpresasComprasComponent,
		EmpreGerenAreaComponent,
		AdmColoresComponent,
		AdmTiposDesagregacionComponent,
		AdmTiposClasificacionComponent,
		AdmSubtiposClasificacionComponent,
		AdmTiposMedidasComponent,
		ConfigGlobalesComponent,
		AdmUnidadesMedidasComponent,
		AdmPropiedadesComponent,
		AdmAreasTrabajoComponent,
		AreaNegocioComponent,
		VideoComponent,
		AdmAlmacenesComponent,
		TipomedidaComponent,
		UnidadmedidasComponent,
		AreasGerenciasComponent,
		LogtransaccComponent,
		FtAlmacenProductoComponent,
		DetalleSolpedComponent, SolpedsdetalleComponent, SolpedOCComponent,
		DetalleSolpedOcComponent, FasesSolpedComponent, SolpedOneComponent, TrazasSolpedComponent, AprobarSolpedComponent, CopyAsyncPipe,
		RecepcionProductoComponent,
		SolalmacenComponent,
		FormInvoiceComponent,
		ListsOcsComponent,
		OcOneComponent,
		PrintOcComponent,
  ProveedoresListComponent,
  ProveedoresFormComponent,
  AdmActivosComponent,
 

	],
	imports: [
		BrowserModule,
		SidebarModule,
		BrowserAnimationsModule,
		GalleriaModule,
		HttpClientModule,
		AppRoutingModule,
		FormsModule,
		ReactiveFormsModule,
		DropdownModule,
		CalendarModule,
		ButtonModule,
		MessagesModule,
		MessageModule,
		TableModule,
		InputTextModule,
		PanelModule,
		DialogModule,
		ContextMenuModule,
		KeyFilterModule,
		ToastModule,
		DataViewModule,
		ConfirmDialogModule,
		InputSwitchModule,
		PaginatorModule,
		TabMenuModule,
		TreeModule,
		TreeTableModule,
		SplitButtonModule,
		MenubarModule,
		CardModule,
		MultiSelectModule,
		DialogModule,
		FileUploadModule,
		TooltipModule,
		CheckboxModule,
		EditorModule,
		AccordionModule,
		AutoCompleteModule,
		TabViewModule,
		ScrollPanelModule,
		ListboxModule,
		CarouselModule,
		SpinnerModule,
		SidebarModule,
		StepsModule,
		OverlayPanelModule, LightboxModule,
		RatingModule,
		InputNumberModule,
		RadioButtonModule,
		NgxsModule.forRoot([
			NoticiasState
		], {
			developmentMode: !environment.production
		}),

		//NgxsLoggerPluginModule.forRoot(),

	],
	providers: [
		AuthGuard,
		AuthenticationService,
		UserService,
		{
			provide: HTTP_INTERCEPTORS,
			useClass: HttpErrorInterceptor,
			multi: true
		},
		{ provide: LOCALE_ID, useValue: 'es-ES' },
	],
	bootstrap: [AppComponent]
})

export class AppModule { }