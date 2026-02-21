import React, { useRef, useEffect } from 'react';

const Canvas = ({ r, results, onCanvasClick }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    const padding = 40;
    const centerX = width / 2;
    const centerY = height / 2;

    // Очистка canvas
    ctx.clearRect(0, 0, width, height);

    // Фон
    ctx.fillStyle = '#f5f5f5';
    ctx.fillRect(0, 0, width, height);

    if (r && r > 0) {
      const graphWidth = width - 2 * padding;
      const step = graphWidth / (r * 2);

      // Оси координат
      ctx.strokeStyle = '#000';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(padding, centerY);
      ctx.lineTo(width - padding, centerY);
      ctx.moveTo(centerX, padding);
      ctx.lineTo(centerX, height - padding);
      ctx.stroke();

      // Стрелки
      ctx.beginPath();
      ctx.moveTo(width - padding, centerY);
      ctx.lineTo(width - padding - 10, centerY - 5);
      ctx.lineTo(width - padding - 10, centerY + 5);
      ctx.closePath();
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(centerX, padding);
      ctx.lineTo(centerX - 5, padding + 10);
      ctx.lineTo(centerX + 5, padding + 10);
      ctx.closePath();
      ctx.fill();

      // Подписи осей
      ctx.fillStyle = '#000';
      ctx.font = '14px Arial';
      ctx.fillText('X', width - padding - 20, centerY - 10);
      ctx.fillText('Y', centerX + 10, padding + 20);

      // Сетка и подписи
      ctx.strokeStyle = '#ccc';
      ctx.lineWidth = 1;
      ctx.fillStyle = '#666';
      ctx.font = '12px Arial';

      // Горизонтальные линии
      for (let i = -r; i <= r; i += r / 2) {
        if (i === 0) continue;
        const y = centerY - i * step;
        ctx.beginPath();
        ctx.moveTo(padding, y);
        ctx.lineTo(width - padding, y);
        ctx.stroke();
        ctx.fillText(i.toString(), centerX + 5, y + 4);
      }

      // Вертикальные линии
      for (let i = -r; i <= r; i += r / 2) {
        if (i === 0) continue;
        const x = centerX + i * step;
        ctx.beginPath();
        ctx.moveTo(x, padding);
        ctx.lineTo(x, height - padding);
        ctx.stroke();
        ctx.fillText(i.toString(), x - 5, centerY - 5);
      }

      // Область попадания
      ctx.fillStyle = 'rgba(0, 100, 200, 0.3)';

      // Прямоугольник во 2-й четверти (-R/2 <= x <= 0, 0 <= y <= R)
      ctx.fillRect(
        centerX - (r / 2) * step,
        centerY - r * step,
        (r / 2) * step,
        r * step
      );

      // Треугольник в 1-й четверти (0 <= x <= R/2, 0 <= y <= R, y <= R - 2x)
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(centerX + (r / 2) * step, centerY);
      ctx.lineTo(centerX, centerY - r * step);
      ctx.closePath();
      ctx.fill();

      // Четверть круга в 3-й четверти (центр (0,0), радиус R)
      ctx.beginPath();
      ctx.arc(centerX, centerY, r * step, Math.PI, Math.PI * 1.5, false);
      ctx.lineTo(centerX, centerY);
      ctx.closePath();
      ctx.fill();
    }

    // Рисуем точки
    if (results && results.length > 0 && r && r > 0) {
      const graphWidth = width - 2 * padding;
      const step = graphWidth / (r * 2);

      results.forEach(result => {
        if (result.r && parseFloat(result.r) === r) {
          const x = parseFloat(result.x);
          const y = parseFloat(result.y);
          const canvasX = centerX + x * step;
          const canvasY = centerY - y * step;

          ctx.fillStyle = result.hit ? '#00ff00' : '#ff0000';
          ctx.beginPath();
          ctx.arc(canvasX, canvasY, 4, 0, Math.PI * 2);
          ctx.fill();
        }
      });
    }
  }, [r, results]);

  const handleClick = (e) => {
    const canvas = canvasRef.current;
    if (!canvas || !onCanvasClick) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    onCanvasClick(x, y, canvas.width, canvas.height);
  };

  return (
    <div className="canvas-container">
      <canvas
        ref={canvasRef}
        width={500}
        height={500}
        onClick={handleClick}
        style={{ border: '1px solid #000', cursor: 'crosshair' }}
      />
    </div>
  );
};

export default Canvas;

