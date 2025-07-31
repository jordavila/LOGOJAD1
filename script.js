const canvas = document.getElementById('spark-canvas');
const ctx = canvas.getContext('2d');
const logo = document.getElementById('logo');

const particles = [];
const MAX_PARTICLES = 100;
const PADDING = 30;

logo.onload = () => {
  // Ajusta el tamaño del canvas con espacio adicional
  canvas.width = logo.width + PADDING * 2;
  canvas.height = logo.height + PADDING * 2;

  // Canvas temporal para extraer píxeles visibles
  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = canvas.width;
  tempCanvas.height = canvas.height;
  const tempCtx = tempCanvas.getContext('2d');
  tempCtx.drawImage(logo, PADDING, PADDING);

  const imageData = tempCtx.getImageData(0, 0, canvas.width, canvas.height);
  const visiblePixels = [];

  for (let y = 0; y < canvas.height; y += 4) {
    for (let x = 0; x < canvas.width; x += 4) {
      const index = (y * canvas.width + x) * 4;
      const alpha = imageData.data[index + 3];

      if (alpha > 10) {
        visiblePixels.push({ x, y });
      }
    }
  }

  function getRandomElectricColor(alpha) {
    const colors = [
      'rgba(173,216,230, OP)',
      'rgba(0,255,255, OP)',
      'rgba(255,255,255, OP)',
      'rgba(100,200,255, OP)',
      'rgba(224,215,63, OP)'
    ];
    let raw = colors[Math.floor(Math.random() * colors.length)];
    return raw.replace('OP', alpha.toFixed(2));
  }

  function spawnWeldEvent() {
    if (visiblePixels.length === 0) return;
    const { x, y } = visiblePixels[Math.floor(Math.random() * visiblePixels.length)];

    for (let i = 0; i < 20; i++) {
      particles.push({
        x,
        y,
        vx: (Math.random() - 0.5) * 6,
        vy: (Math.random() - 1.5) * 6,
        alpha: Math.random() * 1.5,
        radius: Math.random() * 1.5 + 0.8,
        color: getRandomElectricColor(1)
      });
    }

    const delay = Math.random() * 4500 + 500;
    setTimeout(spawnWeldEvent, delay);
  }

  function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Dibuja el logo en el canvas (centrado por padding)
    ctx.drawImage(logo, PADDING, PADDING);

    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.vy += 0.15;
      p.x += p.vx;
      p.y += p.vy;
      p.alpha -= 0.01;

      if (p.alpha <= 0) {
        particles.splice(i, 1);
        continue;
      }

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = p.color.replace('OP', p.alpha.toFixed(2));
      ctx.fill();
    }

    requestAnimationFrame(update);
  }

  spawnWeldEvent();
  update();
};
