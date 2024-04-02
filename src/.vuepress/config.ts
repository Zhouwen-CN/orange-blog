import { defineUserConfig } from 'vuepress';
import theme from './theme.js';

export default defineUserConfig({
  base: '/orange-blog/',

  lang: 'zh-CN',
  title: '橙子博客',
  description: '橙子博客',

  theme,

  // 和 PWA 一起启用
  // shouldPrefetch: false,
});
