import { Component, OnInit } from '@angular/core';
import { User, MenuUsuario } from '../../models/index';

import { MenuService, BreakCrumbService } from 'src/app/services/index';
import { Message } from 'primeng/api';

import { TreeNode } from 'primeng/api';
import { Router } from '@angular/router';
import { Subscription, interval } from 'rxjs';

@Component({
	selector: 'menu',
	templateUrl: './menu.component.html',
	styleUrls: ['./menu.component.css'],
	providers: [MenuService,]

})
export class MenuComponent implements OnInit {

	user: User;
	msgs: Message[] = [];
	menuUsers: MenuUsuario[];
	selectedMenu: TreeNode;
	private subInterval: Subscription;

	constructor(private srvUserMenu: MenuService, private router: Router, private srvBreakCrumb: BreakCrumbService) {
	}

	ngOnInit() {
		let currentUser = sessionStorage.getItem('currentUser');
		this.user = JSON.parse(currentUser);
		this.getMenuUserByid();
		//this.subInterval = interval(5000).subscribe(x => { this.getMenuUserByid();});
	}

	private getMenuUserByid() {
		this.srvUserMenu.getMenuUserById(this.user.idSegUsuario).subscribe(data => { this.getMenuUser(data); }, error => { console.log(error); });
	}

	private getMenuUser(data) {
		this.msgs = [];
		if (!data) {
			this.msgs.push({ severity: 'error', summary: 'ERROR', detail: 'No hay menus que mostrar' });
			return;
		}
		this.menuUsers = data;

		let result = this.menuUsers.filter(e => e.idSegMenuPadre == 0);

		if (result.length <= 3) {
			this.exapandORcollapse(result)
		}
	}

	exapandORcollapse(nodes) {
		for (let node of nodes) {
			if (node.children) {
				if (node.expanded == true)
					node.expanded = false;
				else
					node.expanded = true;
				for (let cn of node.children) {
					this.exapandORcollapse(node.children);
				}
			}
		}
	}

	nodeSelect(event) {

		if (event.node.routeLink != '#') {
			this.srvBreakCrumb.removeItem('idMenuBreakCrumb');
			this.srvBreakCrumb.set("idMenuBreakCrumb", event.node.idSegMenu);
			this.router.navigate(['/' + event.node.routeLink]);
			return;
		}


		this.menuUsers.forEach(node => {
			this.expandRecursive(event.node, true);
		});
	}

	private expandRecursive(node: TreeNode, isExpand: boolean) {
		node.expanded = isExpand;
		if (node.children) {
			node.children.forEach(childNode => {
				this.expandRecursive(childNode, isExpand);
			});
		}
	}
}