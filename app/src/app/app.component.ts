import { Component, OnInit } from '@angular/core';
import { NoticiasCrud } from './actions/noticias.actions';
import { Store } from '@ngxs/store';

@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html'
})

export class AppComponent implements OnInit { 
    constructor(private store: Store){

    }
    ngOnInit() {
        this.store.dispatch(new NoticiasCrud.All());
    }
}
