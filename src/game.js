import Paddle from './paddle'
import Brick from './brick'

export default class Game
{
	constructor()
	{
		this.canvas = document.createElement('canvas');
		document.body.appendChild(this.canvas);
		this.canvas.height = 600;
		this.canvas.width = 500;
		this.brickRows = 5;
		this.brickColumns = 10;
		this.ctx = this.canvas.getContext('2d');

		this.paddle = new Paddle(this.canvas.width, this.canvas.height);
		this.ball = null;
		this.bricks = [];
		this.brickColors = ['grey', 'red', 'yellow', 'blue', 'green'];
		for (var i = 0; i < this.brickRows; i++) {
			for (var j = 0; j < this.brickColumns; j++) {
				this.bricks.push(new Brick(this.canvas.width/this.brickColumns * j,
									  this.canvas.height/6 + this.canvas.height/5/this.brickRows * i,
									  this.canvas.width/this.brickColumns,
									  this.canvas.height/5/this.brickRows,
									  this.brickRows - i, this.brickColors[i]
									  ));
			}
			
		}
		
		this.update = this.update.bind(this);
	    this.render = this.render.bind(this);
	    this.loop = this.loop.bind(this);
	    this.interval = setInterval(this.loop, 50);
	}
	update()
	{
		this.paddle.update();
	}
	render()
	{
		this.ctx.save();
		this.ctx.fillStyle = '#152DA4';
		this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
		this.ctx.restore();

		for (var i = 0; i < this.bricks.length; i++) {
			this.bricks[i].render(this.ctx);
		}
		/*this.bricks.forEach(function(brick)
		{
			brick.render(this.ctx);
		});*/
		this.paddle.render(this.ctx);
	}
	loop()
	{
		this.update();
		this.render();
	}
}