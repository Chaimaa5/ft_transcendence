import React, { TrackHTMLAttributes, useEffect, useRef, useState } from "react";
import P5 from 'p5'
import { ReactP5Wrapper } from "react-p5-wrapper";
import { Game } from "./classes/Game"
import { Paddle, PaddleSide } from "./classes/Paddle";
import { GameTable } from "./classes/GameTable";
import { Ball } from "./classes/Ball";
import Instanse from "../api/api";
import { useGameContext } from './GameContext';


export const PongBoard = ({gameProp ,gameIdProp}) => {
	const tableCanvasSizeRef = useRef<{width: number, height: number}>({
		width: 0,
		height: 0
	});
	const [dataIsLoaded, setDataIsLoaded] = useState(false);
	const {socket} = useGameContext();
	const gameRef = useRef(new Game(tableCanvasSizeRef.current.width, tableCanvasSizeRef.current.height));
	const roomId = "room_" + gameIdProp;

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
				gameProp.table.initTable(tableCanvasSizeRef.current.width, tableCanvasSizeRef.current.height, ctx, p, socket);
				gameProp.myPaddle.initPaddle(color1, color2);
				gameProp.opponentPaddle.initPaddle(color1, color2);
				gameProp.ball.initBall();
			};
	
			p.draw = () => {
				p.clear();
				gameProp.myPaddle.show();
				gameProp.myPaddle.updateMyPaddle(gameProp.ball.speedRatio);
				gameProp.opponentPaddle.show();
				gameProp.table.displayScore(gameProp.leftPlayer, gameProp.rightPlayer, gameProp.round);
				gameProp.ball.show();
			}
	
			p.windowResized = () => {
				tableCanvasSizeRef.current.width = getDivWidthAndHeight(".pong-table").width;
				tableCanvasSizeRef.current.height = getDivWidthAndHeight(".pong-table").height;
				gameProp.setTableDimensions(tableCanvasSizeRef.current.width, tableCanvasSizeRef.current.height);
				gameProp.setPaddlesDimensions(tableCanvasSizeRef.current.width, tableCanvasSizeRef.current.height);
				gameProp.ball.adjustBallDimensions();
				gameProp.myPaddle.adjustPaddleSpeed();
				gameProp.opponentPaddle.adjustPaddleSpeed();
				p.resizeCanvas(tableCanvasSizeRef.current.width, tableCanvasSizeRef.current.height, true);
			}

			p.keyReleased = () => {
				gameProp.myPaddle.move(0);
			}

			p.keyPressed = () => {
				if(p.keyCode === 38) 
				{
					gameProp.myPaddle.move(-1);
				}
				else if (p.keyCode === 40)
				{
					gameProp.myPaddle.move(1);
				}
			}
		}
		return <ReactP5Wrapper sketch={sketch}/>;
	}

	useEffect(() => {
		if(socket) {

			socket.on('updateBallPosition', (payload) => {
				if(payload.roomId === ("room_" + gameIdProp)) {
					gameProp.ball.ballPosX = gameProp.table.mapValue(payload.x, gameProp.table.serverTableWidth, gameProp.table.tableWidth);
					gameProp.ball.ballPosY = gameProp.table.mapValue(payload.y, gameProp.table.serverTableHeight, gameProp.table.tableHeight);
					gameProp.ball.speedRatio = gameProp.table.mapValue(payload.speedRatio, gameProp.table.serverTableWidth, gameProp.table.tableWidth);
				}
			})
	
			socket.on('updateScore', (payload) => {
				if(payload.roomId === roomId) {
					gameProp.leftPlayer.roundScore = payload.leftPlayerRoundScore;
					gameProp.rightPlayer.roundScore = payload.rightPlayerRoundScore;
					gameProp.round.roundNumber = payload.playeRounds;
					gameProp.round.leftPlayerScore = payload.leftScore;
					gameProp.round.rightPlayerScore = payload.rightScore;
					gameProp.myPaddle.borderRadius = gameProp.table.mapValue(gameProp.myPaddle.prevBorderRadius, gameProp.myPaddle.paddleHeight, payload.paddleHeight);
					gameProp.opponentPaddle.borderRadius = gameProp.table.mapValue(gameProp.myPaddle.prevBorderRadius, gameProp.myPaddle.paddleHeight, payload.paddleHeight);
					gameProp.myPaddle.paddleHeight = gameProp.table.mapValue(payload.paddleHeight, gameProp.table.serverTableWidth, gameProp.table.tableWidth);
					gameProp.opponentPaddle.paddleHeight = gameProp.table.mapValue(payload.paddleHeight, gameProp.table.serverTableWidth, gameProp.table.tableWidth); 
				}
			})

	
			socket.on('updatePaddlePosition', (payload) => {
				console.log("am here : " +  payload.roomId + " " + gameIdProp);
				if(payload.roomId === "room_" + gameIdProp) {
					gameProp.opponentPaddle.updateOpponentPaddle(payload.paddlePosY);
				}
			})
	
			socket.on('startGame', (payload) => {
				if(payload.roomId === roomId) {
					const myPaddleObj = (gameProp.myPaddle.side === PaddleSide.Left) ? payload.leftPlayerObj : payload.rightPlayerObj;
					const opponentPaddleObj = (gameProp.myPaddle.side === PaddleSide.Left) ? payload.rightPlayerObj : payload.leftPlayerObj;
					// paddle Position 
					gameProp.myPaddle.paddlePosX = myPaddleObj.x;
					gameProp.myPaddle.paddlePosY = myPaddleObj.y;
					gameProp.opponentPaddle.paddlePosX = opponentPaddleObj.x;
					gameProp.opponentPaddle.paddlePosY = opponentPaddleObj.y;
					// ball position and speed and initial angle
					gameProp.ball.ballPosX = payload.ballPosX;
					gameProp.ball.ballPosY = payload.ballPosY;
					gameProp.ball.speedX = payload.ballSpeedX;
					gameProp.ball.speedY = payload.ballSpeedY;
					gameProp.ball.randomInitialBallDirection = payload.initialBallAngle;
					gameProp.ball.speedRatio = payload.speedRatio;
					// paddle height 
					gameProp.myPaddle.paddleHeight = payload.paddleHeight;
					gameProp.opponentPaddle.paddleHeight = payload.paddleHeight;
					Instanse.get('/game/challenge-game/' + gameIdProp).
					then(response => {
						gameProp.rightPlayer = {userName: "" , roundScore : 0};
						gameProp.leftPlayer = {userName: "" , roundScore : 0};
						gameProp.rightPlayer.userName = response.data.player2.username;
						gameProp.leftPlayer.userName = response.data.player1.username;
						setDataIsLoaded(true);
					})
				}
			})
	
	
			return() => {
				socket.off('connect', () => {
					console.log('client side : client disconnected from the server');
				});
			}
		}
	}, []);

	return (
		<div className="pong-board">
			<div className="pong-table">
				{(dataIsLoaded == true) && <PongSketch />}
			</div>
		</div>
	);
}

