import { Component, OnInit } from '@angular/core';
import { TranslationService } from 'src/app/core/services/translation.service';

@Component({
  selector: 'app-language-switcher',
  templateUrl: './language-switcher.component.html',
  styleUrls: ['./language-switcher.component.scss']
})
export class LanguageSwitcherComponent implements OnInit {

  constructor(private translationService: TranslationService) { }

  ngOnInit() {
  }

  public switchTo(language: string): void {
    if (language !== this.translationService.language) {
      this.translationService.language = language;
    }
  }
  
}
