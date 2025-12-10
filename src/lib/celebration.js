        // const canvas = document.getElementById('confetti');
        // const ctx = canvas.getContext('2d');
        
        // // Set canvas to full screen
        // canvas.width = window.innerWidth;
        // canvas.height = window.innerHeight;
        
        // window.addEventListener('resize', () => {
        //     canvas.width = window.innerWidth;
        //     canvas.height = window.innerHeight;
        // });
        
class ConfettiPiece {
    constructor(x, y, side, canvasWidth, canvasHeight) {
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.x = x;
        this.y = y;
        this.width = Math.random() * 15 + 10;
        this.height = Math.random() * 10 + 5;
        this.color = `rgb(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255})`;
        this.rotation = Math.random() * 360;
        this.rotationSpeed = (Math.random() - 0.5) * 10;
        
        // Set velocity based on which side (left or right)
        if (side === 'left') {
            this.velocityX = Math.random() * 8 + 3; // Move right
        } else {
            this.velocityX = Math.random() * -8 - 3; // Move left
        }
        
        this.velocityY = Math.random() * -15 - 10;
        this.gravity = 0.4;
        this.drag = 0.99;
    }
    
    update() {
        this.velocityY += this.gravity;
        this.velocityX *= this.drag;
        this.x += this.velocityX;
        this.y += this.velocityY;
        this.rotation += this.rotationSpeed;
    }
    
    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation * Math.PI / 180);
        ctx.fillStyle = this.color;
        ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
        ctx.restore();
    }
    
    isOffScreen() {
        return this.y > this.canvasHeight + 50 || 
                this.x < -50 || 
                this.x > this.canvasWidth + 50;
    }
}
        
        // function createConfettiBurst(x, y, count, side) {
        //     for (let i = 0; i < count; i++) {
        //         confetti.push(new ConfettiPiece(x, y, side));
        //     }
        // }
        
        // function animate() {
        //     ctx.clearRect(0, 0, canvas.width, canvas.height);
            
        //     // Update and draw all confetti
        //     for (let i = confetti.length - 1; i >= 0; i--) {
        //         confetti[i].update();
        //         confetti[i].draw();
                
        //         // Remove if off screen
        //         if (confetti[i].isOffScreen()) {
        //             confetti.splice(i, 1);
        //         }
        //     }
            
        //     requestAnimationFrame(animate);
        // }

export default ConfettiPiece;