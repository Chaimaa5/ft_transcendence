import React, { TrackHTMLAttributes, useEffect, useRef, useState } from "react";
import P5 from 'p5'
import { ReactP5Wrapper } from "react-p5-wrapper";
import { Game } from "./classes/Game"
import { Paddle, PaddleSide } from "./classes/Paddle";
import { GameTable } from "./classes/GameTable";
import { Player } from "./classes/Player";
import { Ball } from "./classes/Ball";


const PongBoard: React.FC = () => {
	const tableCanvasSizeRef = useRef<{width: number, height: number}>({
		width: 0,
		height: 0
	});

	const game = new Game(tableCanvasSizeRef.current.width, tableCanvasSizeRef.current.height);
	
	function getDivWidthAndHeight(divId : string) : {width : number, height : number} {
		const Div = document.querySelector(divId) as HTMLElement;
		return({
			width: Div.offsetWidth,
			height: Div.offsetHeight
		});
	}

	function PongSketch() {
		
		function sketch(p: P5) {
			let canvas : P5.Renderer;
			let ctx : CanvasRenderingContext2D;
			let color1 : string = "#5C80B2";
			let color2 : string = "#8BA7CD";
			p.setup = () => {
				tableCanvasSizeRef.current.width = getDivWidthAndHeight(".pong-table").width;
				tableCanvasSizeRef.current.height = getDivWidthAndHeight(".pong-table").height;
				let div = p.createDiv('');
				div.addClass('pong-canva');
				canvas = p.createCanvas(tableCanvasSizeRef.current.width, tableCanvasSizeRef.current.height).parent(div);
				const html5Canvas = canvas.elt;
				ctx = html5Canvas.getContext('2d');
				game.table.initTable(tableCanvasSizeRef.current.width, tableCanvasSizeRef.current.height, ctx, p);
				game.ball.initBall();
				game.rightPaddle.initPaddle(color1, color2, PaddleSide.Right);
				game.leftPaddle.initPaddle(color1, color2, PaddleSide.Left);
			};
	
			p.draw = () => {
				p.clear();
				game.leftPaddle.show();
				game.leftPaddle.update();
				game.rightPaddle.show();
				game.rightPaddle.update();
				game.table.displayScore(game.leftPlayer, game.rightPlayer, game.round);
				game.ball.show();
				game.ball.move();
				game.ball.edges(game);
				game.ball.checkPaddleHits(game.rightPaddle);
				game.ball.checkPaddleHits(game.leftPaddle);
			}
	
			p.windowResized = () => {
				tableCanvasSizeRef.current.width = getDivWidthAndHeight(".pong-table").width;
				tableCanvasSizeRef.current.height = getDivWidthAndHeight(".pong-table").height;
				game.setTableDimensions(tableCanvasSizeRef.current.width, tableCanvasSizeRef.current.height);
				game.setPaddlesDimensions(tableCanvasSizeRef.current.width, tableCanvasSizeRef.current.height);
				game.ball.resizeBall();
				game.ball.adjustBallSpeed();
				game.leftPaddle.adjustPaddleSpeed();
				game.rightPaddle.adjustPaddleSpeed();
				p.resizeCanvas(tableCanvasSizeRef.current.width, tableCanvasSizeRef.current.height, true);
			}

			p.keyReleased = () => {
				game.rightPaddle.move(0);
				game.leftPaddle.move(0);
			}

			p.keyPressed = () => {
				if(p.keyCode === 87) // w
					game.leftPaddle.move(-1);
				else if (p.keyCode === 83) // s
					game.leftPaddle.move(1);
				
				if(p.keyCode === 73)
					game.rightPaddle.move(-1) // i
				else if(p.keyCode === 75)
					game.rightPaddle.move(1) //k
			}
		}
		return <ReactP5Wrapper sketch={sketch}/>;
	}

	return (
		<div className="pong-board">
			<div className="pong-table">
				<PongSketch />
			</div>
		</div>
	);
}



export default PongBoard;

