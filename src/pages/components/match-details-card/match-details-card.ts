import { Component, Input, OnChanges } from '@angular/core';

@Component({
    selector: 'match-details-card',
    templateUrl: 'match-details-card.html'
})
export class MatchDetailsCard implements OnChanges {
    @Input() match: any;
    @Input() playerId: string;

    public accountId: any;
    public playerDetails: any;
    constructor() { }

    ngOnChanges() {
        this.accountId = this.getAccountID(this.playerId);
        this.playerDetails = this.match.players.find(player => player.account_id === this.accountId);
        console.log(this.playerDetails)
    }

    public getAccountID(playerId: string) {
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
}

const convert64: string = '76561197960265728';