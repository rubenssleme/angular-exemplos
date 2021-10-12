import { Imagens } from './../models/placeholder.model';
import { CrudService } from 'src/app/services/crud.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-crud',
  templateUrl: './crud.component.html',
  styleUrls: ['./crud.component.css']
})
export class CrudComponent implements OnInit {
imagens: Imagens;
erro: any;
  constructor(private crudService: CrudService) {
    this.getter();
   }

  ngOnInit() {  }

  getter() {
      this.crudService.getPhotos().subscribe(
      (data: Imagens) => {
        this.imagens = data;
        console.log('O data que recebemos', data);
        console.log('A variavel que preenchemos', this.imagens);
      }, (error: any) => {
        this.erro = error;
        console.log('ERRO:', error);
      });
   }

}
