import { Component, ElementRef, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-serre',
  templateUrl: './serre.component.html',
  styleUrls: ['./serre.component.css']
})
export class SerreComponent implements AfterViewInit {
  constructor(private el: ElementRef) { }

  ngAfterViewInit(): void {
    const svg = this.el.nativeElement.querySelector('svg');
    const allElements = svg.querySelectorAll('path, line, polyline, polygon, rect, circle, ellipse');

    allElements.forEach((el: SVGGeometryElement) => {
      const length = el.getTotalLength();
      el.setAttribute('stroke-dasharray', length.toString());
      el.setAttribute('stroke-dashoffset', length.toString());

      const parent = el.closest('g');
      if (parent?.classList.contains('g-toit')) {
        el.setAttribute('style', 'animation-delay: 0s');
      } else if (parent?.classList.contains('g-structure')) {
        el.setAttribute('style', 'animation-delay: 3s');
      } else if (parent?.classList.contains('g-plantes')) {
        el.setAttribute('style', 'animation-delay: 6s');
      }
    });
    setTimeout(() => {
      const phrase = this.el.nativeElement.querySelector('#phraseNature');
      const feuilles = this.el.nativeElement.querySelectorAll('.feuille');

      phrase?.classList.add('visible');
      feuilles.forEach((f: HTMLElement) => f.classList.add('visible'));
    }, 3000);
  }
}

