import React, { TrackHTMLAttributes, useEffect, useRef, useState } from "react";
import P5 from 'p5'
import { ReactP5Wrapper } from "react-p5-wrapper";
import { Game } from "../classes/Game"
import { Paddle, PaddleSide } from "../classes/Paddle";
import { GameTable } from "../classes/GameTable";
import { Ball } from "../classes/Ball";
import { useTrainingContext } from "./TrainingContext";
import Instanse from "../../api/api";


export const TrainingPongBoard = (gameId) => {

	const {score, updateScore} = useTrainingContext();

	const [ballSpeed, setBallSpeed] = useState<number>(-1);
	const [paddleSize, setPaddleSize] = useState<string>('');
	const [dataIsLoaded, setDataIsLoaded] = useState(false);

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

	function TrainingPongSketch() {
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
				game.ball.initTrainingBall(ballSpeed);
				game.myPaddle.initTrainingPaddle(color1, color2, PaddleSide.Right, paddleSize, ballSpeed);
				game.opponentPaddle.initTrainingPaddle(color1, color2, PaddleSide.Left, paddleSize, ballSpeed);
			};
	
			p.draw = () => {
				p.clear();
				game.myPaddle.show();
				game.myPaddle.update();
				BOT(game);
				game.opponentPaddle.show();
				game.ball.show();
				game.ball.move();
				if(game.ball.edges(game) === true) {
					updateScore(score + 1);
				}
				game.ball.checkPaddleHits(game.myPaddle);
				game.ball.checkPaddleHits(game.opponentPaddle);
				game.table.displayTrainingNet(game.leftPlayer, game.rightPlayer, game.round);
			}
	
			p.windowResized = () => {
				tableCanvasSizeRef.current.width = getDivWidthAndHeight(".pong-table").width;
				tableCanvasSizeRef.current.height = getDivWidthAndHeight(".pong-table").height;
				game.setTableDimensions(tableCanvasSizeRef.current.width, tableCanvasSizeRef.current.height);
				game.setPaddlesDimensions(tableCanvasSizeRef.current.width, tableCanvasSizeRef.current.height);
				game.ball.adjustBallDimensions();
				game.opponentPaddle.adjustPaddleSpeed();
				game.myPaddle.adjustPaddleSpeed();
				p.resizeCanvas(tableCanvasSizeRef.current.width, tableCanvasSizeRef.current.height, true);
			}

			p.keyReleased = () => {
				game.myPaddle.move(0);
			}

			p.keyPressed = () => {
				if(p.keyCode === 38)
					game.myPaddle.move(-1)
				else if(p.keyCode === 40)
					game.myPaddle.move(1)
			}
		}
		return <ReactP5Wrapper sketch={sketch}/>;
	}

	useEffect(() => {
		async function fetchData() {
			try {
				await Instanse.get(`/game/training-settings/${gameId.gameId}`)
				.then(response => {
					setPaddleSize(response.data.paddleSize);
					setBallSpeed(response.data.ballSpeed);
				})
			} catch(error) {
				console.error('Error fetching data @Get /game/training-settings/:id" : ', error)
			}
		}
		fetchData();
	}, [])

	return (
		<div className="pong-board">
			<div className="pong-table">
			<TrainingPongSketch />
			</div>
		</div>
	);
}

function BOT(game : Game) {
	if((game.ball.ballPosX)  < (1*game.table.tableWidth)/2 && game.ball.speedX < 0)
	{
		if((game.opponentPaddle.paddlePosY + game.opponentPaddle.paddleHeight/2) < ( game.ball.ballPosY + game.table.tableHeight/3)) {
			game.opponentPaddle.chaseBall(1, game.ball.ballPosY);
		}
		else if((game.opponentPaddle.paddlePosY + game.opponentPaddle.paddleHeight/2) > (game.ball.ballPosY - game.table.tableHeight/3)) {
			game.opponentPaddle.chaseBall(-1, game.ball.ballPosY);
		}
	}
	else {
		if((game.opponentPaddle.paddlePosY + game.opponentPaddle.paddleHeight/2) < game.table.tableHeight/2 ) {
			game.opponentPaddle.moveToCenter(1);
		}
		else if((game.opponentPaddle.paddlePosY + game.opponentPaddle.paddleHeight/2) >= game.table.tableHeight/2) {
			game.opponentPaddle.moveToCenter(-1);
		}
	}
}