import { navbar } from 'vuepress-theme-hope';

export default navbar([
  {
    text: '文章分类',
    icon: 'fa-solid fa-list',
    children: [
      {
        text: '大数据',
        link: '/bigdata/',
        icon: 'fa-solid fa-database',
      },
      {
        text: '后端',
        link: '/backend/',
        icon: 'fa-solid fa-server',
      },
      {
        text: '前端',
        link: '/frontend/',
        icon: 'fa-brands fa-square-js',
      },
      {
        text: '如何使用',
        link: '/usage/',
        icon: 'laptop-code',
      },
    ],
  },
]);
