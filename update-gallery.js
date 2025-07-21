const fs = require('fs');
const path = require('path');

// 配置选项
const CONFIG = {
  assetsDir: './dist/assets',
  outputDir: './dist',
  imagesPerPage: 12, // 每页显示的图片数量
  supportedExtensions: ['.jpg', '.jpeg', '.png', '.gif', '.webp'],
  excludeDirs: ['__MACOSX', '.DS_Store'] // 排除的目录
};

/**
 * 递归扫描目录获取所有图片文件
 */
function scanImages(dir, baseDir = dir) {
  let images = [];
  
  try {
    const items = fs.readdirSync(dir);
    
    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        // 跳过排除的目录
        if (CONFIG.excludeDirs.includes(item)) {
          continue;
        }
        // 递归扫描子目录
        images = images.concat(scanImages(fullPath, baseDir));
      } else if (stat.isFile()) {
        const ext = path.extname(item).toLowerCase();
        if (CONFIG.supportedExtensions.includes(ext)) {
          // 计算相对路径
          const relativePath = path.relative(baseDir, fullPath).replace(/\\/g, '/');
          images.push({
            filename: item,
            path: relativePath,
            fullPath: fullPath,
            size: stat.size,
            category: path.dirname(relativePath) === '.' ? 'default' : path.dirname(relativePath)
          });
        }
      }
    }
  } catch (error) {
    console.error(`扫描目录 ${dir} 时出错:`, error.message);
  }
  
  return images;
}

/**
 * 生成单个图片的HTML
 */
function generateImageHtml(image, assetsPath = 'dist/assets') {
  const imagePath = `${assetsPath}/${image.path}`;
  const imageTitle = path.parse(image.filename).name.replace(/[_-]/g, ' ');
  
  return `
    <div class="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 p-2">
      <div class="group relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
        <a href="${imagePath}" data-fancybox="gallery" data-caption="${imageTitle}">
          <img 
            src="${imagePath}" 
            alt="${imageTitle}"
            class="w-full object-contain transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
          <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity duration-300 flex items-center justify-center">
            <svg class="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"></path>
            </svg>
          </div>
        </a>
      </div>
    </div>`;
}

/**
 * 生成画廊页面HTML
 */
function generateGalleryPageHtml(images, pageNumber, totalPages) {
  const startIndex = (pageNumber - 1) * CONFIG.imagesPerPage;
  const endIndex = Math.min(startIndex + CONFIG.imagesPerPage, images.length);
  const pageImages = images.slice(startIndex, endIndex);
  
  const imagesHtml = pageImages.map(image => generateImageHtml(image)).join('');
  
  return `<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
${imagesHtml}
</div>`;
}

/**
 * 更新index.html中的总页数
 */
function updateIndexHtml(totalPages) {
  const indexPath = './index.html';
  
  try {
    let content = fs.readFileSync(indexPath, 'utf8');
    
    // 更新totalPages变量
    const totalPagesRegex = /const totalPages = \d+;/;
    const newTotalPagesLine = `const totalPages = ${totalPages};`;
    
    if (totalPagesRegex.test(content)) {
      content = content.replace(totalPagesRegex, newTotalPagesLine);
    } else {
      console.warn('未找到totalPages变量，请检查index.html文件');
      return false;
    }
    
    fs.writeFileSync(indexPath, content, 'utf8');
    console.log(`✅ 已更新 index.html 中的总页数为 ${totalPages}`);
    return true;
  } catch (error) {
    console.error('更新index.html时出错:', error.message);
    return false;
  }
}

/**
 * 清理旧的画廊页面文件
 */
function cleanOldGalleryPages() {
  try {
    const files = fs.readdirSync(CONFIG.outputDir);
    const galleryFiles = files.filter(file => file.match(/^gallery_page_\d+\.html$/));
    
    galleryFiles.forEach(file => {
      const filePath = path.join(CONFIG.outputDir, file);
      fs.unlinkSync(filePath);
      console.log(`🗑️  删除旧文件: ${file}`);
    });
    
    return galleryFiles.length;
  } catch (error) {
    console.error('清理旧文件时出错:', error.message);
    return 0;
  }
}

