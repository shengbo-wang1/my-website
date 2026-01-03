import React, { useEffect, useRef, useState } from 'react';
// import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment'; // 移除 Docusaurus 特定依赖，改用通用写法

// 样式配置 (可以直接放在组件里，也可以单独抽离成 css 文件)
const styles = `
  .snake-game-container {
    --bg-color: #1a1a1a;
    --board-bg: #000000;
    --accent-color: #00ff88;
    --food-color: #ff3333;
    background-color: var(--bg-color);
    color: #ffffff;
    font-family: 'Segoe UI', Tahoma, sans-serif;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 20px;
    border-radius: 10px;
    margin: 20px 0;
    user-select: none;
  }

  .snake-game-wrapper {
    position: relative;
    padding: 10px;
    background: #2a2a2a;
    border-radius: 10px;
    box-shadow: 0 10px 20px rgba(0,0,0,0.5);
  }

  .snake-canvas {
    background-color: var(--board-bg);
    display: block;
    border: 2px solid #333;
    box-shadow: inset 0 0 20px rgba(0, 255, 136, 0.1);
    max-width: 100%;
    height: auto;
  }

  .score-board {
    display: flex;
    justify-content: space-between;
    width: 100%;
    margin-bottom: 10px;
    font-size: 1.2rem;
    font-weight: bold;
    color: white;
  }

  .game-over-screen {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.85);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border-radius: 10px;
    z-index: 10;
  }

  .game-btn {
    background: var(--accent-color);
    color: #000;
    border: none;
    padding: 10px 25px;
    font-size: 1.1rem;
    border-radius: 25px;
    cursor: pointer;
    font-weight: bold;
    margin-top: 10px;
    transition: transform 0.1s;
  }
  .game-btn:hover { transform: scale(1.05); }
  .game-btn:active { transform: scale(0.95); }

  .mobile-controls {
    display: none;
    margin-top: 20px;
    grid-template-columns: repeat(3, 60px);
    grid-template-rows: repeat(2, 60px);
    gap: 10px;
  }

  .ctrl-btn {
    background: #333;
    color: white;
    border-radius: 50%;
    border: 2px solid #555;
    font-size: 1.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    touch-action: manipulation;
  }
  
  .ctrl-btn:active { background: var(--accent-color); color: black; }

  @media (max-width: 600px) {
    .mobile-controls { display: grid; }
    .snake-canvas { width: 300px; height: 300px; }
  }
`;

