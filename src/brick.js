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
		this.active = true;
		this.points = points;

	}
	hit() // remove a life or destroy the brick
	{
		this.lives--;
		new Audio('sounds/brick.wav').play();
		if (this.lives === 0)
			this.destroy();
	}
	destroy()
	{
		this.active = false;		
	}
	render(ctx)
	{
		if (!this.active)
			return;
		ctx.save();
		ctx.fillStyle = this.color;		
		ctx.fillRect(this.x, this.y, this.width, this.height);
		ctx.strokeRect(this.x, this.y, this.width, this.height);
		ctx.restore();
	}

}