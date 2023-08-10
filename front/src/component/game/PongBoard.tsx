import React, { TrackHTMLAttributes, useEffect, useRef, useState } from "react";
import P5 from 'p5'
import { ReactP5Wrapper } from "react-p5-wrapper";
import { Game } from "./classes/Game"
import { Paddle, PaddleSide } from "./classes/Paddle";
import { GameTable } from "./classes/GameTable";
import { Player } from "./classes/Player";
import { Ball } from "./classes/Ball";
import { socket } from "./socket";

const PongBoard: React.FC = () => {
	const tableCanvasSizeRef = useRef<{width: number, height: number}>({
		width: 0,
		height: 0
	});


	const [dataIsLoaded, setDataIsLoaded] = useState(false);
	const [isConnected, setIsConnected] = useState(socket.connected);
	

	const gameRef = useRef(new Game(tableCanvasSizeRef.current.width, tableCanvasSizeRef.current.height));
	
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
				gameRef.current.table.initTable(tableCanvasSizeRef.current.width, tableCanvasSizeRef.current.height, ctx, p, socket);
				gameRef.current.ball.initBall();
				gameRef.current.myPaddle.initPaddle(color1, color2);
				gameRef.current.opponentPaddle.initPaddle(color1, color2);
			};
	
			p.draw = () => {
				p.clear();
				gameRef.current.myPaddle.show();
				gameRef.current.myPaddle.updateMyPaddle();
				gameRef.current.opponentPaddle.show();
				gameRef.current.table.displayScore(gameRef.current.leftPlayer, gameRef.current.rightPlayer, gameRef.current.round);
				gameRef.current.ball.show();
			}
	
			p.windowResized = () => {
				tableCanvasSizeRef.current.width = getDivWidthAndHeight(".pong-table").width;
				tableCanvasSizeRef.current.height = getDivWidthAndHeight(".pong-table").height;
				gameRef.current.setTableDimensions(tableCanvasSizeRef.current.width, tableCanvasSizeRef.current.height);
				gameRef.current.setPaddlesDimensions(tableCanvasSizeRef.current.width, tableCanvasSizeRef.current.height);
				gameRef.current.ball.adjustBallDimensions();
				gameRef.current.myPaddle.adjustPaddleSpeed();
				gameRef.current.opponentPaddle.adjustPaddleSpeed();
				p.resizeCanvas(tableCanvasSizeRef.current.width, tableCanvasSizeRef.current.height, true);
			}

			p.keyReleased = () => {
				gameRef.current.myPaddle.move(0);
			}

			p.keyPressed = () => {
				if(p.keyCode === 38) 
				{
					gameRef.current.myPaddle.move(-1);
				}
				else if (p.keyCode === 40)
				{
					gameRef.current.myPaddle.move(1);
				}
			}
		}
		return <ReactP5Wrapper sketch={sketch}/>;
	}

	useEffect(() => {

		socket.connect();

		socket.on('updateBallPosition', (payload) => {
			gameRef.current.ball.ballPosX = gameRef.current.table.mapValue(payload.x, gameRef.current.table.serverTableWidth, gameRef.current.table.tableWidth);
			gameRef.current.ball.ballPosY = gameRef.current.table.mapValue(payload.y, gameRef.current.table.serverTableHeight, gameRef.current.table.tableHeight);
		})
		 socket.on('updateScore', (payload) => {
			gameRef.current.updateScore(payload.side);
		 })

		socket.on('updatePaddlePosition', (payload) => {
			gameRef.current.opponentPaddle.updateOpponentPaddle(payload.paddlePosY);
		})

		socket.on('joinedRoom', (payload) =>{
			console.log(" the client has joined the room : " + payload.roomId);
			gameRef.current.table.roomId = payload.roomId;
			gameRef.current.myPaddle.side = payload.side;
			gameRef.current.opponentPaddle.side = (payload.side === PaddleSide.Left) ? PaddleSide.Right : PaddleSide.Left;
			gameRef.current.table.serverTableWidth = payload.serverTableWidth;
			gameRef.current.table.serverTableHeight = payload.serverTableHeight;
		});

		socket.on('startGame', (payload) => {
			const myPaddleObj = (gameRef.current.myPaddle.side === PaddleSide.Left) ? payload.leftPlayerObj : payload.rightPlayerObj;
			const opponentPaddleObj = (gameRef.current.myPaddle.side === PaddleSide.Left) ? payload.rightPlayerObj : payload.leftPlayerObj;
			gameRef.current.myPaddle.paddlePosX = myPaddleObj.x;
			gameRef.current.myPaddle.paddlePosY = myPaddleObj.y;
			gameRef.current.opponentPaddle.paddlePosX = opponentPaddleObj.x;
			gameRef.current.opponentPaddle.paddlePosY = opponentPaddleObj.y;
			gameRef.current.ball.ballPosX = payload.ballPosX;
			gameRef.current.ball.ballPosY = payload.ballPosY;
			gameRef.current.ball.speedX = payload.ballSpeedX;
			gameRef.current.ball.speedY = payload.ballSpeedY;
			gameRef.current.ball.randomInitialBallDirection = payload.initialBallAngle;
			// console.log("my paddle : -x- " + gameRef.current.myPaddle.paddlePosX + " -y- " + gameRef.current.myPaddle.paddlePosY + " opponent padddle  : -x- " +  gameRef.current.opponentPaddle.paddlePosX + " -y- " + gameRef.current.opponentPaddle.paddlePosY + " ball : -x- " + gameRef.current.ball.ballPosX + " -y- " + gameRef.current.ball.ballPosY + " - speed x - " + gameRef.current.ball.speedX + " - y - " + gameRef.current.ball.speedY + " angle " + gameRef.current.ball.randomInitialBallDirection);
			setDataIsLoaded(true);
		})

		socket.on('connect', () => {
			console.log('client side : client connected to the server');
			setIsConnected(true);
		});

		return() => {
			socket.off('connect', () => {
				console.log('client side : client disconnected from the server');
			});
			socket.disconnect();
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

export default PongBoard;