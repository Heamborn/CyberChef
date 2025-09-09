#!/bin/bash

# CyberChef Cloudflare Pages 部署脚本
# 作者: AI Assistant

echo "🚀 开始部署 CyberChef 到 Cloudflare Pages"
echo "========================================"

# 检查 Node.js
if ! command -v node &> /dev/null; then
    echo "❌ 错误: 未安装 Node.js，请先安装 Node.js"
    exit 1
fi

echo "✅ Node.js 版本: $(node --version)"

# 检查 npm
if ! command -v npm &> /dev/null; then
    echo "❌ 错误: 未安装 npm"
    exit 1
fi

echo "✅ npm 版本: $(npm --version)"

# 安装依赖
echo "📦 安装依赖..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ 依赖安装失败"
    exit 1
fi

# 构建项目（Cloudflare Pages 优化版本）
echo "🏗️ 构建项目 (Cloudflare Pages 优化版本)..."
npm run build:pages

if [ $? -ne 0 ]; then
    echo "❌ 构建失败，请检查错误信息"
    exit 1
fi

# 检查构建输出
if [ ! -d "build/prod" ]; then
    echo "❌ 构建输出目录不存在"
    exit 1
fi

echo "✅ 构建成功！输出目录: build/prod"

# 清理可能的大文件
echo "🧹 清理大文件..."
cd build/prod

# 删除可能的 zip 文件（超过 20MB）
find . -name "*.zip" -size +20M -delete 2>/dev/null
echo "   - 删除了大型 zip 文件"

# 删除分析报告文件
find . -name "*Report.html" -delete 2>/dev/null
echo "   - 删除了分析报告文件"

# 删除可能的临时文件
find . -name "*.tmp" -delete 2>/dev/null
find . -name ".DS_Store" -delete 2>/dev/null

cd ../..

# 显示文件大小统计
echo "📊 构建输出统计："
echo "   目录大小: $(du -sh build/prod | cut -f1)"
echo "   文件数量: $(find build/prod -type f | wc -l)"

# 检查大文件
echo "🔍 检查大文件 (>20MB)："
large_files=$(find build/prod -type f -size +20M)
if [ -z "$large_files" ]; then
    echo "   ✅ 没有发现大于 20MB 的文件"
else
    echo "   ⚠️ 发现大文件:"
    find build/prod -type f -size +20M -exec ls -lh {} \;
    echo "   这些文件可能会导致部署失败"
fi

echo ""
echo "🎉 准备完成！现在你可以："
echo "   1. 方法一: 在 Cloudflare Pages 控制台中设置自动部署"
echo "      - 构建命令: npm run build:pages"
echo "      - 输出目录: build/prod"
echo ""
echo "   2. 方法二: 使用 wrangler CLI 直接部署"
echo "      wrangler pages deploy build/prod --project-name=cyberchef"
echo ""
echo "📁 构建文件位置: ./build/prod/"
echo "✨ 部署完成后，你的 CyberChef 将可以在 Cloudflare Pages 上运行！"
