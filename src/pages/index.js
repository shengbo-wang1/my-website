import React, { useState, useEffect } from 'react';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';

// ------------------------------------------------------------------
// 1. 打字机组件
// ------------------------------------------------------------------
const Typewriter = ({ texts }) => {
    const [index, setIndex] = useState(0);
    const [subIndex, setSubIndex] = useState(0);
    const [reverse, setReverse] = useState(false);

    useEffect(() => {
        if (index === texts.length) return;
        if (subIndex === texts[index].length + 1 && !reverse) {
            setTimeout(() => setReverse(true), 3000);
            return;
        }
        if (subIndex === 0 && reverse) {
            setReverse(false);
            setIndex((prev) => (prev + 1) % texts.length);
            return;
        }
        const timeout = setTimeout(() => {
            setSubIndex((prev) => prev + (reverse ? -1 : 1));
        }, reverse ? 50 : 80);
        return () => clearTimeout(timeout);
    }, [subIndex, index, reverse, texts]);

    return (
        <span>
      {texts[index].substring(0, subIndex)}
            <span style={{ borderRight: '3px solid', animation: 'blink 1s step-end infinite' }}>&nbsp;</span>
    </span>
    );
};

// ------------------------------------------------------------------
// 2. 终端组件
// ------------------------------------------------------------------
const Terminal = () => (
    <div className="terminal-window">
        <div className="terminal-header">
            <div style={{display:'flex', gap:'8px'}}>
                <div className="control" style={{background:'#ff5f56', width:'12px', height:'12px', borderRadius:'50%'}}></div>
                <div className="control" style={{background:'#ffbd2e', width:'12px', height:'12px', borderRadius:'50%'}}></div>
                <div className="control" style={{background:'#27c93f', width:'12px', height:'12px', borderRadius:'50%'}}></div>
            </div>
            <div style={{flex:1, textAlign:'center', opacity:0.5, fontSize:'13px', fontFamily:'sans-serif'}}>zsh — 80x24</div>
        </div>

        <div className="terminal-body">
            <div style={{opacity: 0.5, marginBottom: '15px'}}>Last login: {new Date().toDateString()} on ttys001</div>

            <p>
                <span style={{color: '#27c93f'}}>➜</span> <span style={{color: '#569cd6'}}>~</span> <span style={{color: '#dcdcaa'}}>whoami</span><br/>
                <span style={{color: '#e0e0e0', fontWeight:'bold', fontSize:'1.2rem'}}>王老六 (Wang Laoliu)</span><br/>
                <span style={{opacity: 0.8}}>Full Stack Developer / Open Source Enthusiast</span>
            </p>

            <p>
                <span style={{color: '#27c93f'}}>➜</span> <span style={{color: '#569cd6'}}>~</span> <span style={{color: '#dcdcaa'}}>cat</span> skills.json<br/>
                <span style={{color: '#d4d4d4'}}>{`{`}</span><br/>
                &nbsp;&nbsp;<span style={{color: '#9cdcfe'}}>"languages"</span>: [<span style={{color: '#ce9178'}}>"Java"</span>, <span style={{color: '#ce9178'}}>"JS/TS"</span>, <span style={{color: '#ce9178'}}>"Python"</span>],<br/>
                &nbsp;&nbsp;<span style={{color: '#9cdcfe'}}>"frameworks"</span>: [<span style={{color: '#ce9178'}}>"Spring"</span>, <span style={{color: '#ce9178'}}>"React"</span>, <span style={{color: '#ce9178'}}>"Docusaurus"</span>],<br/>
                &nbsp;&nbsp;<span style={{color: '#9cdcfe'}}>"status"</span>: <span style={{color: '#ce9178'}}>"Coding..."</span><br/>
                <span style={{color: '#d4d4d4'}}>{`}`}</span>
            </p>

            <br/>
            <div style={{borderBottom:'1px dashed #444', marginBottom:'15px', paddingBottom:'5px', opacity:0.7}}>System Resources</div>

            <p style={{display:'flex', gap:'20px'}}>
                <span>🧠 CPU: <span style={{color:'#27c93f'}}>15%</span></span>
                <span>💾 RAM: <span style={{color:'#27c93f'}}>32GB</span></span>
                <span>☕ Coffee: <span style={{color:'#ffbd2e'}}>Needed</span></span>
            </p>

            <p>
                <span style={{color: '#27c93f'}}>➜</span> <span style={{color: '#569cd6'}}>~</span> <span style={{animation: 'blink 1s step-end infinite'}}>_</span>
            </p>
        </div>
    </div>
);

// ------------------------------------------------------------------
// 主页面
// ------------------------------------------------------------------
export default function Home() {
    const {siteConfig} = useDocusaurusContext();

    return (
        <Layout title="Home" description="王老六的个人博客">

            <div className="hero-dashboard-container">

                {/* 上半部分 */}
                <div className="dashboard-upper">
                    <div className="intro-section">
                        <Heading as="h1" className="hero-title-gradient" style={{fontSize: '3.5rem', fontWeight: 900, lineHeight: 1.1, marginBottom: '15px'}}>
                            {siteConfig.title}
                        </Heading>
                        <div style={{fontSize: '1.4rem', fontFamily: 'monospace', opacity: 0.8, height: '50px'}}>
                            <span style={{color: 'var(--ifm-color-primary)'}}>&gt; </span>
                            <Typewriter texts={['Hello, World.', 'Talk is cheap.', 'Show me the code.']} />
                        </div>
                        <p style={{fontSize: '1.1rem', opacity: 0.6, marginTop: '15px', maxWidth: '420px', lineHeight:'1.6'}}>
                            这是我的数字后花园。<br/>
                            记录代码与生活的点滴。<br/>
                            保持好奇，保持热爱。
                        </p>
                    </div>

                    <div className="terminal-section">
                        <Terminal />
                    </div>
                </div>

                {/* 下半部分：磁贴 */}
                <div className="dashboard-lower">
                    <div className="access-grid">

                        <Link to="/docs/intro" className="access-tile">
                            <div className="tile-icon">💻</div>
                            <div className="tile-content">
                                <div className="tile-title">技术笔记</div>
                                <div className="tile-desc">Technical & Code</div>
                            </div>
                        </Link>

                        <Link to="/life" className="access-tile">
                            <div className="tile-icon">📸</div>
                            <div className="tile-content">
                                <div className="tile-title">记录生活</div>
                                <div className="tile-desc">Life & Moments</div>
                            </div>
                        </Link>

                        <Link to="/thoughts" className="access-tile">
                            <div className="tile-icon">📚</div>
                            <div className="tile-content">
                                <div className="tile-title">闲书杂谈</div>
                                <div className="tile-desc">Reading List</div>
                            </div>
                        </Link>

                    </div>
                </div>

            </div>
        </Layout>
    );
}
