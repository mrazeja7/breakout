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
	}
	updatePos(x, y)
	{
		this.x = Math.floor(x);
		this.y = Math.floor(y) - this.radius;
	}
	speedUp(factor)
	{
		this.yVelocity *= factor;		
	}
	fire()
	{
		this.xVelocity = (this.x - this.canvasDims.width/2) / 30;
		this.yVelocity = -4;
		this.y -= 10;
	}
	update(paddle, bricks)
	{
		this.wallCollision();
		this.paddleCollision(paddle);
		this.brickCollision(bricks);

		this.x += this.xVelocity;
		this.y += this.yVelocity;
	}
	outOfBounds()
	{
		return (this.y > this.canvasDims.height);
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
		if (this.yVelocity === 0)
			return;
		var diff = (this.y + this.radius - paddle.y);
		// the ball is bouncing off the paddle		
		if ((this.x + this.radius) > paddle.x
		 && (this.x - this.radius) < (paddle.x + paddle.width)
		 && diff >= 0 && diff <= 10)
		{
			// change xVelocity based on the collision "angle"
			this.xVelocity = (this.x - (paddle.x + paddle.width/2)) / 20;
			this.bounce('up')  
		}
	}

	brickCollision(bricks)
	{
		for (var i = 0; i < bricks.length; i++) 
		{
			if (!bricks[i].active)
				continue;

			// the brick is hit from underneath
			if ((this.x + this.radius) > bricks[i].x 
				&& (this.x - this.radius) < (bricks[i].x + bricks[i].width) 
				&& (this.y - this.radius - (bricks[i].y + bricks[i].height)) <= 0
				&& (this.y - this.radius - (bricks[i].y + bricks[i].height)) >= -10 
				&& this.yVelocity < 0)				
			{
				this.bounce('down');
				bricks[i].hit();
				return;
			}
			// the brick is hit from above
			if ((this.x + this.radius) > bricks[i].x
				&& (this.x - this.radius) < (bricks[i].x + bricks[i].width) 
				&& (this.y + this.radius - (bricks[i].y)) >= 0
				&& (this.y + this.radius - (bricks[i].y)) <= 10 
				&& this.yVelocity > 0)				
			{
				this.bounce('up');
				bricks[i].hit();
				return;
			}
			// the brick is hit from the left side
			if ((this.y - this.radius) < bricks[i].y + bricks[i].height
				&& (this.y + this.radius) > (bricks[i].y)
				&& (this.x + this.radius - bricks[i].x) >= 0
				&& (this.x + this.radius - bricks[i].x) <= 10
				&& this.xVelocity > 0)			
			{
				this.bounce('right');
				bricks[i].hit();
				return;

			}
			// the brick is hit from the right side
			if ((this.y - this.radius) < bricks[i].y + bricks[i].height
				&& (this.y + this.radius) > (bricks[i].y)
				&& (this.x - this.radius - bricks[i].x - bricks[i].width) >= 0
				&& (this.x - this.radius - bricks[i].x - bricks[i].width) <= 10
				&& this.xVelocity < 0)				
			{
				this.bounce('left');
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

	    /*ctx.shadowColor = '#000000';
		ctx.shadowBlur = 20;
		ctx.shadowOffsetX = 5;
		ctx.shadowOffsetY = 5;*/

		ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2);
		ctx.fill();
		ctx.closePath();
		ctx.restore();
	}
}