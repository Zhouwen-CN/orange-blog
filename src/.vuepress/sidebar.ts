import { sidebar } from 'vuepress-theme-hope';

export default sidebar({
  '/': [
    '',
    {
      text: '大数据',
      icon: 'fa-solid fa-database',
      prefix: 'bigdata/',
      collapsible: true,
      children: 'structure',
    },
    {
      text: '后端',
      icon: 'fa-solid fa-server',
      prefix: 'backend/',
      collapsible: true,
      children: 'structure',
    },
    {
      text: '前端',
      icon: 'fa-brands fa-square-js',
      prefix: 'frontend/',
      collapsible: true,
      children: 'structure',
    },
    {
      text: '如何使用',
      icon: 'fa-solid fa-circle-question',
      prefix: 'usage/',
      collapsible: true,
      children: 'structure',
    },
    'intro',
    {
      text: '幻灯片',
      icon: 'person-chalkboard',
      link: 'https://plugin-md-enhance.vuejs.press/zh/guide/content/revealjs/demo.html',
    },
  ],
});
