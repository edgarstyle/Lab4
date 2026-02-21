import React, { useEffect, useRef } from 'react';

const Canvas = ({ r, points, onCanvasClick }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || r <= 0) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const padding = 40;
    const graphWidth = width - 2 * padding;
    const step = graphWidth / (r * 2); // Масштаб для отображения от -r до r

    // Очистка canvas
    ctx.clearRect(0, 0, width, height);

    // Фон
    ctx.fillStyle = '#f8f9fa';
    ctx.fillRect(0, 0, width, height);

    // Сетка
    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 1;
    for (let i = -r; i <= r; i += r / 2) {
      const x = centerX + (i * step);
      const y = centerY - (i * step);
      
      if (x >= padding && x <= width - padding) {
        ctx.beginPath();
        ctx.moveTo(x, padding);
        ctx.lineTo(x, height - padding);
        ctx.stroke();
      }
      
      if (y >= padding && y <= height - padding) {
        ctx.beginPath();
        ctx.moveTo(padding, y);
        ctx.lineTo(width - padding, y);
        ctx.stroke();
      }
    }

    // Оси координат
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(centerX, padding);
    ctx.lineTo(centerX, height - padding);
    ctx.moveTo(padding, centerY);
    ctx.lineTo(width - padding, centerY);
    ctx.stroke();

    // Стрелки на осях
    ctx.fillStyle = '#000';
    // Стрелка X
    ctx.beginPath();
    ctx.moveTo(width - padding - 10, centerY);
    ctx.lineTo(width - padding - 20, centerY - 5);
    ctx.lineTo(width - padding - 20, centerY + 5);
    ctx.closePath();
    ctx.fill();
    // Стрелка Y
    ctx.beginPath();
    ctx.moveTo(centerX, padding + 10);
    ctx.lineTo(centerX - 5, padding + 20);
    ctx.lineTo(centerX + 5, padding + 20);
    ctx.closePath();
    ctx.fill();

    // Подписи осей
    ctx.fillStyle = '#000';
    ctx.font = '14px Arial';
    ctx.fillText('X', width - padding - 15, centerY - 10);
    ctx.fillText('Y', centerX + 10, padding + 15);

    // Подписи значений на осях
    ctx.font = '11px Arial';
    for (let i = -r; i <= r; i += r / 2) {
      if (i === 0) continue;
      const x = centerX + (i * step);
      const y = centerY - (i * step);
      
      if (x >= padding && x <= width - padding) {
        ctx.fillText(i.toString(), x - 8, centerY + 18);
      }
      if (y >= padding && y <= height - padding) {
        ctx.fillText(i.toString(), centerX + 12, y + 4);
      }
    }

    // Рисование области (вариант 88744)
    ctx.fillStyle = 'rgba(102, 126, 234, 0.5)';
    ctx.strokeStyle = '#667eea';
    ctx.lineWidth = 2;

    // Квадрат во 4-й четверти: x от 0 до R, y от 0 до R
    const rectX = centerX + r * step;
    const rectY = centerY + r * step;
    const rectWidth = -r  * step;
    const rectHeight = -r * step;
    ctx.beginPath();
    ctx.rect(rectX, rectY, rectWidth, rectHeight);
    ctx.fill();
    ctx.stroke();

    // Треугольник в 2-й четверти: вершины (0, 0), (-R/2, 0), (0, R/2)
    // Условие: x + y ≤ R/2
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(centerX - (r / 2) * step, centerY);
    ctx.lineTo(centerX, centerY - (r / 2) * step);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Четверть круга в 1-й четверти: центр (0,0), радиус R, от x=0 до R, от y=-R до 0
    // Углы: от 270° (Math.PI 1*5) до 360° (0), по часовой стрелке
    ctx.beginPath();
    ctx.arc(centerX, centerY, r * step, Math.PI * 1.5, 0, false);
    ctx.lineTo(centerX, centerY);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Рисование точек
    if (points && points.length > 0) {
      points.forEach(point => {
        const pointR = parseFloat(point.r);
        if (pointR !== r) return; // Показываем только точки для текущего R
        
        const pointX = centerX + (parseFloat(point.x) * step);
        const pointY = centerY - (parseFloat(point.y) * step);
        
        ctx.fillStyle = point.hit ? '#28a745' : '#dc3545';
        ctx.beginPath();
        ctx.arc(pointX, pointY, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 1;
        ctx.stroke();
      });
    }

  }, [r, points]);

  const handleClick = (e) => {
    const canvas = canvasRef.current;
    if (!canvas || !onCanvasClick) return;

    const rect = canvas.getBoundingClientRect();
    // Получаем масштаб между видимым размером и внутренним размером canvas
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    // Преобразуем координаты клика с учетом масштаба
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;
    
    onCanvasClick(x, y, canvas.width, canvas.height);
  };

  return (
    <canvas
      ref={canvasRef}
      width={500}
      height={500}
      onClick={handleClick}
      style={{ cursor: 'crosshair' }}
    />
  );
};

export default Canvas;

