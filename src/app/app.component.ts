import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';

import { Subscription } from 'rxjs';

import { AppProperties } from './app-properties.model';
import { TranslationService } from './translations/translation.service';

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
export class AppComponent implements OnInit, OnDestroy {
    public languageOptions: Array<{ language: string; languageCode: string }>;
    public selectedLanguage: FormControl;
    public subscription: Subscription;

    constructor(public appProperties: AppProperties, private translationService: TranslationService) {}

    ngOnInit() {
        this.languageOptions = this.translationService.getLanguageOptions();

        this.selectedLanguage = new FormControl('en');
        this.translationService.useLanguage('en');

        this.selectedLanguage.valueChanges.subscribe((language: string) => {
            this.translationService.useLanguage(language);
        });

        this.subscription = this.translationService.recordsLoaded.subscribe((loaded) => {
            if (loaded) {
                this.selectedLanguage.setValue(this.translationService.getBrowserLanguage());
            }
        });
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }
}
