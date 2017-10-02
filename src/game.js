import Paddle from './paddle'
import Brick from './brick'
import Ball from './ball'

export default class Game
{
	constructor(lives)
	{
		this.canvas = document.createElement('canvas');
		document.body.appendChild(this.canvas);
		this.canvas.height = 600;
		this.canvas.width = 500;
		this.brickRows = 6;
		this.brickColumns = 10;
		this.ctx = this.canvas.getContext('2d');

		this.over = false;
		this.score = 0;
		this.lives = lives;
		this.ball = new Ball({width: this.canvas.width, height: this.canvas.height});
		this.paddle = new Paddle({width: this.canvas.width, height: this.canvas.height}, this.ball);
		

		this.bricks = [];
		this.brickColors = ['grey', 'red', 'yellow', 'blue', '#FF00FF', 'green'];

		// what a mess
		for (var i = 0; i < this.brickRows; i++) {
			for (var j = 0; j < this.brickColumns; j++) {
				this.bricks.push(new Brick(this.canvas.width/this.brickColumns * j,
									  this.canvas.height/6 + this.canvas.height/5/this.brickRows * i,
									  this.canvas.width/this.brickColumns,
									  this.canvas.height/5/this.brickRows,
									  this.brickRows - i, this.brickColors[i], 5
									  ));
			}
			
		}
		
		this.update = this.update.bind(this);
	    this.render = this.render.bind(this);
	    this.loop = this.loop.bind(this);
	    this.interval = setInterval(this.loop, 10);
	}
	// TODO
	checkGameOver()
	{
		if (this.ball.outOfBounds())
		{
			this.over = true;
			this.lossScreen();
		}

		if (this.bricks.length === 0)
		{
			this.over = true;
			this.winScreen();
		}
	}
	winScreen()
	{
		alert('You won!');
	}
	lossScreen()
	{
		alert('You lost!');
		document.body.removeChild(this.canvas);
		clearInterval(this.interval);
		this.constructor(this.lives-1);
	}
	update()
	{
		if (this.over)
			return;

		this.checkGameOver();

		this.paddle.update();
		this.ball.update(this.paddle, this.bricks);

		for (var i = 0; i < this.bricks.length; i++) 
		{
			if (!this.bricks[i].active)
			{
				this.score += this.bricks[i].points;
				this.bricks.splice(i, 1);					
			}
			
		}
		//console.log(this.bricks.length);
	}
	render()
	{
		this.ctx.save();
		this.ctx.fillStyle = '#152DA4'; // dark blue
		this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
		

		for (var i = 0; i < this.bricks.length; i++) {
			this.bricks[i].render(this.ctx);
		}

		// render score
		this.ctx.font = '16px courier';
		this.ctx.fillStyle = 'white';
		this.ctx.fillText(('Score: ' + this.score), 5, this.canvas.height-10);

		// render remaining lives
		this.ctx.fillText(('Lives: ') + this.lives, this.canvas.width - 85, this.canvas.height-10);
		
		this.paddle.render(this.ctx);
		this.ball.render(this.ctx);
		this.ctx.restore();
	}
	loop()
	{
		this.update();
		this.render();
	}
}