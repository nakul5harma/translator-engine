import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

import { AppProperties } from './app-properties.model';
import { LanguageTranslationProviderService } from './language-translation-provider.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: [
        './app.component.scss'
    ],
    providers: [
        AppProperties
    ]
})
export class AppComponent implements OnInit {
    public languageOptions: Array<{ language: string; languageCode: string }>;
    public selectedLanguage: FormControl;

    constructor(
        public appProperties: AppProperties,
        private languageTranslationProviderService: LanguageTranslationProviderService
    ) {}

    ngOnInit() {
        this.languageOptions = this.languageTranslationProviderService.getLanguageOptions();
        this.selectedLanguage = new FormControl('en');

        this.languageTranslationProviderService.recordsLoaded.subscribe((loaded) => {
            if (loaded) {
                this.getBrowserLanguage();
            }
        });
    }

    private getBrowserLanguage() {
        let browserLanguage = navigator.language.slice(0, 2) || 'en';
        if (
            !this.languageOptions.find((language) => {
                return language.languageCode === browserLanguage;
            })
        ) {
            browserLanguage = 'en';
        }

        this.selectedLanguage.setValue(browserLanguage);
    }
}
