# frozen_string_literal: true

# 图片优化插件
# 自动为文章中的图片添加响应式支持和懒加载

module Jekyll
  module ImageOptimization
    def responsive_image(img_tag, sizes = "(max-width: 768px) 100vw, 800px")
      return img_tag unless img_tag.is_a?(String) && img_tag.include?('<img')
      
      # 添加 loading="lazy" 属性
      unless img_tag.include?('loading=')
        img_tag = img_tag.sub(/<img/, '<img loading="lazy"')
      end
      
      # 添加响应式图片类
      unless img_tag.include?('class=')
        img_tag = img_tag.sub(/<img/, '<img class="responsive-img"')
      else
        img_tag = img_tag.sub(/class="([^"]*)"/, 'class="\1 responsive-img"')
      end
      
      img_tag
    end
    
    def figure_image(src, alt = "", caption = nil)
      figure = "<figure class=\"image-figure\">\n"
      figure += "  <img src=\"#{src}\" alt=\"#{alt}\" loading=\"lazy\" class=\"responsive-img\">\n"
      figure += "  <figcaption class=\"image-caption\">#{caption}</figcaption>\n" if caption
      figure += "</figure>"
      figure
    end
  end
end

Liquid::Template.register_filter(Jekyll::ImageOptimization)
