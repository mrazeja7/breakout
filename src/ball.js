export default class Ball
{
	constructor(canvasDims)
	{
		this.x = 0;
		this.y = 0;
		this.xVelocity = 0;
		this.yVelocity = 0;
		this.radius = 10;
		this.canvasDims = canvasDims;
		//this.wallCollision = this.wallCollision.bind(this);
	}
	updatePos(x, y)
	{
		this.x = Math.floor(x);
		this.y = Math.floor(y) - this.radius;
		//console.log('pos updated to ' + this.x + ' ' + this.y);
	}
	fire()
	{
		this.xVelocity = (this.x - this.canvasDims.width/2) / 30;
		this.yVelocity = -4;
		this.y -= 10;
		
		console.log('fire: ' + this.xVelocity + ' ' + this.yVelocity);
	}
	update(paddle, bricks)
	{
		this.wallCollision();
		this.paddleCollision(paddle);
		this.brickCollision(bricks);

		this.x += this.xVelocity;
		this.y += this.yVelocity;
		//console.log('update: ' + this.x + ' ' + this.y);
	}

	wallCollision()
	{
		var arg = '';
		if (this.x <= this.radius)
			arg = 'right';  // the ball is bouncing off the left wall (it needs to bounce to the right)
		if (this.x + this.radius >= this.canvasDims.width)
			arg = 'left';
		if (this.y <= this.radius)
			arg = 'down';

		this.bounce(arg);
	}

	paddleCollision(paddle)
	{
		var diff = (this.y + this.radius - paddle.y);
		if ((this.x + this.radius) > paddle.x
		 && (this.x - this.radius) < (paddle.x + paddle.width)
		 && diff >= 0 && diff <= 10)
			this.bounce('up')  // the ball is bouncing off the paddle
	}

	brickCollision(bricks)
	{
		for (var i = 0; i < bricks.length; i++) 
		{
			if (!bricks[i].active)
				continue;

			if ((this.x + this.radius) > bricks[i].x 
				&& (this.x - this.radius) < (bricks[i].x + bricks[i].width) 
				&& (this.y - this.radius) <= (bricks[i].y + bricks[i].height)
				&& (this.y + this.radius) >= bricks[i].y ) // the brick is hit from underneath
			{
				this.bounce('down');
				bricks[i].hit();
				return;
			}
		}
	}

	bounce(direction)
	{
		switch(direction)
		{
			case 'left':
			case 'right':
				this.xVelocity *= -1;
				break;
			case 'down':
			case 'up':
				this.yVelocity *= -1;
				break;
			default:
				break;
		}
	}

	render(ctx)
	{
		ctx.save();
		ctx.beginPath();
		ctx.fillStyle = 'white';
		ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2);
		ctx.fill();
		ctx.closePath();
		ctx.restore();
	}
}