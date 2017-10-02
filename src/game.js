import Paddle from './paddle'
import Brick from './brick'
import Ball from './ball'

export default class Game
{
	constructor(lives, score)
	{
		this.canvas = document.createElement('canvas');
		document.body.appendChild(this.canvas);
		this.canvas.height = 600;
		this.canvas.width = 500;
		this.brickRows = 6;
		this.brickColumns = 10;
		this.ctx = this.canvas.getContext('2d');

		this.over = false;
		this.score = score;
		this.lives = lives;
		this.turnTimeout = 3000;
		this.ball = new Ball({width: this.canvas.width, height: this.canvas.height});
		this.paddle = new Paddle({width: this.canvas.width, height: this.canvas.height}, this.ball);
		

		this.bricks = [];
		this.brickColors = ['grey', 'red', 'yellow', 'blue', '#FF00FF', 'green'];

		// what a mess
		for (var i = 0; i < this.brickRows; i++) 
		{
			for (var j = 0; j < this.brickColumns; j++) 
			{
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
	    this.winScreen = this.winScreen.bind(this);
	    this.lossScreen = this.lossScreen.bind(this);
	    this.continueScreen = this.continueScreen.bind(this);
	    this.interval = setInterval(this.loop, 10);
	}
	// TODO
	checkGameOver()
	{
		if (this.ball.outOfBounds())
		{
			this.over = true;

			clearInterval(this.interval);

			if (this.lives === 1)
			{
				// display a splash screen with the score
				this.lossScreen();
			}
			else
			{
				this.continueScreen();

				// restart the game after a timeout
				setTimeout(function() 
		        {
		        	document.body.removeChild(this.canvas);
					this.constructor(this.lives-1, this.score);
				}.bind(this), this.turnTimeout);	
			}			
		}

		if (this.bricks.length === 0)
		{
			clearInterval(this.interval);
			this.over = true;
			this.winScreen();
		}
	}
	drawSplashScreen(color, text)
	{
		this.ctx.save();

		this.ctx.fillStyle = color;		
		this.ctx.fillRect(this.canvas.width/6, this.canvas.height/2, this.canvas.width*2/3, this.canvas.height*1/6);

		// TODO plural
		this.ctx.font = '16px courier';
		this.ctx.fillStyle = 'white';
		for (var i = 0; i < text.length; i++) 
		{
			this.ctx.fillText(text[i], this.canvas.width/2 - this.ctx.measureText(text[i]).width/2, (this.canvas.height*7/12 - 8 + 24*i));
		}
		this.ctx.restore();

	}
	winScreen()
	{
		this.drawSplashScreen('#009900', ['You cleared all the bricks!',(' You scored ' + this.score + ' points.')]);
		return;
	}
	lossScreen()
	{
		//alert('You lost! Your score is ' + this.score);

		this.drawSplashScreen('#990000',['You lost!',('You scored ' + this.score + ' points.')]);
		return;

		this.ctx.save();

		this.ctx.fillStyle = '#990000';		
		this.ctx.fillRect(this.canvas.width/6, this.canvas.height/2, this.canvas.width*2/3, this.canvas.height*1/6);
		//this.ctx.strokeStyle = 'silver';
		//this.ctx.strokeRect(this.canvas.width/6, this.canvas.height/2, this.canvas.width*2/3, this.canvas.height*1/6);

		// TODO plural
		this.ctx.font = '16px courier';
		this.ctx.fillStyle = 'white';
		var lost = ('You lost!');
		var score = ('You scored ' + this.score + ' points.');
		this.ctx.fillText(lost, this.canvas.width/2 - this.ctx.measureText(lost).width/2, this.canvas.height*7/12 - 8);
		this.ctx.fillText(score, this.canvas.width/2 - this.ctx.measureText(score).width/2, this.canvas.height*7/12 + 16);
		this.ctx.restore();
	}
	
	continueScreen()
	{
		this.drawSplashScreen('#999900', [('You have ' + (this.lives-1) + ' balls left.'),
										  ('Continuing in ' + this.turnTimeout/1000 + ' seconds...')]);
		return;

		this.ctx.save();

		this.ctx.fillStyle = '#009900';		
		this.ctx.fillRect(this.canvas.width/6, this.canvas.height/2, this.canvas.width*2/3, this.canvas.height*1/6);
		//this.ctx.strokeStyle = 'silver';
		//this.ctx.strokeRect(this.canvas.width/6, this.canvas.height/2, this.canvas.width*2/3, this.canvas.height*1/6);

		// TODO plural
		this.ctx.font = '16px courier';
		this.ctx.fillStyle = 'white';
		var balls = ('You have ' + (this.lives-1) + ' balls left.');
		var continuing = ('Continuing in ' + this.turnTimeout/1000 + ' seconds...');
		this.ctx.fillText(balls, this.canvas.width/2 - this.ctx.measureText(balls).width/2, this.canvas.height*7/12 - 8);
		this.ctx.fillText(continuing, this.canvas.width/2 - this.ctx.measureText(continuing).width/2, this.canvas.height*7/12 + 16);
		this.ctx.restore();
	}
	update()
	{
		if (this.over)
			return;

		this.checkGameOver();

		this.paddle.update();
		this.ball.update(this.paddle, this.bricks);

		for (var i = 0; i < this.bricks.length; i++) 
			if (!this.bricks[i].active)
			{
				this.score += this.bricks[i].points;
				this.bricks.splice(i, 1);					
			}
	}
	render()
	{
		if (this.over)
			return;

		this.ctx.save();
		this.ctx.fillStyle = '#152DA4'; // dark blue
		this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
		

		for (var i = 0; i < this.bricks.length; i++)
			this.bricks[i].render(this.ctx);		

		// render score
		this.ctx.font = '16px courier';
		this.ctx.fillStyle = 'white';
		this.ctx.fillText(('Score: ' + this.score), 5, this.canvas.height-10);

		// render remaining lives
		var lives = ('Lives: ' + (this.lives-1));
		this.ctx.fillText(lives, this.canvas.width - this.ctx.measureText(lives).width - 5, this.canvas.height-10);
		
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