// 1. 引入你的 MDX 文件
import * as Copper2026 from '../thoughts/2026-copper.mdx';
// 你之前的那几篇旧文章，如果想保留，也可以转成mdx引入，或者暂时先手写在这里占位
// import * as PostDune from '../thoughts/dune-review.mdx';

// 2. 导出列表
export const thoughtsList = [
    {
        id: 'copper-2026',
        // 获取 MDX 里的 frontMatter (元数据)
        ...Copper2026.frontMatter,
        // 获取 MDX 的内容组件
        Component: Copper2026.default,
    },
];
