export default class Paddle
{
	constructor(canvasDims, ball)
	{
		this.width = 200;
		this.height = 20;
		// length of the triangular ramps at the ends
		this.triangularPartsLength = 20;
		this.canvasDims = canvasDims;
		this.y = this.canvasDims.height*4/5; // the paddle is located somewhere in the bottom fifth of the screen
		this.x = (this.canvasDims.width - this.width)/2; // around the middle of the screen

		this.speed = 0;
		this.topSpeed = 7;

		window.onkeydown = this.handleKeyDown.bind(this);
		window.onkeyup = this.handleKeyUp.bind(this);
		this.movement = null;
		this.ball = ball;
		//this.ball.fired = false;
	}
	fireBall()
	{
		if (this.ball.fired)
			return;
		this.ball.fire();
	}
	update()
	{
		this.move();
	}
	handleKeyDown(event)
	{
		var key = event.key;
		//console.log(key);
	    switch(key)
	    {
	    	case ' ':
	    		this.fireBall();
	    		break;
	      	case 'ArrowLeft':
	      	case 'a':
		        this.movement = 'left';
		        //console.log('left');
		        break;
	      	case 'ArrowRight':
	      	case 'd':
		        this.movement = 'right';
		        //console.log('right');
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
	        //console.log('stop');
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
				if (this.x <= 0)
					return;
				this.speed = -this.topSpeed;
				break;
			case 'right':
				if ((this.x + this.width) >= this.canvasDims.width)
					return;
				this.speed = this.topSpeed;
				break;
			default:
				this.speed = 0;
				break;
		}		

		this.x += this.speed;
		if (!this.ball.fired)
			this.ball.updatePos(this.x + this.width/2, this.y);
	}
	render(ctx)
	{
		// TODO nicer shape (triangles at the ends?)
		ctx.save();
		ctx.fillStyle = 'black';
		ctx.strokeStyle = 'silver';
		ctx.fillRect(this.x + this.triangularPartsLength, this.y, this.width - this.triangularPartsLength*2, this.height);

		ctx.fillStyle = '#BC0000';

		ctx.beginPath();
	    ctx.moveTo(this.x + this.triangularPartsLength, this.y);
	    ctx.lineTo(this.x, this.y + this.height);
	    ctx.lineTo(this.x + this.triangularPartsLength, this.y + this.height);
	    ctx.fill();
	    ctx.stroke();

	    ctx.beginPath();
	    ctx.moveTo(this.x + this.width - this.triangularPartsLength, this.y);
	    ctx.lineTo(this.x + this.width, this.y + this.height);
	    ctx.lineTo(this.x + this.width - this.triangularPartsLength, this.y + this.height);
	    ctx.fill();
	    ctx.stroke();

		ctx.strokeRect(this.x + this.triangularPartsLength, this.y, this.width - this.triangularPartsLength*2, this.height);

		// render a tooltip
		if (!this.ball.fired)
		{
			ctx.font = '16px courier';
			ctx.fillStyle = 'white';
			var space = 'Press space';
			ctx.fillText(space, this.x + this.width/2 - ctx.measureText(space).width/2, this.y + 14);
		}	

		ctx.restore();
	}
}