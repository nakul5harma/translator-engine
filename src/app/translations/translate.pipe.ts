import { Pipe, PipeTransform } from '@angular/core';

import { TranslationService } from './translation.service';

@Pipe({
    name: 'translate',
    pure: false
})
export class TranslatePipe implements PipeTransform {
    constructor(private translationService: TranslationService) {}

    transform(textToTranslate: string, targetLanguage?: string): string {
        if (!textToTranslate) {
            return;
        }

        if (targetLanguage) {
            return this.translationService.translateText(textToTranslate, targetLanguage);
        }

        return this.translationService.translateText(textToTranslate);
    }
}
