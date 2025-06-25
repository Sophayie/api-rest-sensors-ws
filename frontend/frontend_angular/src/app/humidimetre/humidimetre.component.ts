import { AfterViewInit, Component, ElementRef, ViewChild, Input } from '@angular/core';

@Component({
  selector: 'app-humidimetre',
  templateUrl: './humidimetre.component.html',
  styleUrls: ['./humidimetre.component.scss']
})
export class HumidimetreComponent implements AfterViewInit {
  @ViewChild('rangeInput') rangeInputRef!: ElementRef<HTMLInputElement>;
  @Input() sensorId!: string;

  valeur: number = 0;

  ngAfterViewInit(): void {
    this.updateValeur();
  }

  onInput(): void {
    this.updateValeur();
  }

  updateValeur(): void {
    const input = this.rangeInputRef.nativeElement;
    this.valeur = +input.value;
  }
}
