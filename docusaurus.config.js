import {themes as prismThemes} from 'prism-react-renderer';

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: '踏踏实实王老六',
  tagline: 'Talk is cheap, show me the code.',
  favicon: 'img/logo.jpg',

  // GitHub Pages 部署配置
  url: 'https://shengbo-wang1.github.io',
  baseUrl: '/',
  organizationName: 'shengbo-wang1',
  projectName: 'shengbo-wang1.github.io',
  deploymentBranch: 'gh-pages',
  trailingSlash: false,

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  i18n: {
    defaultLocale: 'zh-Hans',
    locales: ['zh-Hans'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: './sidebars.js',
        },
        blog: {
          showReadingTime: true,
          blogSidebarTitle: '近期文章',
          blogSidebarCount: 'ALL',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      }),
    ],
  ],

  themeConfig:
  /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
      ({
        navbar: {
          title: '王老六的博客',
          logo: {
            alt: 'Logo',
            src: 'img/logo.jpg', // 如果没有Logo，它会自动显示文字
          },
          // 核心修改：这里改为三大模块
          items: [
            {
              type: 'docSidebar',
              sidebarId: 'tutorialSidebar', // 对应 docs 文件夹
              position: 'left',
              label: '技术笔记', // 模块 1
            },
            {
              to: '/life',
              label: '记录生活', // 模块 2
              position: 'left'
            },
            {
              to: '/thoughts',
              label: '闲书杂谈', // 模块 3
              position: 'left'
            },
            {
              href: 'https://github.com/shengbo-wang1',
              label: 'GitHub',
              position: 'right',
            },
          ],
        },
        footer: {
          style: 'light',
          // 极简页脚
          copyright: `© ${new Date().getFullYear()} Wang Laoliu. Built with Docusaurus.`,
        },
        prism: {
          theme: prismThemes.github,
          darkTheme: prismThemes.dracula,
        },
        colorMode: {
          defaultMode: 'light',
          disableSwitch: false,
          respectPrefersColorScheme: true,
        },
      }),
};

export default config;
