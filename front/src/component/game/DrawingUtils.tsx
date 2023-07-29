import P5 from 'p5'
import { Paddle } from './classes/Paddle'

export function setShadowParam(
    color: string,
    blur: number,
    offsetX: number,
    offsetY: number,
    ctx : CanvasRenderingContext2D
) {
    ctx.shadowColor = color;
    ctx.shadowBlur = blur;
    ctx.shadowOffsetX = offsetX;
    ctx.shadowOffsetY = offsetY;
}

export function resetShadowParam(ctx : CanvasRenderingContext2D) {
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
}

export function drawPAddle(paddle : Paddle,) {
	if(paddle.table.ctx && paddle.table.p) {
		setShadowParam("#0F1E33", 15, 10, 10, paddle.table.ctx);
		// save the current state of the context
		paddle.table.ctx.save();

		const gradient = paddle.table.ctx.createLinearGradient(
			paddle.paddlePosX,
			0,
			paddle.paddlePosX + paddle.paddleWidth,
			0); 
		gradient.addColorStop(0, paddle.gradientColor2);
		gradient.addColorStop(1, paddle.gradientColor1);
		paddle.table.ctx.fillStyle = gradient;
		paddle.table.p.noStroke();
		paddle.table.p.rect(paddle.paddlePosX, paddle.paddlePosY, paddle.paddleWidth, paddle.paddleHeight, paddle.borderRadius);
		
		// restore the context to its previous state
		paddle.table.ctx.restore();

		resetShadowParam(paddle.table.ctx);
	}
}