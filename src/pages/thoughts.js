import React, { useState } from 'react';
import Layout from '@theme/Layout';
import clsx from 'clsx';
import styles from '../css/books.module.css';

// 1. 只导入 MDX 文章列表 (移除 booksData)
import { thoughtsList } from '../data/thoughtsList';

export default function Thoughts() {
    // 2. 状态简化：不再需要 activeTab，只需要记录当前选中的文章
    // 默认选中列表的第一项
    const [selectedItem, setSelectedItem] = useState(thoughtsList[0]);

    return (
        <Layout title="Shengbo Talk" description="杂谈与随笔">
            <div className={styles.pageWrapper}>

                {/* --- 左侧边栏 --- */}
                <aside className={styles.sidebar}>
                    {/* 移除 Tab 切换按钮区域 (sidebarTabs) */}

                    <div className={styles.itemListContainer}>
                        <div className={styles.scrollList}>
                            <div className={styles.categoryGroup}>
                                {/* 标题可以改为更简单的“文章列表”或保持英文 */}
                                <div className={styles.categoryTitle}>THOUGHTS LIST</div>

                                {thoughtsList.map((thought, index) => (
                                    <div
                                        key={index}
                                        className={clsx(
                                            styles.listItem,
                                            selectedItem?.title === thought.title && styles.itemSelected
                                        )}
                                        onClick={() => setSelectedItem(thought)}
                                    >
                                        <div className={styles.thoughtIcon}>📝</div>
                                        <div className={styles.listInfo}>
                                            <div className={styles.listTitle}>{thought.title}</div>
                                            <div className={styles.listSub}>{thought.date}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </aside>

                {/* --- 右侧内容区 --- */}
                <main className={styles.contentArea}>
                    {selectedItem ? (
                        <div className={styles.noteContainer}>
                            {/* 3. 移除三元判断，直接渲染随笔详情结构 */}

                            <div className={styles.thoughtHeader}>
                                <div className={styles.thoughtMetaTop}>
                                    <span className={styles.categoryBadge}>{selectedItem.category}</span>
                                    <span className={styles.metaText}>{selectedItem.date}</span>
                                </div>
                                <h1 className={styles.thoughtTitle}>{selectedItem.title}</h1>
                                <div className={styles.tags}>
                                    {selectedItem.tags?.map(tag => (
                                        <span key={tag} className={styles.tag}>#{tag}</span>
                                    ))}
                                </div>
                            </div>

                            <div className={styles.divider}></div>

                            {/* MDX 内容渲染区 */}
                            <div className={styles.articleContent}>
                                {selectedItem.Component && <selectedItem.Component />}
                            </div>

                            <div className={styles.footerNote}>— END —</div>
                        </div>
                    ) : (
                        <div className={styles.emptyState}>Select an item to read</div>
                    )}
                </main>
            </div>
        </Layout>
    );
}
