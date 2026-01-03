import React, { useState, useEffect, useRef } from 'react';
import Layout from '@theme/Layout';
import useBaseUrl from '@docusaurus/useBaseUrl';
import clsx from 'clsx';
import styles from '../css/life.module.css';
import lifeData from '../data/lifeData.json';

// 工具函数
const isVideo = (src) => /\.(mp4|webm|mov)$/i.test(src);

// --- FadeInSection ---
const FadeInSection = ({ children }) => {
    const [isVisible, setIsVisible] = useState(false);
    const domRef = useRef();
    useEffect(() => {
        const observer = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting) setIsVisible(true);
        }, { threshold: 0.1 });
        const current = domRef.current;
        if (current) observer.observe(current);
        return () => { if (current) observer.unobserve(current); };
    }, []);
    return (
        <div ref={domRef} className={clsx(styles.scrollHidden, isVisible && styles.scrollVisible)}>
            {children}
        </div>
    );
};

// --- PhotoCard ---
const PhotoCard = ({ item, onClick }) => {
    const finalSrc = item.src.startsWith('http') ? item.src : useBaseUrl(item.src);
    const isVid = isVideo(finalSrc);
    return (
        <div className={styles.photoItem} onClick={() => onClick({ ...item, src: finalSrc })}>
            {isVid ? (
                <video src={finalSrc} muted loop autoPlay playsInline className={styles.photoImg} style={{ objectFit: 'cover' }} />
            ) : (
                <img src={finalSrc} alt={item.title} className={styles.photoImg} loading="lazy" />
            )}
            <div className={styles.overlay}>
                <h3 className={styles.photoTitle}>{item.title}</h3>
                <p className={styles.photoDesc}>{item.desc}</p>
                {isVid && <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontSize: '3rem', opacity: 0.8 }}>▶</div>}
            </div>
        </div>
    );
};

export default function Life() {
    const [selectedPhoto, setSelectedPhoto] = useState(null);
    const wrapperRef = useRef(null);

    // 🔥 核心修改：使用 setAttribute 这里的权重比 class 更稳
    useEffect(() => {
        console.log("🚀 Life Page Mode Activated");
        // 给 html 根标签打上标记
        document.documentElement.setAttribute('data-life-mode', 'true');

        return () => {
            console.log("👋 Life Page Mode Deactivated");
            document.documentElement.removeAttribute('data-life-mode');
        };
    }, []);

    // 封面图
    let heroBgUrl;
    try {
        heroBgUrl = require('@site/static/img/life/wedding-cover.jpg').default;
    } catch (e) {
        heroBgUrl = "https://images.unsplash.com/photo-1519741497674-611481863552?ixlib=rb-1.2.1&auto=format&fit=crop&w=1600&q=80";
    }

    // 滚动视差
    useEffect(() => {
        let ticking = false;
        const updateParallax = () => {
            if (!wrapperRef.current) return;
            const scrollY = window.scrollY;
            const windowHeight = window.innerHeight;
            const threshold = windowHeight * 0.6;
            let progress = scrollY / threshold;
            if (progress > 1) progress = 1;
            if (progress < 0) progress = 0;
            const targetOpacity = 1 - progress;
            wrapperRef.current.style.setProperty('--hero-opacity', targetOpacity);
            ticking = false;
        };
        const handleScroll = () => {
            if (!ticking) { window.requestAnimationFrame(updateParallax); ticking = true; }
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        updateParallax();
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <Layout title="Life" description="王老六的生活切片">
            <div className={styles.lifeWrapper} ref={wrapperRef}>
                <div className={styles.heroBackground} style={{ backgroundImage: `url(${heroBgUrl})` }}></div>
                <section className={styles.heroSection}>
                    <div className={styles.heroOverlay}></div>
                    <div className={styles.heroContent}>
                        <h1 className={styles.heroTitle}>LIFE LOG</h1>
                        <p className={styles.heroSubtitle}>LOVE & SUNSHINE</p>
                    </div>
                    <div className={styles.scrollMouse}><div className={styles.scrollWheel}></div></div>
                </section>
                <div className={styles.lifeContainer}>
                    {lifeData.map((eventItem, index) => (
                        <div key={index} className={styles.eventGroup}>
                            <div className={styles.dateColumn}>
                                <div className={styles.stickyDate}>
                                    <div className={styles.dateYear}>{eventItem.date}</div>
                                    <div className={styles.dateEvent}>{eventItem.event}</div>
                                    <div className={styles.dateDesc}>{eventItem.description}</div>
                                </div>
                                <div className={styles.timelineNode}></div>
                            </div>
                            <div className={styles.blocksWrapper}>
                                {eventItem.blocks.map((block, blockIndex) => {
                                    const layoutClass = styles[`layout-${block.layout}`];
                                    return (
                                        <FadeInSection key={blockIndex}>
                                            <div className={clsx(styles.photoRow, styles.photosContainer, layoutClass)}>
                                                {block.items.map((item, itemIndex) => (
                                                    <PhotoCard key={itemIndex} item={item} onClick={(clickedItem) => setSelectedPhoto(clickedItem)} />
                                                ))}
                                            </div>
                                        </FadeInSection>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
                {selectedPhoto && (
                    <div className={styles.lightbox} onClick={() => setSelectedPhoto(null)}>
                        {isVideo(selectedPhoto.src) ? (
                            <video src={selectedPhoto.src} controls autoPlay className={styles.lightboxImg} onClick={(e) => e.stopPropagation()} />
                        ) : (
                            <img src={selectedPhoto.src} alt={selectedPhoto.title} className={styles.lightboxImg} onClick={(e) => e.stopPropagation()} />
                        )}
                    </div>
                )}
            </div>
        </Layout>
    );
}
