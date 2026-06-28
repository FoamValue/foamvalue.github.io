/**
 * DevBlog - 主脚本
 */

document.addEventListener('DOMContentLoaded', function() {
  // 初始化导航
  initNavigation();
  
  // 初始化搜索
  initSearch();
  
  // 初始化代码复制
  initCodeCopy();
  
  // 初始化图片懒加载
  initLazyLoad();
  
  // 初始化图片灯箱
  initImageLightbox();
});

/**
 * 导航菜单切换
 */
function initNavigation() {
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('.nav-menu');
  
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', function() {
      const isExpanded = this.getAttribute('aria-expanded') === 'true';
      this.setAttribute('aria-expanded', !isExpanded);
      navMenu.classList.toggle('is-open');
    });
    
    // 点击外部关闭菜单
    document.addEventListener('click', function(e) {
      if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
        navToggle.setAttribute('aria-expanded', 'false');
        navMenu.classList.remove('is-open');
      }
    });
  }
}

/**
 * 搜索功能
 */
function initSearch() {
  const searchToggle = document.querySelector('.search-toggle');
  const searchPanel = document.querySelector('.search-panel');
  const searchClose = document.querySelector('.search-close');
  const searchInput = document.querySelector('.search-input');
  
  if (searchToggle && searchPanel) {
    searchToggle.addEventListener('click', function() {
      searchPanel.hidden = false;
      searchInput.focus();
      document.body.style.overflow = 'hidden';
    });
    
    searchClose.addEventListener('click', closeSearch);
    
    // ESC 关闭搜索
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && !searchPanel.hidden) {
        closeSearch();
      }
    });
    
    function closeSearch() {
      searchPanel.hidden = true;
      document.body.style.overflow = '';
    }
  }
}

/**
 * 代码复制功能
 */
function initCodeCopy() {
  // 为代码块添加复制按钮
  const codeBlocks = document.querySelectorAll('div.highlighter-rouge');
  
  codeBlocks.forEach(function(block) {
    const pre = block.querySelector('pre');
    if (!pre) return;
    
    const header = document.createElement('div');
    header.className = 'code-header';
    
    // 获取语言
    const classes = block.className.split(' ');
    let language = '';
    classes.forEach(function(cls) {
      if (cls.startsWith('language-')) {
        language = cls.replace('language-', '');
      }
    });
    
    const languageLabel = document.createElement('span');
    languageLabel.className = 'code-language';
    languageLabel.textContent = language || 'Code';
    
    const copyButton = document.createElement('button');
    copyButton.className = 'code-copy';
    copyButton.innerHTML = `
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
      </svg>
      <span>复制</span>
    `;
    
    copyButton.addEventListener('click', function() {
      const code = pre.querySelector('code') || pre;
      navigator.clipboard.writeText(code.textContent).then(function() {
        copyButton.classList.add('copied');
        copyButton.querySelector('span').textContent = '已复制';
        
        setTimeout(function() {
          copyButton.classList.remove('copied');
          copyButton.querySelector('span').textContent = '复制';
        }, 2000);
      });
    });
    
    header.appendChild(languageLabel);
    header.appendChild(copyButton);
    block.insertBefore(header, pre);
  });
}

/**
 * 图片懒加载
 */
function initLazyLoad() {
  const images = document.querySelectorAll('img[loading="lazy"]');
  
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.classList.add('loaded');
          imageObserver.unobserve(img);
        }
      });
    });
    
    images.forEach(function(img) {
      imageObserver.observe(img);
    });
  }
}

/**
 * 图片灯箱
 */
function initImageLightbox() {
  const contentImages = document.querySelectorAll('.post-content img, .page-content img');
  
  contentImages.forEach(function(img) {
    img.style.cursor = 'zoom-in';
    img.addEventListener('click', function() {
      openLightbox(this.src, this.alt);
    });
  });
  
  function openLightbox(src, alt) {
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.innerHTML = `
      <div class="lightbox-overlay"></div>
      <div class="lightbox-content">
        <img src="${src}" alt="${alt}" loading="lazy">
        ${alt ? `<p class="lightbox-caption">${alt}</p>` : ''}
      </div>
      <button class="lightbox-close" aria-label="关闭">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M18 6 6 18"/>
          <path d="m6 6 12 12"/>
        </svg>
      </button>
    `;
    
    document.body.appendChild(lightbox);
    document.body.style.overflow = 'hidden';
    
    // 动画
    requestAnimationFrame(function() {
      lightbox.classList.add('active');
    });
    
    // 关闭事件
    lightbox.addEventListener('click', function(e) {
      if (e.target === lightbox || e.target.classList.contains('lightbox-overlay')) {
        closeLightbox(lightbox);
      }
    });
    
    lightbox.querySelector('.lightbox-close').addEventListener('click', function() {
      closeLightbox(lightbox);
    });
    
    // ESC 关闭
    const closeHandler = function(e) {
      if (e.key === 'Escape') {
        closeLightbox(lightbox);
        document.removeEventListener('keydown', closeHandler);
      }
    };
    document.addEventListener('keydown', closeHandler);
  }
  
  function closeLightbox(lightbox) {
    lightbox.classList.remove('active');
    setTimeout(function() {
      lightbox.remove();
      document.body.style.overflow = '';
    }, 250);
  }
}

/**
 * 平滑滚动到锚点
 */
document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
  anchor.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});
