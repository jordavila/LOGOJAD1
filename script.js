const canvas = document.getElementById('logoCanvas');
const ctx = canvas.getContext('2d');

canvas.width = 500;
canvas.height = 500;

const centerX = canvas.width / 2;
const centerY = canvas.height / 2;
const radius = 150;

function drawCircle() {
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(255, 255, 255, 0.03)';
  ctx.fill();
  ctx.closePath();
}

class Particle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.vx = (Math.random() - 0.5) * 6;
    this.vy = (Math.random() - 1.5) * 6;
    this.opacity = 1;
    this.radius = Math.random() * 1.5 + 0.8;
    this.color = this.getRandomElectricColor();
  }

  getRandomElectricColor() {
    const colors = [
      'rgba(173,216,230, OP)', // light blue
      'rgba(0,255,255, OP)',   // cyan
      'rgba(255,255,255, OP)', // white
      'rgba(100,200,255, OP)'  // bluish-white
    ];
    let raw = colors[Math.floor(Math.random() * colors.length)];
    return raw.replace('OP', this.opacity.toFixed(2));
  }

  update() {
    this.vy += 0.15;
    this.x += this.vx;
    this.y += this.vy;
    this.opacity -= 0.02;
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = this.getRandomElectricColor();
    ctx.fill();
  }
}

const particles = [];

// Genera un punto aleatorio sobre el borde del círculo
function randomPointOnCircle() {
  const angle = Math.random() * Math.PI * 2;
  const x = centerX + radius * Math.cos(angle);
  const y = centerY + radius * Math.sin(angle);
  return { x, y };
}

function generateWeldEvent() {
  const { x, y } = randomPointOnCircle();
  for (let i = 0; i < 15; i++) {
    particles.push(new Particle(x, y));
  }

  // Espera entre 0.5 y 5 segundos para la próxima chispa
  const delay = Math.random() * 4500 + 500;
  setTimeout(generateWeldEvent, delay);
}

// Loop principal de animación
function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawCircle();

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

// Iniciar animación
drawCircle();
generateWeldEvent();
animate();


  requestAnimationFrame(animate);
}
