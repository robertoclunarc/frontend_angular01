import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import 'rxjs/add/operator/first';

import { AuthenticationService, BreakCrumbService } from '../../services/index';
import { User } from 'src/app/models';
import { Md5 } from "ts-md5/dist/md5";

@Component({
    templateUrl: 'login.component.html',
    styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {
    model: any = {};
    loading = false;
    returnUrl: string;
    error = '';
    token = false;
    user: User;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private authenticationService: AuthenticationService,
        private srvBreakCrumb: BreakCrumbService) { }

    ngOnInit() {
        this.authenticationService.logout();
    }

    login() {

        this.loading = true;

        this.authenticationService.login(this.model.usuario, this.model.contrasenia)
            .first()
            .subscribe(
                data => {

                    this.user = data[0];

                    if (this.user && this.user.estatus === '0') {
                        console.log(this.user.estatus);
                        this.loading = false;
                        this.error = 'Usuario no tiene acceso a la red';
                        return;
                    }

                    this.srvBreakCrumb.set("idMenuBreakCrumb", 1);
                    this.router.navigate(['/noticias']);
                    const currentUser = sessionStorage.getItem('currrentUser');

                    if (!currentUser) {
                        this.loading = false;
                        this.error = 'Usuario no Autenticado';
                    }
                },
                error => {
                    this.error = error;
                    this.loading = false;
                });
    }
}
