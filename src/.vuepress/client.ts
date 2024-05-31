import { defineClientConfig } from 'vuepress/client';
import { setupRunningTimeFooter } from 'vuepress-theme-hope/presets/footerRunningTime.js';

export default defineClientConfig({
  setup() {
    setupRunningTimeFooter(
      new Date('2024-03-27'),
      {
        '/': '已运行 :day 天 :hour 小时 :minute 分钟 :second 秒',
      },
      false
    );
  },
});
