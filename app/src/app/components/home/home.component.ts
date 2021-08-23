import { Component, OnInit } from '@angular/core';
import 'rxjs/add/operator/first';
import { User } from '../../models/index';

import { Message } from 'primeng/api';

@Component({
    templateUrl: 'home.component.html',
    styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
    users: User[] = [];
    user: User;
    msgs: Message[] = [];
    isSidebarToggeled = false;

    constructor() {}

    ngOnInit() {
        let currentUser = sessionStorage.getItem('currentUser');
        this.users.push(JSON.parse(currentUser));
        this.user = JSON.parse(currentUser);
    }
    toggleSidebar() {
        this.isSidebarToggeled = !this.isSidebarToggeled;
    }
}
