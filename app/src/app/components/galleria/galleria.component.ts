import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-galleria',
  templateUrl: './galleria.component.html',
  styleUrls: ['./galleria.component.scss']
})
export class GalleriaComponent implements OnInit {

  images: any[];

  constructor() { }

  ngOnInit() {

    this.images = [];
    this.images.push({source:'assets/img/galleria3.jpg', alt:'Description for Image 1', title:'Title 1'});
    this.images.push({source:'assets/img/galleria3.jpg', alt:'Description for Image 2', title:'Title 2'});
    this.images.push({source:'assets/img/galleria3.jpg', alt:'Description for Image 3', title:'Title 3'});
    this.images.push({source:'assets/img/galleria5.jpg', alt:'Description for Image 4', title:'Title 4'});
    this.images.push({source:'assets/img/galleria5.jpg', alt:'Description for Image 5', title:'Title 5'});
  }

}
