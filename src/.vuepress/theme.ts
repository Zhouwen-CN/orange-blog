import { hopeTheme } from 'vuepress-theme-hope';
import navbar from './navbar.js';
import sidebar from './sidebar.js';

export default hopeTheme({
  favicon: '/favicon.ico',
  hostname: 'https://zhouwen-cn.gitee.io',

  author: {
    name: 'Mr.陈',
    url: 'https://gitee.com/Zhouwen-CN',
    email: '597879949@qq.com',
  },
  license: 'MIT',

  // jsdelivr cdn, 部署会有跨域问题
  // iconAssets: 'fontawesome-with-brands',

  // 改成本地，baseUrl + 静态资源地址
  iconAssets: [
    '/orange-blog/assets/fontawesome/brands.min.js',
    '/orange-blog/assets/fontawesome/fontawesome.min.js',
    '/orange-blog/assets/fontawesome/solid.min.js',
  ],

  logo: 'https://theme-hope-assets.vuejs.press/logo.svg',

  // 导航栏右侧gitee图标
  repo: 'https://gitee.com/Zhouwen-CN/orange-blog.git',
  repoLabel: 'Gitee',
  docsBranch: 'master',

  // 导航栏布局
  navbarLayout: {
    start: ['Brand'],
    center: ['Links', 'Search'],
    end: ['Language', 'Repo', 'Outlook'],
  },

  docsDir: 'src',

  // 导航栏
  navbar,
  navbarAutoHide: 'always',

  // 侧边栏
  sidebar,

  // 页脚
  footer: '',
  displayFooter: true,

  // 博客相关
  blog: {
    avatar: '/assets/images/profile_picture.jpg',
    roundAvatar: true,
    description: '一只程序猿',
    intro: '/intro.html',
    medias: {
      Gitee: 'https://gitee.com/Zhouwen-CN',
      GitHub: 'https://github.com/Zhouwen-CN',
    },
  },

  // 加密配置
  encrypt: {
    config: {
      '/usage/encrypt.html': ['1234'],
    },
  },

  // 多语言配置
  metaLocales: {
    editLink: '在 GitHub 上编辑此页',
  },

  // 如果想要实时查看任何改变，启用它。注: 这对更新性能有很大负面影响
  // hotReload: true,

  // 在这里配置主题提供的插件
  plugins: {
    blog: true,
    // 代码主题，当前默认值
    prismjs: {
      light: 'one-light',
      dark: 'one-dark',
    },
    // 搜索插件
    searchPro: {
      autoSuggestions: false,
      resultHistoryCount: 0,
      queryHistoryCount: 5,
      searchDelay: 300,
      // 过滤需要检索的页面
      filter: (page) => {
        return /^\/(?:b(?:igdata|ackend)|frontend)\/.+$/.test(page.data.path);
      },
      // 添加自定义索引字段
      customFields: [
        {
          getter: (page) => {
            return page.frontmatter.category as string[];
          },
          formatter: '分类：$content',
        },
        {
          getter: (page) => {
            return page.frontmatter.tag as string[];
          },
          formatter: '标签：$content',
        },
      ],
    },

    // 在启用之前需要安装 @waline/client
    // 警告: 这是一个仅供演示的测试服务器，在生产环境中请自行部署并使用自己的服务器！
    // comment: {
    //   provider: "Waline",
    //   serverURL: "https://waline-comment.vuejs.press",
    // },

    components: {
      components: ['Badge', 'VPCard', 'VPBanner'],
    },

    // 此处开启了很多功能用于演示，你应仅保留用到的功能。
    mdEnhance: {
      align: true,
      attrs: true,
      codetabs: true,
      component: true,
      demo: true,
      figure: true,
      imgLazyload: true,
      imgSize: true,
      include: true,
      mark: true,
      stylize: [
        {
          matcher: 'Recommended',
          replacer: ({ tag }) => {
            if (tag === 'em')
              return {
                tag: 'Badge',
                attrs: { type: 'tip' },
                content: 'Recommended',
              };
          },
        },
      ],
      sub: true,
      sup: true,
      tabs: true,
      vPre: true,

      // 在启用之前安装 chart.js
      // chart: true,

      // insert component easily

      // 在启用之前安装 echarts
      // echarts: true,

      // 在启用之前安装 flowchart.ts
      // flowchart: true,

      // gfm requires mathjax-full to provide tex support
      // gfm: true,

      // 在启用之前安装 katex
      // katex: true,

      // 在启用之前安装 mathjax-full
      // mathjax: true,

      // 在启用之前安装 mermaid
      // mermaid: true,

      // playground: {
      //   presets: ["ts", "vue"],
      // },

      // 在启用之前安装 reveal.js
      // revealJs: {
      //   plugins: ["highlight", "math", "search", "notes", "zoom"],
      // },

      // 在启用之前安装 @vue/repl
      // vuePlayground: true,

      // install sandpack-vue3 before enabling it
      // sandpack: true,
    },

    // 如果你需要 PWA。安装 @vuepress/plugin-pwa 并取消下方注释
    // pwa: {
    //   favicon: "/favicon.ico",
    //   cacheHTML: true,
    //   cachePic: true,
    //   appendBase: true,
    //   apple: {
    //     icon: "/assets/icon/apple-icon-152.png",
    //     statusBarColor: "black",
    //   },
    //   msTile: {
    //     image: "/assets/icon/ms-icon-144.png",
    //     color: "#ffffff",
    //   },
    //   manifest: {
    //     icons: [
    //       {
    //         src: "/assets/icon/chrome-mask-512.png",
    //         sizes: "512x512",
    //         purpose: "maskable",
    //         type: "image/png",
    //       },
    //       {
    //         src: "/assets/icon/chrome-mask-192.png",
    //         sizes: "192x192",
    //         purpose: "maskable",
    //         type: "image/png",
    //       },
    //       {
    //         src: "/assets/icon/chrome-512.png",
    //         sizes: "512x512",
    //         type: "image/png",
    //       },
    //       {
    //         src: "/assets/icon/chrome-192.png",
    //         sizes: "192x192",
    //         type: "image/png",
    //       },
    //     ],
    //     shortcuts: [
    //       {
    //         name: "Demo",
    //         short_name: "Demo",
    //         url: "/demo/",
    //         icons: [
    //           {
    //             src: "/assets/icon/guide-maskable.png",
    //             sizes: "192x192",
    //             purpose: "maskable",
    //             type: "image/png",
    //           },
    //         ],
    //       },
    //     ],
    //   },
    // },
  },
});
