import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'logout',
    templateUrl: './logout.component.html',
    styleUrls: ['./logout.component.css'],
})
export class LogoutComponent implements OnInit {
    constructor(private router: Router) {}

    ngOnInit() {
        sessionStorage.removeItem('currentUser');
        sessionStorage.removeItem('filtro-gactual');
        sessionStorage.removeItem('filtro-generales');
        this.router.navigate(['/login']);
    }
}
