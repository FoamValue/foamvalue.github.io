#!/bin/bash

# FoamValue 博客本地开发启动脚本

set -e

PORT=${1:-4000}

echo "=========================================="
echo "  FoamValue Blog - Local Dev Server"
echo "=========================================="
echo ""

# 检查 Ruby 环境
if ! command -v ruby &> /dev/null; then
    echo "Error: Ruby is not installed."
    echo "Please install Ruby first: https://jekyllrb.com/docs/installation/"
    exit 1
fi

# 检查 Bundler
if ! command -v bundle &> /dev/null; then
    echo "Installing Bundler..."
    gem install bundler
fi

# 安装依赖
if [ ! -d "vendor/bundle" ]; then
    echo "Installing dependencies..."
    bundle config set --local path vendor/bundle
    bundle install
fi

echo "Starting Jekyll server on port $PORT..."
echo "URL: http://127.0.0.1:$PORT"
echo ""
echo "Press Ctrl+C to stop."
echo ""

bundle exec jekyll serve --port "$PORT"
