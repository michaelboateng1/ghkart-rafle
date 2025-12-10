class Particle {
	constructor(canvasWidth, canvasHeight) {
		this.canvasWidth = canvasWidth;
		this.canvasHeight = canvasHeight;
		this.positionX = Math.random() * this.canvasWidth;
		this.positionY = Math.random() * this.canvasHeight;
		this.velocityX = Math.random() * 3;
		this.velocityY = Math.random() * 3;
		this.radius = Math.random() * 3 + 10;
		this.color = `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, .1)`;
	}

	draw(ctx) {
		ctx.beginPath();
		ctx.fillStyle = this.color;
		ctx.arc(this.positionX, this.positionY, this.radius, 0, Math.PI * 2);
		ctx.fill();
	}

	update() {
		this.positionX += this.velocityX * Math.sin(this.velocityY);
		this.positionY += this.velocityY * Math.cos(this.velocityX);

		if (this.positionX - this.radius < 0 || this.positionX + this.radius > this.canvasWidth) {
			this.velocityX *= -1;
		}

		if (this.positionY - this.radius < 0 || this.positionY + this.radius > this.canvasHeight) {
			this.velocityY *= -1;
		}
	}
}

export default Particle;
