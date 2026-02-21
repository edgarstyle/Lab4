import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Checkbox, TextInput, Button } from './BelleComponents';
import { logout } from '../store/actions/authActions';
import { checkPoint, fetchResults, clearResults } from '../store/actions/resultActions';
import Canvas from './Canvas';
import Notification from './Notification';
import ConfirmDialog from './ConfirmDialog';

const MainPage = () => {
  const dispatch = useDispatch();
  const { userId, username } = useSelector(state => state.auth);
  const { results, loading, error } = useSelector(state => state.results);
  
  const [x, setX] = useState(null);
  const [y, setY] = useState('');
  const [r, setR] = useState(null);
  const [yError, setYError] = useState('');
  const [notification, setNotification] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState(null);

  const xValues = ['-3', '-2', '-1', '0', '1', '2', '3', '4', '5'];
  const rValues = ['-3', '-2', '-1', '0', '1', '2', '3', '4', '5'];

  // Функция для преобразования числа в строку с точностью до 5 знаков после запятой
  // Используется при клике на графике
  const numberToStringWithPrecision = (num) => {
    if (typeof num !== 'number' || !isFinite(num)) {
      return num.toString();
    }
    // Ограничиваем точность до 5 знаков после запятой
    const str = num.toFixed(5);
    // Убираем завершающие нули после точки
    return str.replace(/\.?0+$/, '') || '0';
  };

  useEffect(() => {
    if (userId) {
      dispatch(fetchResults(userId));
    }
  }, [dispatch, userId]);

  // Валидация Y при изменении значения
  useEffect(() => {
    if (y !== '') {
      validateY(y);
    } else {
      setYError('');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [y]);

  // Показываем уведомление при ошибке от сервера
  useEffect(() => {
    if (error) {
      const errorMessage = typeof error === 'string' ? error : (error.message || 'Ошибка при проверке точки');
      showNotification(errorMessage, 'error');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error]);

  const validateY = (value) => {
    // Если поле пустое, убираем ошибку
    if (!value || value.trim() === '') {
      setYError('');
      return false;
    }
    
    // Убираем пробелы для проверки
    const trimmedValue = value.trim();
    
    // Сначала проверяем, что строка не содержит букв и других недопустимых символов
    // Разрешаем только: цифры, точка, запятая, минус (только в начале)
    const hasInvalidChars = /[^0-9.,\-]/.test(trimmedValue);
    if (hasInvalidChars) {
      setYError('Y должен быть числом');
      return false;
    }
    
    // Заменяем запятую на точку для проверки формата
    const normalizedValue = trimmedValue.replace(',', '.');
    
    // Проверяем, что не более одного разделителя (точки или запятой)
    const separatorCount = (trimmedValue.match(/[.,]/g) || []).length;
    if (separatorCount > 1) {
      setYError('Y должен быть числом');
      return false;
    }
    
    // Проверяем формат: должно быть валидное число
    // Разрешаем: опциональный минус, цифры, опциональная точка/запятая, цифры
    // Также разрешаем: .5, -.5, ,5, -,5 (точка или запятая в начале)
    const numberPattern = /^-?(\d+[.,]?\d*|[.,]\d+)$/;
    
    if (!numberPattern.test(trimmedValue)) {
      setYError('Y должен быть числом');
      return false;
    }
    
    // Проверяем, что parseFloat возвращает валидное число (используем нормализованное значение)
    const num = parseFloat(normalizedValue);
    if (isNaN(num) || !isFinite(num)) {
      setYError('Y должен быть числом');
      return false;
    }
    
    // Проверяем диапазон
    if (num < -5 || num > 5) {
      setYError('Y должен быть в диапазоне от -5 до 5');
      return false;
    }
    
    setYError('');
    return true;
  };

  const handleYChange = (value) => {
    setY(value);
    // Валидация будет выполнена автоматически через useEffect
  };

  const showNotification = (message, type = 'error') => {
    setNotification({ message, type });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (x === null || x === '') {
      showNotification('Выберите значение X из списка или кликните на графике', 'error');
      return;
    }
    
    const xNum = parseFloat(x);
    if (isNaN(xNum) || xNum < -3 || xNum > 5) {
      showNotification('X должен быть в диапазоне от -3 до 5', 'error');
      return;
    }
    
    if (!y || y.trim() === '') {
      showNotification('Введите значение Y', 'error');
      return;
    }
    
    if (!validateY(y)) {
      return;
    }
    
    if (r === null || parseFloat(r) <= 0) {
      showNotification('Выберите положительное значение R', 'error');
      return;
    }
    
    const rNum = parseFloat(r);
    
    // Отправляем числа как строки для правильного преобразования в BigDecimal на бэкенде
    // Y отправляем как исходную строку без parseFloat, чтобы сохранить точность для BigDecimal
    // Заменяем запятую на точку для корректной обработки на сервере
    const yNormalized = y.trim().replace(',', '.');
    dispatch(checkPoint(
      xNum.toString(),
      yNormalized, // Отправляем нормализованную строку Y (запятая заменена на точку)
      rNum.toString(),
      userId
    ));
  };

  const handleCanvasClick = (canvasX, canvasY, canvasWidth, canvasHeight) => {
    if (r === null || parseFloat(r) <= 0) {
      showNotification('Сначала выберите значение R', 'error');
      return;
    }
    
    const rValue = parseFloat(r);
    const padding = 40;
    const centerX = canvasWidth / 2;
    const centerY = canvasHeight / 2;
    const graphWidth = canvasWidth - 2 * padding;
    const step = graphWidth / (rValue * 2);
    
    // Преобразуем координаты клика в координаты графика
    const xValue = (canvasX - centerX) / step;
    const yValue = (centerY - canvasY) / step;
    
    // Преобразуем в строки с точностью до 5 знаков после запятой
    const xStr = numberToStringWithPrecision(xValue);
    const yStr = numberToStringWithPrecision(yValue);
    
    // Устанавливаем значение X как строку
    setX(xStr);
    
    // Устанавливаем значение Y как строку для точного преобразования в BigDecimal
    setY(yStr);
    
    // Очищаем ошибку валидации Y, так как значение введено через график
    setYError('');
    
    // Автоматически отправляем на проверку
    // Валидация будет выполнена на сервере, ошибки покажутся через уведомления
    setTimeout(() => {
      if (rValue > 0) {
        dispatch(checkPoint(
          xStr,
          yStr,
          rValue.toString(),
          userId
        ));
      }
    }, 100);
  };

  const handleClearResults = () => {
    setConfirmDialog({
      message: 'Вы уверены, что хотите очистить все результаты?',
      onConfirm: () => {
        dispatch(clearResults(userId));
        setConfirmDialog(null);
      },
      onCancel: () => {
        setConfirmDialog(null);
      }
    });
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <div className="container">
      <div className="main-container">
        <div className="header">
          <div className="header-top">
            <Button
              onClick={handleLogout}
              style={{ 
                backgroundColor: '#dc3545',
                padding: '8px 16px',
                fontSize: '14px'
              }}
            >
              Выйти из системы
            </Button>
          </div>
          <h1>Павлов Эдгар P3216 88744</h1>
          <p>Пользователь: {username}</p>
        </div>

        <div className="form-section">
          <h3>Проверка попадания точки в область</h3>
          
          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div>
                <div className="input-group">
                  <label>Выберите значение X:</label>
                  <div className="checkbox-group">
                    {xValues.map(val => (
                      <Checkbox
                        key={val}
                        checked={x === val}
                        onChange={(checked) => {
                          if (checked) {
                            setX(val);
                          } else {
                            setX(null);
                          }
                        }}
                        label={val}
                      />
                    ))}
                  </div>
                  {x !== null && <p style={{ marginTop: '5px', fontSize: '12px', color: '#666' }}>Выбрано: {x}</p>}
                  <p style={{ marginTop: '5px', fontSize: '12px', color: '#666' }}>Или кликните на графике для выбора X</p>
                </div>

                <div className="input-group">
                  <label>Введите значение Y (-5 ... 5):</label>
                  <TextInput
                    value={y}
                    onUpdate={handleYChange}
                    placeholder="Введите Y"
                    style={{ width: '100%' }}
                  />
                  {yError && <div className="error-message">{yError}</div>}
                </div>

                <div className="input-group">
                  <label>Выберите значение R:</label>
                  <div className="checkbox-group">
                    {rValues.map(val => (
                      <Checkbox
                        key={val}
                        checked={r === val}
                        onChange={(checked) => {
                          if (checked) {
                            setR(val);
                          } else {
                            setR(null);
                          }
                        }}
                        label={val}
                      />
                    ))}
                  </div>
                  {r !== null && <p>Выбрано: {r}</p>}
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  style={{ width: '100%', marginTop: '10px' }}
                >
                  {loading ? 'Проверка...' : 'Отправить'}
                </Button>

                {error && (
                  <div className="error-message" style={{ marginTop: '10px' }}>
                    {typeof error === 'string' ? error : 'Ошибка при проверке точки'}
                  </div>
                )}
              </div>

              <div className="canvas-container">
                <h3>График области</h3>
                <Canvas
                  r={r ? parseFloat(r) : 1}
                  points={results}
                  onCanvasClick={handleCanvasClick}
                />
                <p style={{ marginTop: '10px', fontSize: '14px', color: '#666' }}>
                  Кликните на графике для выбора точки
                </p>
              </div>
            </div>
          </form>
        </div>

        <div className="form-section">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
            <h3 style={{ margin: 0 }}>Результаты проверок</h3>
            {results.length > 0 && (
              <Button
                onClick={handleClearResults}
                style={{ backgroundColor: '#dc3545' }}
              >
                Очистить результаты
              </Button>
            )}
          </div>
          {results.length === 0 ? (
            <p>Нет результатов</p>
          ) : (
            <>
              <table className="results-table">
                <thead>
                  <tr>
                    <th>X</th>
                    <th>Y</th>
                    <th>R</th>
                    <th>Результат</th>
                    <th>Время</th>
                    <th>Время выполнения (мкс)</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map(result => (
                    <tr key={result.id}>
                      <td>{result.x}</td>
                      <td>{result.y}</td>
                      <td>{result.r}</td>
                      <td>
                        <span className={result.hit ? 'hit' : 'miss'}>
                          {result.hit ? 'Попадание' : 'Непопадание'}
                        </span>
                      </td>
                      <td>{new Date(result.timestamp).toLocaleString('ru-RU')}</td>
                      <td>{result.executionTime}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
        </div>
      </div>
      
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
      
      {confirmDialog && (
        <ConfirmDialog
          message={confirmDialog.message}
          onConfirm={confirmDialog.onConfirm}
          onCancel={confirmDialog.onCancel}
        />
      )}
    </div>
  );
};

export default MainPage;

