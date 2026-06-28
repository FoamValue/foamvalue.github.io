source "https://rubygems.org"

gem "jekyll", "~> 4.3"
gem "minima", "~> 2.5"

group :jekyll_plugins do
  gem "jekyll-feed"
  gem "jekyll-sitemap"
  gem "jekyll-seo-tag"
  gem "jekyll-paginate"
end

# Windows 和 JRuby 平台
platforms :mingw, :x64_mingw, :mswin, :jruby do
  gem "tzinfo", ">= 1", "< 3"
  gem "tzinfo-data"
end

# 在 Windows 上监控文件变化
gem "wdm", "~> 0.1", :platforms => [:mingw, :x64_mingw, :mswin]

# 锁定 http_parser.rb 版本
gem "http_parser.rb", "~> 0.6.0", :platforms => [:jruby]
