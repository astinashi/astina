# 窗闲云影度

学生 / 实习生个人网站的视觉原型。深空黑、金属银与亮橙配色，配合大字标题和来自 NASA / Unsplash 的地球轨道摄影底图。包含履历、笔记、作品和审美收藏，所有经历与项目内容均为待替换的示例。

## 预览

在此目录运行 `node server.cjs`，打开 http://127.0.0.1:4173 。也可以直接打开 `index.html`。

## GitHub Pages

网站由 GitHub Pages 从 `main` 分支的仓库根目录发布。静态文件使用相对路径，无需构建。

## 维护笔记

每篇笔记对应 `notes/` 下一个 HTML 文件。点击首页「笔记与心得」中的条目会在新标签页阅读，也可以直接分享单篇的网址。

1. 新增笔记时，复制 `notes/learning.html` 为 `notes/my-new-note.html`。文件名用小写英文字母、数字和短横线。
2. 修改新文件中的 `<title>`（标签页标题）、`<h1>`（文章标题）、`note-label`（分类）和正文。每段用一对 `<p>…</p>`，小标题用 `<h2>…</h2>`。
3. 在 `index.html` 的 `note-list` 内复制一条现有的 `<a class="note-row">`，把 `href` 改为 `./notes/my-new-note.html`，同步修改分类和标题。保留 `target="_blank" rel="noopener"`。列表顺序由这些链接的排列顺序决定。
4. 把改动提交并推送到 `main`，等 GitHub Pages 部署完成即可访问。可先运行 `node server.cjs` 检查本地效果。

改正文只需要编辑对应的 HTML 文件。改标题或分类时，同步更新首页条目。建议保留原文件名，已分享的文章链接就能继续使用。

## 后续替换

- `index.html`：个人介绍、履历、笔记列表、项目卡片与收藏。
- `script.js`：点击后展示的示例详情，以及联系按钮的行为。
- `style.css`：配色、排版、插画与移动端布局。

首屏底图存放在 `assets/earth-from-orbit.jpg`，图片来源和免费商用许可记录在 `assets/SOURCES.md`；图片随网站发布，不依赖远程图片链接。舷窗和收藏图形为 CSS 占位示意。标题使用站酷庆科黄油体，项目封面使用 Black Ops One，正文使用 Noto Sans SC；字体通过 Google Fonts 加载，连接不可用时回退到系统字体。

页面背景随滚动从深空黑平滑变成银灰，再回到黑色；根据背景亮度调整文字及强调色。动效通过 requestAnimationFrame 更新，履历展开或窗口大小变化会重新计算过渡位置。开启系统减少动态效果选项时关闭底图视差，保留阅读所需的背景和文字配色。网站为静态页面，无构建依赖。

当前艺术方向样式位于 art-direction.css，发布时请一起上传。主视觉使用 Aron Visuals 的月夜摄影，许可见 assets/SOURCES.md。


最新视觉：宇航员摄影、镂空粗体、毛玻璃面板。art-direction.css 为当前覆盖样式；底图为 assets/helmet.jpg，关于区为 assets/astronaut.jpg。动效尊重 prefers-reduced-motion。


收藏卡片位于 index.html 的 collection-track 中，每张由图片、标题、描述及外链组成，替换 a 的 href 即可设置自己的外链。支持触屏滑动、鼠标拖动和左右方向键；选中卡片居中放大。结尾采用 quiet-earth.jpg 的低矮弧光，前景手写文字使用本地嵌入的寒蝉手拙体 v2.500（作者：寒蝉字型，免费商用），授权来源记录于 assets/fonts/SOURCE.txt。

