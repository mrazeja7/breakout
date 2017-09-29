export default class Brick
{
	constructor(x, y, width, height, lives, color)
	{
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.lives = lives;
		this.color = color;

	}
	checkHit(ball) // checks whether the ball is colliding with the brick
	{

	}
	hit() // remove a life or destroy the brick
	{

	}
	destroy()
	{

	}
	update()
	{

	}
	render(ctx)
	{
		ctx.save();
		ctx.fillStyle = this.color;
		ctx.fillRect(this.x, this.y, this.width, this.height);
		ctx.strokeRect(this.x, this.y, this.width, this.height);
		ctx.restore();
	}

}