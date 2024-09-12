import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HelpersService {

  private isDesktopSubject = new BehaviorSubject<boolean>(window.innerWidth >= 768); // Definir si es escritorio

  isDesktop$ = this.isDesktopSubject.asObservable();

  constructor() {
    this.checkScreenSize();
    window.addEventListener('resize', this.checkScreenSize.bind(this)); // Detectar cambios de tamaño
  }

  private checkScreenSize() {
    const isDesktop = window.innerWidth >= 768; // Ajustar el tamaño de la pantalla
    this.isDesktopSubject.next(isDesktop);
  }

}
