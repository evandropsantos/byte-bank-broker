import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Acoes } from './modelo/acoes';
import { AcoesService } from './acoes.service';
import { debounceTime, distinctUntilChanged, filter, switchMap, tap } from 'rxjs/operators';
import { merge } from 'rxjs';
// import { Subscription } from 'rxjs';

const ESPERA_DIGITACAO = 300;

@Component({
  selector: 'app-acoes',
  templateUrl: './acoes.component.html',
  styleUrls: ['./acoes.component.css'],
})
export class AcoesComponent implements OnInit, OnDestroy {

  acoesInput = new FormControl();

  todasAcoes$ = this.acoesService.getAcoes().pipe(tap(() => console.log('Fluxo do filtro')));

  filtroInput$ = this.acoesInput.valueChanges.pipe(
    debounceTime(ESPERA_DIGITACAO),
    tap(() => console.log('Fluxo filtro')),
    filter(valorDigitado => valorDigitado.length >= 3 || !valorDigitado.length),
    distinctUntilChanged(), // impede 2 requisicoes mesmo valor
    switchMap(valorDigitado => this.acoesService.getAcoes(valorDigitado)) // filtra pelo fluxo(digitacao), nao pelos dados
  );

  acoes$ = merge(this.todasAcoes$, this.filtroInput$);

  // acoes: Acoes;
  // private subscription: Subscription;

  constructor(private acoesService: AcoesService) {}

  ngOnInit(): void {
    // this.subscription = this.acoesService.getAcoes().subscribe(acoes => {
    //   this.acoes = acoes;
    // });
  }

  ngOnDestroy(): void {
    // this.subscription.unsubscribe();
  }
}
