/**
 * DevBlog - 主脚本
 */

document.addEventListener('DOMContentLoaded', function() {
  initNavigation();
  initSearch();
  initCodeCopy();
  initLazyLoad();
  initImageLightbox();
});

function initNavigation() {
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('.nav-menu');
  
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', function() {
      const isExpanded = this.getAttribute('aria-expanded') === 'true';
      this.setAttribute('aria-expanded', !isExpanded);
      navMenu.classList.toggle('is-open');
    });
    
    document.addEventListener('click', function(e) {
      if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
        navToggle.setAttribute('aria-expanded', 'false');
        navMenu.classList.remove('is-open');
      }
    });
  }
}

function initSearch() {
  const searchToggle = document.querySelector('.search-toggle');
  const searchPanel = document.querySelector('.search-panel');
  const searchClose = document.querySelector('.search-close');
  const searchInput = document.querySelector('.search-input');
  const searchResults = document.querySelector('.search-results');
  
  if (!searchToggle || !searchPanel) return;
  
  let searchIndex = [];
  
  searchToggle.addEventListener('click', function() {
    searchPanel.hidden = false;
    searchInput.focus();
    document.body.style.overflow = 'hidden';
    
    if (searchIndex.length === 0) {
      loadSearchIndex();
    }
  });
  
  searchClose.addEventListener('click', closeSearch);
  
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && !searchPanel.hidden) {
      closeSearch();
    }
  });
  
  searchInput.addEventListener('input', function(e) {
    const query = e.target.value.trim();
    performSearch(query);
  });
  
  function loadSearchIndex() {
    fetch('search.json')
      .then(function(response) {
        if (!response.ok) throw new Error('Network response was not ok');
        return response.json();
      })
      .then(function(data) {
        searchIndex = data;
      })
      .catch(function(error) {
        console.error('加载搜索索引失败:', error);
      });
  }
  
  function performSearch(query) {
    searchResults.innerHTML = '';
    
    if (!query || searchIndex.length === 0) {
      if (!query) {
        searchResults.innerHTML = '<p class="search-empty">请输入关键词搜索文章</p>';
      }
      return;
    }
    
    const results = searchIndex.filter(function(post) {
      const searchText = (post.title + ' ' + post.description + ' ' + post.tags + ' ' + post.content).toLowerCase();
      return searchText.includes(query.toLowerCase());
    });
    
    if (results.length === 0) {
      searchResults.innerHTML = '<p class="search-empty">未找到相关文章</p>';
      return;
    }
    
    const resultsList = document.createElement('ul');
    resultsList.className = 'search-results-list';
    
    results.slice(0, 10).forEach(function(post) {
      const li = document.createElement('li');
      li.className = 'search-result-item';
      li.innerHTML = `
        <a href="${post.url}" class="search-result-link">
          <h3 class="search-result-title">${post.title}</h3>
          <p class="search-result-date">${post.date}</p>
          ${post.description ? `<p class="search-result-desc">${post.description}</p>` : ''}
        </a>
      `;
      resultsList.appendChild(li);
    });
    
    searchResults.appendChild(resultsList);
  }
  
  function closeSearch() {
    searchPanel.hidden = true;
    document.body.style.overflow = '';
    searchInput.value = '';
    searchResults.innerHTML = '';
  }
}

