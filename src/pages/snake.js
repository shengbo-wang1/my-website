import React from 'react';
import Layout from '@theme/Layout';
import SnakeGame from '../components/SnakeGame';

export default function SnakePage() {
    return (
        <Layout title="贪吃蛇" description="经典贪吃蛇游戏">
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: '80vh',
                }}>
                <SnakeGame />
            </div>
        </Layout>
    );
}
