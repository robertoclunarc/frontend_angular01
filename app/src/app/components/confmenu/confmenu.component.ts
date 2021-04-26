import { Component, OnInit } from '@angular/core';
import { MenuTreeTable, Menu } from '../../models/index';
import { MenuService } from 'src/app/services/menu.service';
import { Message, MenuItem, SelectItem } from 'primeng/api';
import { ConfirmationService, MessageService } from 'primeng/api';



@Component({
  selector: 'app-confmenu',
  templateUrl: './confmenu.component.html',
  styleUrls: ['./confmenu.component.css'],
  providers: [ConfirmationService, MenuService, MessageService]
})
export class ConfmenuComponent implements OnInit {

  //menus: MenuTreeTable[];
  selectedItemMenu: Menu;
  itemMenuForDialog: Menu;

  tituloDialogo: string;
  displayDialog: boolean;
  msgs: Message[] = [];

  newMenuItem: boolean;
  itemMenu: Menu;

  cols: any[];
  items: MenuItem[];

  parents: SelectItem[] = [];
  iconExps: SelectItem[] = [];
  iconConts: SelectItem[] = [];


  nivel: number = 0;
  menus: MenuTreeTable[];
  routeLinks: SelectItem[];

  constructor(private srvMenu: MenuService, private confirmationService: ConfirmationService, private messageService: MessageService) { }

  ngOnInit() {

    this.cols = [
      { field: 'label', header: 'Titulo', width: '35%' },
      { field: 'expandedIcon', header: 'Icono Expandido', width: '15%' },
      { field: 'collapsedIcon', header: 'Icono Contraido', width: '15%' },
      { field: 'routeLink', header: 'Pagina', width: '15%' }
    ];



    this.srvMenu.getMenu().subscribe(menus => this.menus = menus, error => this.showError(error));
  }

  add() {
    // create an empty itemMenuForDialog
    this.displayDialog = true;

    this.itemMenuForDialog = {
      idSegMenu: null, idSegMenuPadre: null, titulo: null,
      routeLink: "#", collapsedIcon: null, expandedIcon: null, nivel: 0, ordenVisualizacion: 1
    };
    this.setDialogo("Nuevo Item Menu");
  }

  edit(rowNode: any) {
    this.setSelectItemMenu(rowNode);
    this.setDialogo("Editar: " + this.selectedItemMenu.titulo);
    this.displayDialog = true;
  }

  save() {

    if (this.itemMenuForDialog.idSegMenu) {

      // update
      this.srvMenu.actualizarItemMenu(this.itemMenuForDialog)
        .finally(() => {
          this.itemMenuForDialog = null;
          this.displayDialog = false;
        })
        .subscribe(
          data => {
            this.srvMenu.getMenu().subscribe(menus => this.menus = menus,
              error => this.showError(error));
            this.selectedItemMenu = this.itemMenuForDialog;
            this.showSuccess('Menu se ha actualziado satisfactoriamente');
          },
          error => this.showError(error)
        );
    } else {

      // create
      this.srvMenu.nuevoItemMenu(this.itemMenuForDialog)
        .finally(() => {
          this.itemMenuForDialog = null;
          this.selectedItemMenu = null;
          this.displayDialog = false;
        })
        .subscribe(
          data => {
            this.srvMenu.getMenu().subscribe(menus => this.menus = menus, error => this.showError(error));
            this.showSuccess('Item del Menu se ha creado satisfactoriamente');
          },
          error => this.showError(error)
        );
    }
  }

  remove(rowNode: any) {

    this.setSelectItemMenu(rowNode);

    this.confirmationService.confirm(
      {
        message: "¿Desea Eliminar el registro?",
        accept: () => { this.eliminarItemMenu(); }
      });


  }

  eliminarItemMenu() {

    this.srvMenu.eliminarItemMenu(this.itemMenuForDialog.idSegMenu).subscribe(
      data => {
        this.itemMenuForDialog = null;
        this.srvMenu.getMenu().subscribe(menus => { this.menus = menus; this.showSuccess('Se elimino item del menu satisfactoriamente'); }, error => this.showError(error));
      }
    );
  }


  cerrarDialogo() {
    this.displayDialog = false;
  }

  setDialogo(titulo: string) {

    this.tituloDialogo = titulo;

    this.srvMenu.getMenuItems().subscribe(parents => {
      this.parents = [];

      this.parents = parents;
      this.parents.splice(0, 0, {
        label: "Sin Padre",
        value: 0
      });
    }, error => { console.log(error); });

    this.srvMenu.getMenuIcons().subscribe(icons => {

      this.iconExps = icons;
      this.iconConts = icons;

    }, error => { console.log(error); });



    this.routeLinks = this.srvMenu.getRouters();

    this.routeLinks.splice(0, 0, {
      label: "Sin Asignar",
      value: '#'
    });


  }

  setSelectItemMenu(rowNode: any) {
    this.selectedItemMenu = {
      idSegMenu: rowNode.idSegMenu, idSegMenuPadre: rowNode.idSegMenuPadre, titulo: rowNode.label,
      routeLink: rowNode.routeLink, collapsedIcon: rowNode.collapsedIcon, expandedIcon: rowNode.expandedIcon,
      nivel: rowNode.nivel, ordenVisualizacion: rowNode.ordenVisualizacion
    };
    this.itemMenuForDialog = Object.assign({}, this.selectedItemMenu);
  }

  getItemMenu(idSegMenu: number) {
    this.srvMenu.getMenuById(idSegMenu).subscribe(menu => { this.itemMenu = menu[0]; this.setItemMenu(); }, error => this.showError(error));
  }

  setItemMenu() {

    let nivel: number = Number(this.itemMenu.nivel) + 1;
    let orden: number = Number(this.itemMenu.ordenVisualizacion) + 1;

    this.itemMenuForDialog = {
      idSegMenu: this.itemMenuForDialog.idSegMenu, idSegMenuPadre: this.itemMenuForDialog.idSegMenuPadre,
      titulo: this.itemMenuForDialog.titulo,
      routeLink: this.itemMenuForDialog.routeLink, collapsedIcon: this.itemMenuForDialog.collapsedIcon,
      expandedIcon: this.itemMenuForDialog.expandedIcon,
      nivel: nivel, ordenVisualizacion: orden
    };
  }


  private showError(errMsg: string) {
    this.messageService.clear();
    this.messageService.add({ key: 'tc', severity: 'error', summary: errMsg });
  }

  private showSuccess(successMsg: string) {
    this.messageService.clear();
    this.messageService.add({ key: 'tc', severity: 'success', summary: successMsg });
  }
}
