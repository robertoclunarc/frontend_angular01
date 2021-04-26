import { Component, OnInit } from '@angular/core';

import { MenuService, BreakCrumbService } from 'src/app/services/index';
import { Message } from 'primeng/api';
import { BreadCrumb } from '../../models/index';

@Component({
	selector: 'app-breadcrumb',
	templateUrl: './breadcrumb.component.html',
	styleUrls: ['./breadcrumb.component.css']
})
export class BreadcrumbComponent implements OnInit {

	msgs: Message[] = [];
	breadCrumbs: BreadCrumb[] = [];

	constructor(private srvUserMenu: MenuService, private srvBreakCrumbService: BreakCrumbService) {

	}

	ngOnInit() {
		const myData = this.srvBreakCrumbService.get("idMenuBreakCrumb");
		this.getViewBreadCrumb(myData);
	}

	private getViewBreadCrumb(id: number) {
		this.srvUserMenu.getBreadCrumb(id).subscribe(data => { this.getBreadCrumb(data); }, error => { console.log(error); });
	}

	private getBreadCrumb(data) {

		this.msgs = [];
		if (!data) {
			this.msgs.push({ severity: 'error', summary: 'ERROR', detail: 'No breadCrumb que mostrar' });
			return;
		}
		this.breadCrumbs = data;
		this.srvBreakCrumbService.set("breadCrumbComplete", this.breadCrumbs);
	}
}
