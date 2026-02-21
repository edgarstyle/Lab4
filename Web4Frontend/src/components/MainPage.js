import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { checkPoint, fetchResults, clearResults } from '../store/actions/resultActions';
import { logout } from '../store/actions/authActions';
import Canvas from './Canvas';
import { TextInput, Button } from './BelleComponents';
import { showNotification } from './Notification';
import ConfirmDialog from './ConfirmDialog';

const MainPage = () => {
  const dispatch = useDispatch();
  const { userId, username } = useSelector(state => state.auth);
  const { results } = useSelector(state => state.results);

  const [x, setX] = useState(null);
  const [y, setY] = useState('');
  const [r, setR] = useState(null);
  const [yError, setYError] = useState('');
  const [showClearDialog, setShowClearDialog] = useState(false);

  useEffect(() => {
    if (userId) {
      dispatch(fetchResults(userId));
    }
  }, [userId, dispatch]);

  useEffect(() => {
    if (y.trim() !== '') {
      validateY(y);
    }
  }, [y]);

  const numberToStringWithPrecision = (num) => {
    const str = num.toFixed(5);
    return str.replace(/\.?0+$/, '');
  };

  const validateY = (value) => {
    if (!value || value.trim() === '') {
      setYError('');
      return false;
    }
    const trimmedValue = value.trim();
    const hasInvalidChars = /[^0-9.,\-]/.test(trimmedValue);
    if (hasInvalidChars) {
      setYError('Y должен быть числом');
      return false;
    }
    const normalizedValue = trimmedValue.replace(',', '.');
    const separatorCount = (trimmedValue.match(/[.,]/g) || []).length;
    if (separatorCount > 1) {
      setYError('Y должен быть числом');
      return false;
    }
    const numberPattern = /^-?(\d+[.,]?\d*|[.,]\d+)$/;
    if (!numberPattern.test(trimmedValue)) {
      setYError('Y должен быть числом');
      return false;
    }
    const num = parseFloat(normalizedValue);
    if (isNaN(num) || !isFinite(num)) {
      setYError('Y должен быть числом');
      return false;
    }
    if (num < -5 || num > 5) {
      setYError('Y должен быть в диапазоне от -5 до 5');
      return false;
    }
    setYError('');
    return true;
  };

  const handleYChange = (e) => {
    setY(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (x === null) {
      showNotification('Выберите значение X', 'error');
      return;
    }
    
    if (!y.trim()) {
      showNotification('Введите значение Y', 'error');
      return;
    }
    
    if (!validateY(y)) {
      showNotification('Y должен быть числом от -5 до 5', 'error');
      return;
    }
    
    if (r === null || parseFloat(r) <= 0) {
      showNotification('Выберите положительное значение R', 'error');
      return;
    }

    try {
      const xNum = parseFloat(x);
      const rNum = parseFloat(r);
      await dispatch(checkPoint(
        xNum.toString(),
        y.trim(),
        rNum.toString(),
        userId
      ));
    } catch (error) {
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.entity || 
                          error.response?.data?.error || 
                          'Ошибка проверки точки';
      showNotification(errorMessage, 'error');
    }
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

    const xValue = (canvasX - centerX) / step;
    const yValue = (centerY - canvasY) / step;

    const xStr = numberToStringWithPrecision(xValue);
    const yStr = numberToStringWithPrecision(yValue);

    setX(xStr);
    setY(yStr);
    setYError('');

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

  const handleClearResults = async () => {
    try {
      await dispatch(clearResults(userId));
      showNotification('Результаты очищены', 'success');
      setShowClearDialog(false);
    } catch (error) {
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.entity || 
                          error.response?.data?.error || 
                          'Ошибка очистки результатов';
      showNotification(errorMessage, 'error');
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    showNotification('Выход выполнен', 'success');
  };

  const xValues = [-5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5];
  const rValues = [1, 2, 3, 4, 5];

  return (
    <div className="main-page">
      <div className="header">
        <Button onClick={handleLogout} className="logout-button">
          Выйти
        </Button>
        <h1>Павлов Эдгар P3216 88744</h1>
      </div>
      
      <div className="content">
        <div className="form-section">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>X:</label>
              <div className="checkbox-group">
                {xValues.map(val => (
                  <label key={val} className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={x === val.toString()}
                      onChange={() => setX(x === val.toString() ? null : val.toString())}
                    />
                    {val}
                  </label>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label>Y:</label>
              <TextInput
                value={y}
                onChange={handleYChange}
                placeholder="От -5 до 5"
              />
              {yError && <div className="error-message">{yError}</div>}
            </div>

            <div className="form-group">
              <label>R:</label>
              <div className="checkbox-group">
                {rValues.map(val => (
                  <label key={val} className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={r === val.toString()}
                      onChange={() => setR(r === val.toString() ? null : val.toString())}
                    />
                    {val}
                  </label>
                ))}
              </div>
            </div>

            <Button type="submit" primary>Проверить</Button>
          </form>
        </div>

        <div className="canvas-section">
          <Canvas
            r={r ? parseFloat(r) : null}
            results={results}
            onCanvasClick={handleCanvasClick}
          />
        </div>
      </div>

      <div className="results-section">
        <Button
          onClick={() => setShowClearDialog(true)}
          className="clear-button"
        >
          Очистить результаты
        </Button>
        
        <table className="results-table">
          <thead>
            <tr>
              <th>X</th>
              <th>Y</th>
              <th>R</th>
              <th>Попадание</th>
              <th>Время выполнения (мкс)</th>
              <th>Время запроса</th>
            </tr>
          </thead>
          <tbody>
            {results.map(result => (
              <tr key={result.id}>
                <td>{result.x}</td>
                <td>{result.y}</td>
                <td>{result.r}</td>
                <td>{result.hit ? 'Да' : 'Нет'}</td>
                <td>{result.executionTime}</td>
                <td>{new Date(result.timestamp).toLocaleString('ru-RU')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ConfirmDialog
        show={showClearDialog}
        title="Очистить результаты"
        message="Вы уверены, что хотите очистить все результаты?"
        onConfirm={handleClearResults}
        onCancel={() => setShowClearDialog(false)}
      />
    </div>
  );
};

export default MainPage;

