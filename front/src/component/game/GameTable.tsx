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

			const pongNetX = this.tableWidth/2 - ((this.tableWidth/70)/2);
			const pongNetY = this.tableWidth/100;
			const pongNetW = this.tableWidth/70;
			const pongNetH = this.tableHeight - ((this.tableWidth/100)*2);
			this.p.fill(blue);
			this.p.rect( pongNetX, pongNetY, pongNetW, pongNetH);
			
			this.p.fill(extraLightBlue);
			this.p.textFont("Quicksand");
			this.p.textSize(this.tableWidth/40);
			this.p.textStyle(this.p.BOLD);
			this.p.textLeading(1.159);
			
			
			// display the left score
			this.p.textAlign(this.p.RIGHT, this.p.TOP);
			this.p.text(addLetterSpacing(leftPlayer.userName, 1), this.tableWidth/2 - (pongNetW*2), pongNetY);

			// display the right score
			this.p.textAlign(this.p.LEFT, this.p.TOP);
			this.p.text(addLetterSpacing(rightPlayer.userName, 1), this.tableWidth/2 + (pongNetW*2), pongNetY);
		}
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
