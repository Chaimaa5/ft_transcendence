import P5 from 'p5'

export class Player {
    score : number;
	userName : string;
    constructor (userName : string) {
        this.score = 0;
		this.userName = userName;
    }
}