/**
 * 主函数
 */
function updateGallery() {
  console.log('🚀 开始更新静态画廊...');
  console.log('📅 更新时间:', new Date().toLocaleString('zh-CN'));
  
  // 检查assets目录是否存在
  if (!fs.existsSync(CONFIG.assetsDir)) {
    console.error(`❌ 资源目录不存在: ${CONFIG.assetsDir}`);
    return;
  }
  
  // 清理旧的画廊页面
  const deletedCount = cleanOldGalleryPages();
  if (deletedCount > 0) {
    console.log(`🧹 清理了 ${deletedCount} 个旧的画廊页面`);
  }
  
  // 扫描所有图片
  console.log('📸 扫描图片文件...');
  const images = scanImages(CONFIG.assetsDir);
  
  if (images.length === 0) {
    console.log('⚠️  未找到任何图片文件');
    // 即使没有图片，也要清理并更新index.html
    updateIndexHtml(0);
    return;
  }
  
  console.log(`📊 找到 ${images.length} 张图片`);
  
  // 按文件名排序
  images.sort((a, b) => a.filename.localeCompare(b.filename));
  
  // 计算总页数
  const totalPages = Math.ceil(images.length / CONFIG.imagesPerPage);
  console.log(`📄 将生成 ${totalPages} 个页面`);
  
  // 生成各个页面
  for (let i = 1; i <= totalPages; i++) {
    const pageHtml = generateGalleryPageHtml(images, i, totalPages);
    const outputPath = path.join(CONFIG.outputDir, `gallery_page_${i}.html`);
    
    try {
      fs.writeFileSync(outputPath, pageHtml, 'utf8');
      console.log(`✅ 生成页面: gallery_page_${i}.html (${Math.min(CONFIG.imagesPerPage, images.length - (i-1) * CONFIG.imagesPerPage)} 张图片)`);
    } catch (error) {
      console.error(`❌ 生成页面 ${i} 时出错:`, error.message);
    }
  }
  
  // 更新index.html
  updateIndexHtml(totalPages);
  
  // 生成图片信息JSON文件（可选，用于调试）
  const infoPath = path.join(CONFIG.outputDir, 'gallery-info.json');
  const info = {
    totalImages: images.length,
    totalPages: totalPages,
    imagesPerPage: CONFIG.imagesPerPage,
    categories: [...new Set(images.map(img => img.category))],
    generatedAt: new Date().toISOString(),
    images: images.map(img => ({
      filename: img.filename,
      path: img.path,
      category: img.category
    }))
  };
  
  try {
    fs.writeFileSync(infoPath, JSON.stringify(info, null, 2), 'utf8');
    console.log('📋 生成图片信息文件: gallery-info.json');
  } catch (error) {
    console.error('生成信息文件时出错:', error.message);
  }
  
  console.log('\n🎉 静态画廊更新完成！');
  console.log(`\n📈 统计信息:`);
  console.log(`   - 总图片数: ${images.length}`);
  console.log(`   - 总页数: ${totalPages}`);
  console.log(`   - 每页图片数: ${CONFIG.imagesPerPage}`);
  console.log(`   - 图片分类: ${[...new Set(images.map(img => img.category))].join(', ')}`);
  console.log(`\n📝 下一步操作:`);
  console.log(`   1. 检查生成的文件是否正确`);
  console.log(`   2. 提交更改到 Git: git add . && git commit -m "更新画廊图片"`);
  console.log(`   3. 推送到 GitHub: git push`);
  console.log(`   4. Netlify 将自动部署更新`);
}

// 如果直接运行此脚本
if (require.main === module) {
  updateGallery();
}

module.exports = { updateGallery, CONFIG };

