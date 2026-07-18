# frozen_string_literal: true

# 图片展示优化插件
# 构建时自动为文章内容中的 <img> 标签注入性能属性
# 不修改原图文件，仅在 HTML 输出层优化

module Jekyll
  # 自动为渲染后的 HTML 中的图片标签添加 loading / decoding 属性
  class ImageOptimizationGenerator < Generator
    safe true
    priority :low

    def generate(site)
      site.pages.each { |page| optimize_images(page) }
      site.posts.docs.each { |post| optimize_images(post) }
    end

    private

    def optimize_images(doc)
      return unless doc.output.is_a?(String)

      doc.output = doc.output.gsub(/<img([^>]*)>/i) do
        tag = "<img#{$1}>"
        attrs = $1

        # 跳过已有 loading="eager" 的标签（如封面图）
        next tag if attrs.include?('loading="eager"') || attrs.include?("loading='eager'")

        # 添加 loading="lazy"（如果尚未存在）
        unless attrs.include?('loading=')
          tag = tag.sub(/<img/, '<img loading="lazy"')
        end

        # 添加 decoding="async"
        unless attrs.include?('decoding=')
          tag = tag.sub(/<img/, '<img decoding="async"')
        end

        tag
      end
    end
  end

  # 保留原有 Liquid filter 供手动使用
  module ImageOptimization
    def responsive_image(img_tag, sizes = "(max-width: 768px) 100vw, 800px")
      return img_tag unless img_tag.is_a?(String) && img_tag.include?('<img')

      unless img_tag.include?('loading=')
        img_tag = img_tag.sub(/<img/, '<img loading="lazy"')
      end
      unless img_tag.include?('decoding=')
        img_tag = img_tag.sub(/<img/, '<img decoding="async"')
      end

      unless img_tag.include?('class=')
        img_tag = img_tag.sub(/<img/, '<img class="responsive-img"')
      else
        img_tag = img_tag.sub(/class="([^"]*)"/, 'class="\1 responsive-img"')
      end

      img_tag
    end

    def figure_image(src, alt = "", caption = nil)
      figure = "<figure class=\"image-figure\">\n"
      figure += "  <img src=\"#{src}\" alt=\"#{alt}\" loading=\"lazy\" decoding=\"async\" class=\"responsive-img\">\n"
      figure += "  <figcaption class=\"image-caption\">#{caption}</figcaption>\n" if caption
      figure += "</figure>"
      figure
    end
  end
end

Liquid::Template.register_filter(Jekyll::ImageOptimization)