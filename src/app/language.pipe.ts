import { Pipe, PipeTransform } from '@angular/core';

import { LanguageTranslationProviderService } from './language-translation-provider.service';

@Pipe({
    name: 'language'
})
export class LanguagePipe implements PipeTransform {
    constructor(private languageTranslationProviderService: LanguageTranslationProviderService) {}

    transform(value: string, language: string): string {
        return this.languageTranslationProviderService.translateText(value, language);
    }
}
