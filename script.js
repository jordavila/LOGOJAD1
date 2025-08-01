const canvas = document.getElementById('spark-canvas');
const ctx = canvas.getContext('2d');
const logo = document.getElementById('logo');

const particles = [];
let visiblePixels = [];

class Particle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.vx = (Math.random() - 0.5) * 6;
    this.vy = (Math.random() - 1.5) * 6;
    this.opacity = Math.random() * 1.5;
    this.radius = Math.random() * 4 + 1;
    this.color = this.getRandomElectricColor();
  }

  getRandomElectricColor() {
    const colors = [
      'rgba(173,216,230, OP)',
      'rgba(0,255,255, OP)',
      'rgba(255,255,255, OP)',
      'rgba(100,200,255, OP)',
      'rgba(224,215,63, OP)'
    ];
    let raw = colors[Math.floor(Math.random() * colors.length)];
    return raw.replace('OP', this.opacity.toFixed(2));
  }

  update() {
    this.vy += 0.15;
    this.x += this.vx;
    this.y += this.vy;
    this.opacity -= 0.01;
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = this.getRandomElectricColor();
    ctx.fill();
  }
}

logo.onload = () => {
  const padding = 50;

  canvas.width = logo.width + padding * 2;
  canvas.height = logo.height + padding * 2;

  canvas.style.top = `-${padding}px`;
  canvas.style.left = `-${padding}px`;

  // Crear canvas temporal para obtener la forma del logo
  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = logo.width;
  tempCanvas.height = logo.height;
  const tempCtx = tempCanvas.getContext('2d');
  tempCtx.drawImage(logo, 0, 0);

  const imageData = tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height);

  for (let y = 0; y < tempCanvas.height; y += 4) {
    for (let x = 0; x < tempCanvas.width; x += 4) {
      const index = (y * tempCanvas.width + x) * 4;
      const alpha = imageData.data[index + 3];
      if (alpha > 10) {
        // Ajustar posición por el padding
        visiblePixels.push({ x: x + padding, y: y + padding });
      }
    }
  }

  generateWeldEvent();
  animate();
};

function generateWeldEvent() {
  if (visiblePixels.length === 0) return;

  const { x, y } = visiblePixels[Math.floor(Math.random() * visiblePixels.length)];
  for (let i = 0; i < 20; i++) {
    particles.push(new Particle(x, y));
  }

  const delay = Math.random() * 4500 + 500;
  setTimeout(generateWeldEvent, delay);
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.update();
    p.draw(ctx);
    if (p.opacity <= 0) {
      particles.splice(i, 1);
    }
  }

  requestAnimationFrame(animate);
}
