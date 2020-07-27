import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject, Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  appThemes = ['light', 'dark'];
  private subject: BehaviorSubject<string>;
  onThemeChange: Observable<string>;

  constructor() {
    const currentTheme = localStorage.getItem('currentTheme');
    this.subject  = new BehaviorSubject<string>(currentTheme || 'light');
    this.onThemeChange = this.subject.asObservable();
  }

  setTheme(themeName: string): void {
    const currentTheme = localStorage.getItem('currentTheme');

    if (currentTheme) {
      document.body.classList.remove(`${currentTheme}-theme`);
    }

    const newTheme = `${themeName}-theme`;
    localStorage.setItem('currentTheme', themeName);
    document.body.classList.add(newTheme);
    this.subject.next(themeName);
  }

  loadTheme(): void {
    let currentTheme = localStorage.getItem('currentTheme');
    if (!currentTheme) {
      currentTheme = 'light';
      localStorage.setItem('currentTheme', currentTheme);
    }

    for (const themeName of this.appThemes) {
      const themeClass = `${themeName}-theme`;
      if (document.body.classList.contains(themeClass)) {
        document.body.classList.remove(themeClass);
      }
    }

    document.body.classList.add(`${currentTheme}-theme`);
    this.subject.next(currentTheme);
  }
}