const SnakeGame = () => {
    const canvasRef = useRef(null);
    // 使用 Ref 存储游戏核心状态，避免频繁触发 React 重渲染导致卡顿
    const gameState = useRef({
        snake: [],
        food: { x: 15, y: 15 },
        velocityX: 0,
        velocityY: 0,
        lastInputDirection: { x: 0, y: 0 },
        gameInterval: null,
        isRunning: false,
        gridSize: 20,
        tileCount: 20
    });

    const [score, setScore] = useState(0);
    const [highScore, setHighScore] = useState(0);
    const [isGameOver, setIsGameOver] = useState(false);

    // 初始化/重置游戏
    const startGame = () => {
        const state = gameState.current;
        state.snake = [{ x: 10, y: 10 }, { x: 10, y: 11 }, { x: 10, y: 12 }];
        state.velocityX = 0;
        state.velocityY = -1;
        state.lastInputDirection = { x: 0, y: -1 };
        state.isRunning = true;

        setScore(0);
        setIsGameOver(false);
        placeFood();

        if (state.gameInterval) clearInterval(state.gameInterval);
        state.gameInterval = setInterval(gameLoop, 100);
    };

    const placeFood = () => {
        const state = gameState.current;
        state.food = {
            x: Math.floor(Math.random() * state.tileCount),
            y: Math.floor(Math.random() * state.tileCount)
        };
        // 简单的防重叠检查
        for (let part of state.snake) {
            if (part.x === state.food.x && part.y === state.food.y) {
                placeFood();
                return;
            }
        }
    };

    const gameLoop = () => {
        const state = gameState.current;
        if (!state.isRunning) return;

        // 移动逻辑
        const head = {
            x: state.snake[0].x + state.velocityX,
            y: state.snake[0].y + state.velocityY
        };

        // 碰撞检测
        if (head.x < 0 || head.x >= state.tileCount || head.y < 0 || head.y >= state.tileCount ||
            state.snake.some(part => part.x === head.x && part.y === head.y)) {
            handleGameOver();
            return;
        }

        state.snake.unshift(head);

        // 吃食物
        if (head.x === state.food.x && head.y === state.food.y) {
            setScore(s => s + 10);
            placeFood();
        } else {
            state.snake.pop();
        }

        state.lastInputDirection = { x: state.velocityX, y: state.velocityY };
        draw();
    };

    const handleGameOver = () => {
        const state = gameState.current;
        state.isRunning = false;
        clearInterval(state.gameInterval);
        setIsGameOver(true);

        // 更新最高分
        setHighScore(prev => {
            const newHigh = Math.max(prev, score); // 注意：这里 score 可能是闭包旧值，但在 React setter 里可以拿到最新的
            if (typeof window !== 'undefined') {
                localStorage.setItem('snakeHighScore', newHigh);
            }
            return newHigh;
        });
    };

    const draw = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const state = gameState.current;

        // 清空
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // 画食物
        ctx.fillStyle = '#ff3333';
        ctx.beginPath();
        ctx.arc(
            state.food.x * state.gridSize + state.gridSize/2,
            state.food.y * state.gridSize + state.gridSize/2,
            state.gridSize/2 - 2, 0, 2 * Math.PI
        );
        ctx.fill();

        // 画蛇
        state.snake.forEach((part, i) => {
            ctx.fillStyle = (i === 0) ? '#00cc6a' : '#00ff88';
            ctx.fillRect(
                part.x * state.gridSize + 1,
                part.y * state.gridSize + 1,
                state.gridSize - 2,
                state.gridSize - 2
            );
        });
    };

    const handleInput = (key) => {
        const state = gameState.current;
        if (!state.isRunning) return;

        const goingUp = state.lastInputDirection.y === -1;
        const goingDown = state.lastInputDirection.y === 1;
        const goingRight = state.lastInputDirection.x === 1;
        const goingLeft = state.lastInputDirection.x === -1;

        if (key === 'ArrowLeft' && !goingRight) { state.velocityX = -1; state.velocityY = 0; }
        if (key === 'ArrowUp' && !goingDown) { state.velocityX = 0; state.velocityY = -1; }
        if (key === 'ArrowRight' && !goingLeft) { state.velocityX = 1; state.velocityY = 0; }
        if (key === 'ArrowDown' && !goingUp) { state.velocityX = 0; state.velocityY = 1; }
    };

    // 监听键盘事件
    useEffect(() => {
        if (typeof window === 'undefined') return;

        const storedHigh = localStorage.getItem('snakeHighScore');
        if (storedHigh) setHighScore(parseInt(storedHigh));

        const keyListener = (e) => {
            if(['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
                e.preventDefault(); // 防止页面滚动
                handleInput(e.key);
            }
        };

        window.addEventListener('keydown', keyListener);
        startGame();

        return () => {
            window.removeEventListener('keydown', keyListener);
            clearInterval(gameState.current.gameInterval);
        };
    }, []);

    // 监听分数变化以更新最高分逻辑（如果需要在游戏进行中实时更新可以放这里，目前只在结束时更新）
    useEffect(() => {
        if (isGameOver && score > highScore) {
            setHighScore(score);
            if (typeof window !== 'undefined') {
                localStorage.setItem('snakeHighScore', score);
            }
        }
    }, [isGameOver, score]);


    return (
        <div className="snake-game-container">
            <style>{styles}</style>
            <h1>贪吃蛇</h1>

            <div className="snake-game-wrapper">
                <div className="score-board">
                    <span>分数: {score}</span>
                    <span>最高分: {highScore}</span>
                </div>

                <canvas
                    ref={canvasRef}
                    width={400}
                    height={400}
                    className="snake-canvas"
                />

                {isGameOver && (
                    <div className="game-over-screen">
                        <h2 style={{color: '#ff3333', fontSize: '2rem', margin: '0 0 10px 0'}}>游戏结束</h2>
                        <p style={{fontSize: '1.2rem', color: 'white'}}>最终得分: {score}</p>
                        <button className="game-btn" onClick={startGame}>再玩一次</button>
                    </div>
                )}
            </div>

            <div className="mobile-controls">
                <div style={{gridColumn: 2, gridRow: 1}} className="ctrl-btn" onTouchStart={(e)=>{e.preventDefault(); handleInput('ArrowUp')}}>▲</div>
                <div style={{gridColumn: 1, gridRow: 2}} className="ctrl-btn" onTouchStart={(e)=>{e.preventDefault(); handleInput('ArrowLeft')}}>◀</div>
                <div style={{gridColumn: 2, gridRow: 2}} className="ctrl-btn" onTouchStart={(e)=>{e.preventDefault(); handleInput('ArrowDown')}}>▼</div>
                <div style={{gridColumn: 3, gridRow: 2}} className="ctrl-btn" onTouchStart={(e)=>{e.preventDefault(); handleInput('ArrowRight')}}>▶</div>
            </div>
        </div>
    );
};

export default SnakeGame;
