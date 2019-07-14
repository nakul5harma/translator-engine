import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Subject } from 'rxjs';

import { LanguageMapCSVModel } from './language-map-csv.model';

@Injectable({
    providedIn: 'root'
})
export class LanguageTranslationProviderService {
    private records: Array<LanguageMapCSVModel> = [];
    public recordsLoaded: Subject<boolean> = new Subject<boolean>();
    private languageOptions: Array<{ language: string; languageCode: string }> = [
        { language: 'English', languageCode: 'en' },
        { language: 'Spanish', languageCode: 'es' },
        { language: 'Portuguese', languageCode: 'pt' },
        { language: 'French', languageCode: 'fr' },
        { language: 'Mandarin(Simplified)', languageCode: 'zh' },
        { language: 'Polish', languageCode: 'pl' },
        { language: 'German', languageCode: 'de' }
    ];
    private csvFilePath = `assets/AIESEC.org translations - Production For AI.csv`;

    constructor(private http: HttpClient) {
        this.csvReader();
    }

    public getLanguageOptions() {
        return this.languageOptions.slice();
    }

    private csvReader(): void {
        this.http.get(this.csvFilePath, { responseType: 'text' }).subscribe(
            (data) => {
                const csvData = data;
                const csvRecordsArray = (csvData as string).split(/\n/);

                const headersRow = this.getHeaderArray(csvRecordsArray);
                this.records = this.getDataRecordsArrayFromCSVFile(csvRecordsArray, headersRow.length);
                this.recordsLoaded.next(true);
            },
            (error) => {
                console.log('error is occured while reading file - ', error);
            }
        );
    }

    private getDataRecordsArrayFromCSVFile(csvRecordsArray: any, headerLength: any) {
        const csvArr = [];

        for (let i = 1; i < csvRecordsArray.length; i++) {
            csvRecordsArray[i] = csvRecordsArray[i]
                .replace(new RegExp('"', 'g'), '')
                .replace(new RegExp(', ', 'g'), '__');
            const curruntRecord = (csvRecordsArray[i] as string).split(',');
            if (curruntRecord.length === headerLength) {
                const languageCSVModel: LanguageMapCSVModel = new LanguageMapCSVModel(
                    curruntRecord[0].trim().replace(new RegExp('__', 'g'), ', '),
                    curruntRecord[1].trim().replace(new RegExp('__', 'g'), ', '),
                    curruntRecord[2].trim().replace(new RegExp('__', 'g'), ', '),
                    curruntRecord[3].trim().replace(new RegExp('__', 'g'), ', '),
                    curruntRecord[4].trim().replace(new RegExp('__', 'g'), ', '),
                    curruntRecord[5].trim().replace(new RegExp('__', 'g'), ', '),
                    curruntRecord[6].trim().replace(new RegExp('__', 'g'), ', ')
                );
                csvArr.push(languageCSVModel);
            }
        }
        return csvArr;
    }

    private getHeaderArray(csvRecordsArr: any) {
        const headers = (csvRecordsArr[0] as string).split(',');
        const headerArray = [];
        for (const header of headers) {
            headerArray.push(header);
        }
        return headerArray;
    }

    public translateText(text: string, targetLanguage: string): string {
        if (targetLanguage === 'en') {
            return text;
        }

        const toLanguage: string = this.languageOptions
            .find((language: { language: string; languageCode: string }) => {
                return language.languageCode === targetLanguage;
            })
            .language.split('(')[0]
            .toLowerCase()
            .concat('Text');

        return this.findAndTranslate(text, toLanguage);
    }

    private findAndTranslate(text: string, toLanguage: string): string {
        const matchedRecord = this.records.find((record: LanguageMapCSVModel) => {
            return record.englishText.toLowerCase().trim() === text.toLowerCase().trim();
        });

        if (matchedRecord) {
            return matchedRecord[toLanguage];
        }
        return text;
    }
}
