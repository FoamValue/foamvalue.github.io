source "https://rubygems.org"

# GitHub Pages 依赖 - 自动包含 Jekyll 和支持的插件
gem "github-pages", group: :jekyll_plugins

# Windows 和 JRuby 平台支持
platforms :mingw, :x64_mingw, :mswin, :jruby do
  gem "tzinfo", ">= 1", "< 3"
  gem "tzinfo-data"
end

# Windows 文件监控
gem "wdm", "~> 0.1", :platforms => [:mingw, :x64_mingw, :mswin]

# JRuby http_parser 支持
gem "http_parser.rb", "~> 0.6.0", :platforms => [:jruby]