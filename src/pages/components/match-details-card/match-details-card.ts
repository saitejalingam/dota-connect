import { Component, Input, OnChanges } from '@angular/core';

import { DotaDataService } from '../../../providers/dota-data-service'

@Component({
    selector: 'match-details-card',
    templateUrl: 'match-details-card.html'
})
export class MatchDetailsCard implements OnChanges {
    @Input() match: any;
    @Input() playerId: string;

    public accountId: number;
    public playerDetails: any;
    constructor(private dataService: DotaDataService) { }

    ngOnChanges() {
        this.accountId = this.getAccountID(this.playerId);
        this.playerDetails = this.match.players.find(player => player.account_id === this.accountId);

        console.log(this.playerDetails)
    }

    public getHeroLocalizedName(heroid) {
        return this.dataService.getHeroLocalizedNameByID(heroid);
    }

    public getHeroImageURL(heroid) {
        return 'http://cdn.dota2.com/apps/dota2/images/heroes/' + this.dataService.getHeroNameByID(heroid) + '_full.png';
    }

    public getAccountID(playerId: string): number {
        let accountId = 0;
        let borrowed: boolean = false;
        let playerArr: Array<string> = playerId.split("").reverse();
        let convertArr: Array<string> = convert64.split("").reverse();

        playerArr.forEach(function (number, index) {
            let playerNum = parseInt(number);
            let convertNum = parseInt(convertArr[index]);

            if (borrowed) { playerNum = playerNum - 1; }
            if (convertNum > playerNum) { playerNum = playerNum + 10; borrowed = true; }
            else { borrowed = false; }

            accountId += (playerNum - convertNum) * Math.pow(10, index);
        });

        return accountId;
    }

    public isWin(): boolean {
        let playerIndex = this.match.players.findIndex(player => player === this.playerDetails);
        let isRadiant = playerIndex < 5;
        let radiantWin = this.match.radiant_win;

        if (isRadiant && radiantWin) { return true; }
        else if (!isRadiant && !radiantWin) { return true; }
        else { return false; }
    }
}

const convert64: string = '76561197960265728';