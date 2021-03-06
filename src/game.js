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
		this.speedLevel = 1;
		this.paddle = new Paddle({width: this.canvas.width, height: this.canvas.height}, this.ball);		

		this.bricks = [];
		this.explosions = [];
		this.brickColors = ['grey', 'red', 'yellow', 'blue', '#FF00FF', 'green'];

		// what a mess
		for (var i = 0; i < this.brickRows; i++)
		{
			for (var j = 0; j < this.brickColumns; j++)
			{
				// 						  (x, y, width, height, lives, color, points)
				this.bricks.push(new Brick(this.canvas.width/this.brickColumns * j,
										   this.canvas.height/6 + this.canvas.height/5/this.brickRows * i,
										   this.canvas.width/this.brickColumns,
										   this.canvas.height/5/this.brickRows,
										   1, 
										   this.brickColors[i], 
										   5*(this.brickRows-i)
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
	checkGameOver()
	{
		if (this.ball.outOfBounds())
		{
			this.over = true;

			clearInterval(this.interval);

			if (this.lives === 1)
				this.lossScreen();
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
	winScreen()
	{
		var effect = new Audio('sounds/win.wav')
		effect.volume = 0.5;
		effect.play();
		this.drawSplashScreen('#009900', ['You cleared all the bricks!',(' You scored ' + this.score + ' points.')]);
	}
	lossScreen()
	{
		var effect = new Audio('sounds/loss.wav')
		effect.volume = 0.5;
		effect.play();
		this.drawSplashScreen('#990000',['You lost!',('You scored ' + this.score + ' points.'),'Press F5 to play again.']);

		// draw the credits
		var d = document.createElement('div');
		document.body.appendChild(d);
		d.textContent = 'Sound credit: '
		var link = document.createElement('a');
		link.setAttribute('href', 'https://opengameart.org/content/8-bit-sound-effects-library');
		link.innerHTML = 'https://opengameart.org/content/8-bit-sound-effects-library';
		d.appendChild(link);
	}
	
	continueScreen()
	{
		var effect = new Audio('sounds/round.wav')
		effect.volume = 0.5;
		effect.play();
		this.drawSplashScreen('#999900', [('You have ' + (this.lives-1) + ' ball' + (this.lives-1===1?'':'s') +  ' left.'),
										  ('Continuing in ' + this.turnTimeout/1000 + ' seconds...')]);
	}
	drawSplashScreen(color, text)
	{
		this.ctx.save();

		this.ctx.fillStyle = color;		
		this.ctx.fillRect(this.canvas.width/6, this.canvas.height/2, this.canvas.width*2/3, this.canvas.height*1/6);

		this.ctx.font = '16px courier';
		this.ctx.fillStyle = 'white';
		// a very convoluted way to draw a variable number of text lines
		var lineHeight = (this.canvas.height*1/6)/(2*text.length + 1);
		var j = 0;
		for (var i = 0; i < 2*text.length + 1; i++) 
		{
			if (i%2 == 0)
				continue;
			this.ctx.fillText(text[j], this.canvas.width/2 - this.ctx.measureText(text[j]).width/2, 
				(this.canvas.height*1/2 + 8 + lineHeight*i));
			j++;
		}

		this.ctx.restore();

	}
	update()
	{
		if (this.over)
			return;

		if (this.score >= 200*this.speedLevel)
		{
			this.ball.speedUp(1.25);
			this.speedLevel*= 1.75;
		}

		this.checkGameOver();

		this.paddle.update();
		this.ball.update(this.paddle, this.bricks);

		for (var i = 0; i < this.bricks.length; i++) 
			if (!this.bricks[i].active)
			{
				// mark the brick as exploding
				this.score += this.bricks[i].points;
				this.explosions.push(this.bricks[i]);
				this.bricks.splice(i, 1);				
			}
	}
	render()
	{
		if (this.over)
			return;

		// render the background
		this.ctx.save();
		this.ctx.fillStyle = '#2222AA'; // dark blue
		this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
		

		for (var i = 0; i < this.bricks.length; i++)
			this.bricks[i].render(this.ctx);	

		// render all exploding bricks
		for (var i = 0; i < this.explosions.length; i++) 
		{
			if (this.explosions[i].exploding === false)
				this.explosions.splice(i, 1);
			else
				this.explosions[i].render(this.ctx);
		}	

		this.paddle.render(this.ctx);
		this.ball.render(this.ctx);
		// render score
		this.ctx.font = '16px courier';
		this.ctx.fillStyle = 'white';
		this.ctx.fillText(('Score: ' + this.score), 5, this.canvas.height-10);	
		// render remaining lives
		var lives = ('Lives: ' + (this.lives-1));
		this.ctx.fillText(lives, this.canvas.width - this.ctx.measureText(lives).width - 5, this.canvas.height-10);
			
		this.ctx.restore();
	}
	loop()
	{
		this.update();
		this.render();
	}
}