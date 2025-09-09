@echo off
chcp 65001 >nul

rem CyberChef Cloudflare Pages 部署脚本 (Windows版本)
rem 作者: AI Assistant

echo 🚀 开始部署 CyberChef 到 Cloudflare Pages
echo ========================================

rem 检查 Node.js
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ 错误: 未安装 Node.js，请先安装 Node.js
    pause
    exit /b 1
)

echo ✅ Node.js 已安装
node --version

rem 检查 npm
npm --version >nul 2>&1
if errorlevel 1 (
    echo ❌ 错误: 未安装 npm
    pause
    exit /b 1
)

echo ✅ npm 已安装
npm --version

rem 安装依赖
echo 📦 安装依赖...
call npm install
if errorlevel 1 (
    echo ❌ 依赖安装失败
    pause
    exit /b 1
)

rem 构建项目（Cloudflare Pages 优化版本）
echo 🏗️ 构建项目 (Cloudflare Pages 优化版本)...
call npm run build:pages
if errorlevel 1 (
    echo ❌ 构建失败，请检查错误信息
    pause
    exit /b 1
)

rem 检查构建输出
if not exist "build\prod" (
    echo ❌ 构建输出目录不存在
    pause
    exit /b 1
)

echo ✅ 构建成功！输出目录: build\prod

rem 清理可能的大文件
echo 🧹 清理大文件...
cd build\prod

rem 删除可能的 zip 文件
for /r %%i in (*.zip) do (
    if exist "%%i" (
        del "%%i" >nul 2>&1
        echo    - 删除了 zip 文件: %%~nxi
    )
)

rem 删除分析报告文件
for /r %%i in (*Report.html) do (
    if exist "%%i" (
        del "%%i" >nul 2>&1
        echo    - 删除了报告文件: %%~nxi
    )
)

rem 删除临时文件
for /r %%i in (*.tmp) do (
    if exist "%%i" del "%%i" >nul 2>&1
)

cd ..\..

rem 显示统计信息
echo 📊 构建输出统计：
dir /s build\prod | find "个文件"
echo    构建目录: build\prod

echo.
echo 🎉 准备完成！现在你可以：
echo    1. 方法一: 在 Cloudflare Pages 控制台中设置自动部署
echo       - 构建命令: npm run build:pages
echo       - 输出目录: build/prod
echo.
echo    2. 方法二: 使用 wrangler CLI 直接部署
echo       wrangler pages deploy build/prod --project-name=cyberchef
echo.
echo 📁 构建文件位置: .\build\prod\
echo ✨ 部署完成后，你的 CyberChef 将可以在 Cloudflare Pages 上运行！
echo.
pause
