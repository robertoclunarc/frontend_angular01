import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user';

@Component({
    selector: 'app-summary',
    templateUrl: './summary.component.html',
    styleUrls: ['./summary.component.scss'],
})
export class SummaryComponent implements OnInit {
    user: User;

    constructor() {}

    ngOnInit(): void {
        this.user = JSON.parse(sessionStorage.getItem('currentUser'));
        // console.log(this.user);
    }
}