function detectLanguage(code) {
  const patterns = {
    javascript: [
      /\bfunction\s+\w+\s*\(/,
      /\bconst\s+\w+\s*=/,
      /\blet\s+\w+\s*=/,
      /\bvar\s+\w+\s*=/,
      /console\.(log|error|info)/,
      /document\.(getElementById|querySelector)/,
      /\bimport\s+.*from\s+['"]/,
      /\bexport\s+(default|function)/,
      /=>\s*\{/,
      /class\s+\w+\s+extends\s+React\.Component/,
      /ReactDOM\.render/
    ],
    java: [
      /\bpublic\s+(class|static|void|int|String)/,
      /System\.out\.println/,
      /import\s+java\./,
      /\bprivate\s+\w+/,
      /\bprotected\s+\w+/,
      /\bpackage\s+\w+/,
      /\bimplements\s+\w+/,
      /\bextends\s+\w+/,
      /new\s+ArrayList</,
      /@Override/
    ],
    python: [
      /def\s+\w+\s*\(/,
      /\bimport\s+\w+/,
      /\bfrom\s+\w+\s+import/,
      /print\s*\(/,
      /\bif\s+.+:\s*$/,
      /\bfor\s+\w+\s+in\s+/,
      /\bwhile\s+.+:\s*$/,
      /:\s*\n\s*indent/,
      /\bself\./,
      /\bTrue\b|\bFalse\b/,
      /\bNone\b/
    ],
    bash: [
      /^\s*#!/,
      /^\s*export\s+\w+/,
      /^\s*cd\s+/,
      /^\s*echo\s+/,
      /^\s*if\s+\[/,
      /^\s*for\s+\w+\s+in/,
      /\$\{?\w+\}?/,
      /^\s*git\s+/,
      /^\s*npm\s+/,
      /^\s*docker\s+/
    ],
    sql: [
      /\bSELECT\b/i,
      /\bFROM\b/i,
      /\bWHERE\b/i,
      /\bINSERT\b/i,
      /\bUPDATE\b/i,
      /\bDELETE\b/i,
      /\bCREATE\b/i,
      /\bDROP\b/i,
      /\bALTER\b/i,
      /\bJOIN\b/i,
      /\bON\b/i,
      /\bAND\b/i,
      /\bOR\b/i
    ],
    html: [
      /<html/,
      /<head/,
      /<body/,
      /<div/,
      /<span/,
      /<p/,
      /<a\s+href/,
      /<script/,
      /<style/,
      /<!DOCTYPE/
    ],
    css: [
      /^\s*\.\w+\s*\{/,
      /^\s*#\w+\s*\{/,
      /^\s*\w+\s*\{/,
      /:\s*[\w-]+;/,
      /background(-color)?:/,
      /color:/,
      /font(-size)?:/,
      /margin:/,
      /padding:/,
      /@import\s+/,
      /@media\s+/
    ],
    xml: [
      /<\?xml/,
      /<[^>]+\/>/,
      /<\/\w+>/,
      /xmlns=/,
      /<bean\s+/,
      /<property\s+/,
      /<context:/,
      /<mvc:/,
      /<tx:/
    ],
    json: [
      /^\s*\{/,
      /"[\w-]+"\s*:/,
      /:\s*"[^"]*"/,
      /:\s*\d+/,
      /:\s*(true|false|null)/,
      /\[\s*\{/
    ],
    yaml: [
      /^\s*[\w-]+:/,
      /^\s*- \w+/,
      /^\s*\w+:\s*\|/,
      /^\s*\w+:\s*>/,
      /^\s*-\s*\{/,
      /^\s*---/
    ],
    go: [
      /\bfunc\s+\w+\s*\(/,
      /\bpackage\s+\w+/,
      /\bimport\s+\(/,
      /fmt\.(Print|Println)/,
      /\bvar\s+\w+\s+\w+/,
      /\btype\s+\w+\s+struct/,
      /\bgo\s+\w+/,
      /\bchan\s+\w+/,
      /\binterface\s+\{/
    ],
    ruby: [
      /def\s+\w+\s*\(/,
      /\bclass\s+\w+/,
      /\bmodule\s+\w+/,
      /puts\s+/,
      /\$[\w]+/,
      /@[\w]+/,
      /\battr_accessor\s+/,
      /\binclude\s+\w+/,
      /\brequire\s+['"]/
    ],
    csharp: [
      /\busing\s+\w+/,
      /\bpublic\s+class/,
      /\bprivate\s+\w+/,
      /\bprotected\s+\w+/,
      /\bstatic\s+\w+/,
      /\bvoid\s+\w+/,
      /\bstring\s+\w+/,
      /\bint\s+\w+/,
      /Console\.Write/,
      /\bnamespace\s+/,
      /\.NET/
    ],
    php: [
      /<\?php/,
      /\$[\w]+/,
      /\bfunction\s+\w+/,
      /echo\s+/,
      /\bclass\s+\w+/,
      /\bpublic\s+\w+/,
      /\bprivate\s+\w+/,
      /require_once\s+/,
      /include_once\s+/,
      /\b$_GET\b|\b$_POST\b/
    ],
    rust: [
      /\bfn\s+\w+/,
      /\blet\s+\w+/,
      /\bmut\s+\w+/,
      /\bstruct\s+\w+/,
      /\benum\s+\w+/,
      /\bimpl\s+\w+/,
      /println!\(/,
      /\buse\s+\w+/,
      /\bcrate\s+/
    ],
    typescript: [
      /\bfunction\s+\w+\s*\(/,
      /\bconst\s+\w+\s*:\s*\w+/,
      /\blet\s+\w+\s*:\s*\w+/,
      /\binterface\s+\w+/,
      /\btype\s+\w+\s*=/,
      /\bclass\s+\w+\s+implements/,
      /\bextends\s+\w+/,
      /\bimport\s+.*from\s+['"]/,
      /\bexport\s+(default|function)/,
      /:\s*(string|number|boolean|any)/
    ],
    jsx: [
      /<\w+\s*\{/,
      /\{[\w]+\}/,
      /className=/,
      /React\.createElement/,
      /\bprops\.(\w+)/,
      /\bstate\s*=\s*\{/
    ]
  };
  
  let detectedLang = '';
  let maxScore = 0;
  
  for (const [lang, regexes] of Object.entries(patterns)) {
    let score = 0;
    regexes.forEach(function(regex) {
      if (regex.test(code)) {
        score++;
      }
    });
    if (score > maxScore) {
      maxScore = score;
      detectedLang = lang;
    }
  }
  
  return detectedLang;
}

function initCodeCopy() {
  const codeBlocks = document.querySelectorAll('div.highlighter-rouge');
  
  codeBlocks.forEach(function(block) {
    const highlightDiv = block.querySelector('div.highlight');
    if (!highlightDiv) return;
    
    const pre = highlightDiv.querySelector('pre');
    if (!pre) return;
    
    const header = document.createElement('div');
    header.className = 'code-header';
    
    const classes = block.className.split(' ');
    let language = '';
    classes.forEach(function(cls) {
      if (cls.startsWith('language-')) {
        language = cls.replace('language-', '');
      }
    });
    
    if (!language) {
      const code = pre.querySelector('code') || pre;
      language = detectLanguage(code.textContent);
    }
    
    const languageMap = {
      'javascript': 'JavaScript',
      'js': 'JavaScript',
      'typescript': 'TypeScript',
      'ts': 'TypeScript',
      'jsx': 'JSX',
      'tsx': 'TSX',
      'java': 'Java',
      'python': 'Python',
      'py': 'Python',
      'bash': 'Bash',
      'shell': 'Shell',
      'sh': 'Shell',
      'sql': 'SQL',
      'html': 'HTML',
      'css': 'CSS',
      'scss': 'SCSS',
      'sass': 'Sass',
      'xml': 'XML',
      'json': 'JSON',
      'yaml': 'YAML',
      'yml': 'YAML',
      'go': 'Go',
      'golang': 'Go',
      'ruby': 'Ruby',
      'rb': 'Ruby',
      'csharp': 'C#',
      'cs': 'C#',
      'cpp': 'C++',
      'c': 'C',
      'php': 'PHP',
      'rust': 'Rust',
      'rs': 'Rust',
      'kotlin': 'Kotlin',
      'swift': 'Swift',
      'dart': 'Dart',
      'flutter': 'Flutter',
      'vue': 'Vue',
      'angular': 'Angular',
      'dockerfile': 'Dockerfile',
      'nginx': 'Nginx',
      'markdown': 'Markdown',
      'md': 'Markdown',
      'vim': 'Vim',
      'lua': 'Lua',
      'r': 'R',
      'scala': 'Scala'
    };
    
    const displayLanguage = languageMap[language] || (language.charAt(0).toUpperCase() + language.slice(1)) || 'Code';
    
    const languageLabel = document.createElement('span');
    languageLabel.className = 'code-language';
    languageLabel.setAttribute('data-lang', language);
    languageLabel.textContent = displayLanguage;
    
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
    highlightDiv.insertBefore(header, pre);
  });
}

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
    
    requestAnimationFrame(function() {
      lightbox.classList.add('active');
    });
    
    lightbox.addEventListener('click', function(e) {
      if (e.target === lightbox || e.target.classList.contains('lightbox-overlay')) {
        closeLightbox(lightbox);
      }
    });
    
    lightbox.querySelector('.lightbox-close').addEventListener('click', function() {
      closeLightbox(lightbox);
    });
    
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