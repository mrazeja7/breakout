export default class Brick
{
	constructor(x, y, width, height, lives, color, points)
	{
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.lives = lives;
		this.color = color;
		this.points = points;
		this.active = true;
		
		this.exploding = false;
		this.explosion = [];
		this.explosion.frames = 30;
		this.explosion.xSteps = this.width/(2*this.explosion.frames);
		this.explosion.ySteps = this.height/(2*this.explosion.frames);

	}
	hit() // remove a life or destroy the brick
	{
		this.lives--;
		var effect = new Audio('sounds/brick.wav');
		effect.volume = 0.5;
		effect.play();
		if (this.lives === 0)
			this.destroy();
	}
	destroy()
	{
		this.active = false;		
		this.exploding = true;
	}
	render(ctx)
	{
		ctx.save();
		if (this.exploding)
		{
			this.explosion.frames--;
			
			ctx.globalAlpha = this.explosion.frames/30;

			this.x += this.explosion.xSteps;
			this.width -= 2*this.explosion.xSteps;

			this.y += this.explosion.ySteps;
			this.height -= 2*this.explosion.ySteps;

			if (this.explosion.frames === 0)
				this.exploding = false;
		}
		ctx.fillStyle = this.color;		
		ctx.fillRect(this.x, this.y, this.width, this.height);
		ctx.strokeRect(this.x, this.y, this.width, this.height);
		ctx.restore();
	}

}