export default class Paddle
{
	constructor(canvasW, canvasH)
	{
		this.width = 50;
		this.height = 20;
		this.canvasW = canvasW;
		this.y = canvasH*4/5; // the paddle is located somewhere in the bottom fifth of the screen
		this.x = (canvasW-50)/2; // around the middle of the screen

		this.speed = 0;
		this.topSpeed = 10;
		this.accel = 2;

		window.onkeydown = this.handleKeyDown.bind(this);
		window.onkeyup = this.handleKeyUp.bind(this);
		this.movement = null;
	}
	update()
	{
		this.move();
	}
	handleKeyDown(event)
	{
		var key = event.key;
	    switch(key)
	    {
	      case 'ArrowLeft':
	      case 'a':
	        this.movement = 'left';
	        console.log('left');
	        break;
	      case 'ArrowRight':
	      case 'd':
	        this.movement = 'right';
	        console.log('right');
	        break;
	      default:
	        return;
	    }
	}
	handleKeyUp(event)
	{
		var key = event.key;
		switch(key)
	    {
	      case 'ArrowLeft':
	      case 'a':
	      case 'ArrowRight':
	      case 'd':
	        this.movement = null;
	        console.log('stop');
	        break;
	      default:
	        return;
	    }
	}
	move()
	{
		switch(this.movement)
		{
			case 'left':
				if (this.x < 0)
					return;
				this.speed = -this.topSpeed;
				break;
			case 'right':
				if ((this.x + this.width) > this.canvasW)
					return;
				this.speed = this.topSpeed;
				break;
			default:
				this.speed = 0;
				break;
		}		

		this.x += this.speed;
	}
	render(ctx)
	{
		ctx.save();
		ctx.fillStyle = 'black';
		ctx.fillRect(this.x, this.y, this.width, this.height);
		ctx.restore();
	}
}