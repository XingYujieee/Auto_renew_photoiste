# 摄影作品集静态网站自动更新工具

## 🎯 项目概述

这是一个专为静态网站部署设计的摄影作品集管理工具。您只需要运行一个简单的脚本，就能自动扫描图片文件夹并更新网站的所有 HTML 文件，然后将更新推送到 GitHub，Netlify 会自动部署。

## ✨ 核心特性

- 🚀 **一键更新** - 运行一个命令即可更新整个网站
- 📁 **智能扫描** - 自动扫描图片文件夹，支持子目录分类
- 🧹 **自动清理** - 删除旧的页面文件，生成新的页面
- 📱 **响应式设计** - 完美适配桌面和移动设备
- 🖼️ **灯箱效果** - 集成 Fancybox 图片浏览体验
- 🔄 **零依赖** - 只使用 Node.js 内置模块

## 🚀 快速开始

### 1. 添加图片
将您的摄影作品放入 `dist/assets/` 目录：

```
dist/assets/
├── 风景/
│   ├── 山景1.jpg
│   └── 海景1.jpg
├── 人像/
│   ├── 肖像1.jpg
│   └── 肖像2.jpg
└── 其他图片.jpg
```

### 2. 更新网站
运行更新脚本：

```bash
# 方法1：使用 npm 脚本
npm run update

# 方法2：直接运行 Node.js
node update-gallery.js
```

### 3. 部署到 Netlify
```bash
# 提交更改到 Git
git add .
git commit -m "更新画廊图片"

# 推送到 GitHub
git push

# Netlify 会自动检测更改并部署
```

## 📋 详细使用流程

### 步骤 1：准备图片
- 支持格式：JPG, JPEG, PNG, GIF, WebP
- 建议图片大小：1-3MB（网站会自动优化显示）
- 可以使用子文件夹进行分类管理

### 步骤 2：运行更新脚本
```bash
npm run update
```

脚本会自动：
- 🗑️ 清理旧的画廊页面文件
- 📸 扫描所有图片文件
- 📄 生成新的分页画廊页面
- 🔢 更新 index.html 中的页数配置
- 📊 生成图片信息统计文件

### 步骤 3：检查更新结果
脚本运行后会显示详细信息：
```
🎉 静态画廊更新完成！
📈 统计信息:
   - 总图片数: 179
   - 总页数: 15
   - 每页图片数: 12
   - 图片分类: 风景, 人像, default
```

### 步骤 4：部署到线上
```bash
# 查看更改的文件
git status

# 添加所有更改
git add .

# 提交更改
git commit -m "更新画廊图片 - 新增XX张照片"

# 推送到 GitHub
git push origin main
```

## ⚙️ 配置选项

编辑 `update-gallery.js` 文件中的 CONFIG 部分：

```javascript
const CONFIG = {
  assetsDir: './dist/assets',        // 图片目录
  outputDir: './dist',               // 输出目录
  imagesPerPage: 12,                 // 每页显示图片数量
  supportedExtensions: ['.jpg', '.jpeg', '.png', '.gif', '.webp'],
  excludeDirs: ['__MACOSX', '.DS_Store']  // 排除的目录
};
```

### 常用配置修改：

**修改每页图片数量：**
```javascript
imagesPerPage: 16,  // 改为每页16张图片
```

**添加支持的图片格式：**
```javascript
supportedExtensions: ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp'],
```

## 📁 项目结构

```
photography-main/
├── dist/
│   ├── assets/              # 📸 图片存放目录
│   │   ├── 风景/           # 分类文件夹
│   │   └── *.jpg           # 图片文件
│   ├── gallery_page_*.html # 🔄 自动生成的画廊页面
│   └── gallery-info.json  # 📊 图片信息统计
├── update-gallery.js       # 🛠️ 更新脚本
├── package.json            # 📦 项目配置
└── index.html              # 🏠 主页面
```

## 🔧 故障排除

### 常见问题

**Q: 脚本运行后图片没有显示？**
A: 
1. 检查图片是否在 `dist/assets/` 目录中
2. 确认图片格式是否支持
3. 检查图片文件名是否包含特殊字符

**Q: 页面数量不正确？**
A: 
1. 重新运行 `npm run update`
2. 检查 `index.html` 中的 `totalPages` 是否更新
3. 清除浏览器缓存

**Q: Git 提交时文件太大？**
A: 
1. 压缩图片文件大小
2. 使用 Git LFS 管理大文件
3. 考虑使用图片 CDN

### 调试信息

脚本会生成 `dist/gallery-info.json` 文件，包含：
- 图片总数和分页信息
- 图片分类统计
- 生成时间戳
- 详细的图片列表

## 🌐 Netlify 部署配置

### 自动部署设置
1. 连接 GitHub 仓库到 Netlify
2. 设置构建命令：`npm run update`
3. 设置发布目录：`./`
4. 启用自动部署

### 环境变量（可选）
如果需要在 Netlify 上运行构建脚本：
```
NODE_VERSION=18
```

## 📝 工作流程示例

### 日常更新流程：
```bash
# 1. 添加新图片到 dist/assets/
cp ~/新照片/*.jpg dist/assets/风景/

# 2. 更新网站
npm run update

# 3. 检查结果
# 浏览器打开 index.html 预览

# 4. 提交到 Git
git add .
git commit -m "新增风景照片 5 张"
git push

# 5. 等待 Netlify 自动部署（通常 1-2 分钟）
```

### 批量整理流程：
```bash
# 1. 重新组织图片文件夹
mkdir -p dist/assets/{风景,人像,街拍,建筑}
# 移动图片到对应分类...

# 2. 更新网站
npm run update

# 3. 提交更改
git add .
git commit -m "重新整理图片分类"
git push
```

## 🎨 自定义样式

如果需要修改图片显示样式，编辑 `update-gallery.js` 中的 `generateImageHtml` 函数：

```javascript
// 修改图片容器样式
class="w-full h-64 object-cover ..."

// 修改悬停效果
class="group-hover:scale-105 ..."
```

## 📊 性能优化建议

1. **图片优化**：
   - 使用适当的图片压缩
   - 建议单张图片 < 2MB
   - 考虑使用 WebP 格式

2. **分页设置**：
   - 每页 12-16 张图片为最佳
   - 图片过多时增加页数而非每页数量

3. **加载优化**：
   - 脚本已启用图片懒加载
   - 首页加载速度优先

## 🔄 版本更新

当需要更新脚本功能时：
1. 备份当前的 `update-gallery.js`
2. 替换新版本脚本
3. 运行 `npm run update` 测试
4. 提交更改

---

**🎉 享受您的自动化静态摄影作品集！**

有任何问题或建议，欢迎在 GitHub 上提 Issue。

