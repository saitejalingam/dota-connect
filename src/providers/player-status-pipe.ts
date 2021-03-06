import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'playerStatus'})
export class PlayerStatusPipe implements PipeTransform {
    transform(value: any): string {
        switch(value) {
            case 0:
                return 'Offline';
            case 1:
                return 'Online';
            case 2:
                return 'Busy';
            case 3:
                return 'Away';
            case 4:
                return 'Snooze';
            case 5:
                return 'Looking to trade';
            case 6: 
                return 'Looking to play';
            default:
                return 'Offline';
        }
    }
}