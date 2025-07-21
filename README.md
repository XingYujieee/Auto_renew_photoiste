# 摄影作品集自动化管理系统

## 功能概述

这是一个为摄影作品集网站开发的自动化图片管理系统，能够自动检测图片文件夹的变化，并自动生成相应的网页内容。您只需要将图片放入指定文件夹，系统就会自动更新网站展示的内容。

## 主要特性

✅ **自动扫描图片** - 递归扫描 `dist/assets/` 目录下的所有图片文件  
✅ **自动生成页面** - 根据图片数量自动生成分页的画廊页面  
✅ **响应式布局** - 支持桌面和移动设备的响应式显示  
✅ **灯箱效果** - 集成 Fancybox 提供优雅的图片浏览体验  
✅ **文件监控** - 实时监控文件变化，自动重新生成页面  
✅ **多格式支持** - 支持 JPG、JPEG、PNG、GIF、WebP 格式  

## 目录结构

```
photography-main/
├── dist/
│   ├── assets/           # 图片存放目录
│   │   ├── c/           # 分类目录示例
│   │   └── *.jpg        # 图片文件
│   ├── gallery_page_*.html  # 自动生成的画廊页面
│   └── gallery-info.json   # 图片信息文件
├── generate-gallery.js     # 画廊生成脚本
├── watch-gallery.js        # 文件监控脚本
├── package.json            # 项目配置
└── index.html              # 主页面
```

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 生成画廊页面

```bash
# 手动生成一次
npm run generate

# 或者启动监控模式（推荐）
npm run watch
```

### 3. 启动网站

```bash
# 使用 Python 启动本地服务器
python3 -m http.server 8000

# 或者使用 Node.js
npx http-server -p 8000
```

然后在浏览器中访问 `http://localhost:8000`

## 使用方法

### 添加图片

1. 将图片文件复制到 `dist/assets/` 目录
2. 支持在子目录中组织图片（如 `dist/assets/landscape/`）
3. 如果启用了监控模式，页面会自动更新
4. 如果没有启用监控，运行 `npm run generate` 手动更新

### 删除图片

1. 从 `dist/assets/` 目录删除图片文件
2. 系统会自动检测并更新页面

### 修改图片

1. 替换 `dist/assets/` 目录中的图片文件
2. 系统会自动检测文件变化并更新

## 配置选项

在 `generate-gallery.js` 文件中可以修改以下配置：

```javascript
const CONFIG = {
  assetsDir: './dist/assets',        // 图片目录
  outputDir: './dist',               // 输出目录
  imagesPerPage: 12,                 // 每页显示图片数量
  supportedExtensions: ['.jpg', '.jpeg', '.png', '.gif', '.webp'],
  excludeDirs: ['__MACOSX', '.DS_Store']  // 排除的目录
};
```

## 命令说明

| 命令 | 说明 |
|------|------|
| `npm run generate` | 手动生成画廊页面 |
| `npm run watch` | 启动文件监控模式 |
| `npm run build` | 构建项目（等同于 generate） |

## 监控模式

启动监控模式后，系统会：

- 实时监控 `dist/assets/` 目录
- 检测图片文件的添加、删除、修改
- 自动重新生成画廊页面
- 更新分页配置

```bash
npm run watch
```

监控模式特性：
- ⚡ 1秒防抖延迟，避免频繁触发
- 📁 支持多层子目录监控
- 🔄 自动重新绑定 Fancybox 事件
- 👀 实时显示文件变化日志

## 技术实现

### 核心组件

1. **图片扫描器** (`scanImages`)
   - 递归扫描目录
   - 过滤支持的图片格式
   - 生成图片元数据

2. **页面生成器** (`generateGalleryPageHtml`)
   - 生成响应式网格布局
   - 集成 Fancybox 属性
   - 支持懒加载

3. **配置更新器** (`updateIndexHtml`)
   - 自动更新主页面的分页配置
   - 保持代码同步

4. **文件监控器** (`watch-gallery.js`)
   - 使用 chokidar 监控文件变化
   - 防抖机制避免频繁触发
   - 优雅退出处理

### 生成的HTML结构

```html
<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
  <div class="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 p-2">
    <div class="group relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
      <a href="图片路径" data-fancybox="gallery" data-caption="图片标题">
        <img src="图片路径" alt="图片标题" class="..." loading="lazy"/>
        <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 ...">
          <!-- 悬停图标 -->
        </div>
      </a>
    </div>
  </div>
</div>
```

## 故障排除

### 常见问题

**Q: 图片没有显示？**
A: 检查图片文件路径和格式是否正确，确保图片在 `dist/assets/` 目录中。

**Q: 分页不正确？**
A: 运行 `npm run generate` 重新生成页面，检查 `index.html` 中的 `totalPages` 是否更新。

**Q: 监控模式不工作？**
A: 确保安装了依赖，检查文件权限，尝试重启监控进程。

**Q: 灯箱效果不工作？**
A: 检查 Fancybox 脚本是否正确加载，确保 `data-fancybox` 属性正确设置。

### 调试信息

系统会生成 `dist/gallery-info.json` 文件，包含：
- 图片总数和分页信息
- 图片分类统计
- 生成时间戳
- 详细的图片列表

## 性能优化

- 使用懒加载减少初始加载时间
- 图片悬停效果使用 CSS 过渡
- 分页减少单页图片数量
- 响应式布局适配不同设备

## 扩展功能

可以考虑添加的功能：
- 图片标签和分类管理
- 图片排序选项（按时间、名称、大小）
- 图片压缩和优化
- SEO 优化（图片 alt 标签、元数据）
- 社交分享功能

## 许可证

MIT License

---

**享受您的自动化摄影作品集管理体验！** 📸✨

