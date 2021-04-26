import { Component, OnInit } from '@angular/core';
import { ParametrosService } from '../../services';
import { Parametros } from '../../models';
import { MessageService, } from 'primeng/api';

@Component({
  selector: 'app-parametros',
  templateUrl: './parametros.component.html',
  styleUrls: ['./parametros.component.scss'],
  providers: [ParametrosService, MessageService]
})
export class ParametrosComponent implements OnInit {

  params: Parametros;

  constructor(private srvParametros: ParametrosService, private messageService: MessageService) { 
    this.srvParametros.getParametros().subscribe(parametros => { this.params = parametros[0]; });
  }

  ngOnInit() {
   
  }

  actualizar() {
    this.srvParametros.actualizarParametros(this.params).subscribe(parametros => { this.showSuccess('Parametros se han actualizado satisfactoriamente'); });
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
