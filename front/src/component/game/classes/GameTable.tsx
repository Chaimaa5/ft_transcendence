import P5 from 'p5'
import {Player} from './Player'
import {Round} from './Game'

export class GameTable {
	tableWidth: number;
	tableHeight: number;
	ctx?: CanvasRenderingContext2D;
	p?: P5;
	constructor(tableWidth: number, tableHeight: number){
		this.tableWidth = tableWidth;
		this.tableHeight = tableHeight;
	}

	initTable(tableWidth : number, tableHeight : number, ctx : CanvasRenderingContext2D, p : P5) {
		this.tableWidth = tableWidth;
		this.tableHeight = tableHeight;
		this.ctx = ctx;
		this.p = p;
	}
	
	displayScore(leftPlayer : Player, rightPlayer : Player, round : Round) {
		if(this.p) {
			// define colors i'll be using to display the score
			const blue = this.p.color(69, 123, 157, 80);
			const extraLightBlue = this.p.color(168, 218, 220);
			const transExtraLightBlue = this.p.color(168, 218, 220, 80);


			const pongNetX = this.tableWidth/2 - ((this.tableWidth/70)/2);
			const pongNetY = this.tableWidth/100;
			const pongNetW = this.tableWidth/70;
			const pongNetH = this.tableHeight - ((this.tableWidth/100)*2);
			this.p.fill(blue);
			this.p.rect( pongNetX, pongNetY, pongNetW, pongNetH);
			
			this.p.textFont("Quicksand");
			this.p.textStyle(this.p.BOLD);
			this.p.textLeading(1.159);
			
			
			// display the left player username
			this.p.textSize(this.tableWidth/60);
			this.p.fill(extraLightBlue);
			this.p.textAlign(this.p.RIGHT, this.p.TOP);
			this.p.text(addLetterSpacing(leftPlayer.userName, 1), this.tableWidth/2 - (pongNetW*7), pongNetY + 5);
			// display the left player rounds score
			this.p.fill(transExtraLightBlue);
			this.p.text(leftPlayer.score, this.tableWidth/2 - (pongNetW*2), pongNetY + 5 );
			// display the current round's score of the left player
			this.p.fill(blue);
			this.p.textSize(this.tableWidth/7);
			let roundScore = padNumberWithZero(round.leftPlayerScore);
			this.p.text(roundScore, this.tableWidth/2 - (pongNetW*6), pongNetY + this.tableHeight/15);



			// display the right player username
			this.p.textSize(this.tableWidth/60);
			this.p.fill(extraLightBlue);
			this.p.textAlign(this.p.LEFT, this.p.TOP);
			this.p.text(addLetterSpacing(rightPlayer.userName, 1), this.tableWidth/2 + (pongNetW*7), pongNetY + 5);
			// display the right player score
			this.p.fill(transExtraLightBlue);
			this.p.text(rightPlayer.score, this.tableWidth/2 + (pongNetW*2), pongNetY + 5 );
			// display the current round's score of the right player 
			this.p.fill(blue);
			this.p.textSize(this.tableWidth/7);
			roundScore = padNumberWithZero(round.rightPlayerScore);
			this.p.text(roundScore, this.tableWidth/2 + (pongNetW*6), pongNetY + this.tableHeight/15);
		}
	}
}

function padNumberWithZero(number : number) : string {
	if (number < 10) {
		return `0${number}`;
	} else {
	return `${number}`;
	}
}

function addLetterSpacing(input: string, amount: number) : string {
	// 'spacer' character to use
	// (can be passed in as an optional argument, or it
	// will use the unicode 'hair space' one by default)
	let spacerCharacter = '\u2007';

	// split the string into a list of characters
	let characters: string[] = input.split('');

	// create a series of spacers using the repeat() function
	spacerCharacter = spacerCharacter.repeat(amount);

	// use join() to combine characters with the spacer
	// and send back as a string
	return characters.join(spacerCharacter);
}
