# CyberChef 部署到 Cloudflare Pages 指南

## 前置要求

1. **Cloudflare 账户**: 注册 [Cloudflare](https://cloudflare.com) 账户
2. **GitHub 仓库**: 将代码推送到你的 GitHub 仓库
3. **Node.js**: 确保本地安装了 Node.js (版本 16+)

## 部署步骤

### 方法一: 通过 Cloudflare Pages 控制台 (推荐)

1. **登录 Cloudflare Dashboard**
   - 访问 https://dash.cloudflare.com
   - 登录你的账户

2. **创建 Pages 项目**
   - 点击左侧菜单 "Pages"
   - 点击 "Create a project"
   - 选择 "Connect to Git"

3. **连接 GitHub 仓库**
   - 授权 Cloudflare 访问你的 GitHub
   - 选择包含 CyberChef 代码的仓库

4. **配置构建设置**
   - **Project name**: `cyberchef` (或你喜欢的名称)
   - **Production branch**: `main` (或你的主分支)
   - **Build command**: `npm run build:pages`
   - **Build output directory**: `build/prod`
   - **Root directory**: `/` (留空或填 `/`)

5. **高级设置**
   - **Node.js version**: `18` 或 `20`
   - **Environment variables** (如果需要):
     ```
     NODE_ENV=production
     ```

6. **部署**
   - 点击 "Save and Deploy"
   - 等待构建和部署完成（约5-10分钟）

### 方法二: 使用 Wrangler CLI

1. **安装 Wrangler**
   ```bash
   npm install -g wrangler
   ```

2. **登录 Cloudflare**
   ```bash
   wrangler login
   ```

3. **本地构建**
   ```bash
   npm install
   npm run build:pages
   ```

4. **部署到 Pages**
   ```bash
   wrangler pages deploy build/prod --project-name=cyberchef
   ```

## 配置文件说明

### wrangler.toml
项目根目录已包含 `wrangler.toml` 配置文件，包含以下设置：
- 构建命令: `npm run build`
- 输出目录: `build/prod`
- 兼容性日期: 2023-10-30

### package.json 构建脚本
已优化的构建脚本：
```json
{
  "scripts": {
    "build": "npx grunt prod",
    "build:pages": "npx grunt buildPages",
    "start": "npx grunt dev"
  }
}
```

## 文件大小限制解决方案

CyberChef项目较大，标准构建会产生超过25MB限制的文件。我们已经解决了这个问题：

### 问题原因
- 标准构建（`npm run build`）会创建一个63.8MB的zip文件
- Cloudflare Pages单文件限制为25MB
- 这个zip文件是为standalone版本准备的，部署时不需要

### 解决方案
1. **使用优化构建命令**: `npm run build:pages`
   - 跳过zip文件创建
   - 去除不必要的文件
   - 保持所有核心功能

2. **如果仍有问题，可以手动清理**:
   ```bash
   npm run build:pages
   # 删除可能的大文件
   cd build/prod
   find . -name "*.zip" -delete
   find . -name "BundleAnalyzerReport.html" -delete
   ```

## 部署后验证

1. **访问你的站点**
   - Cloudflare 会提供一个 `*.pages.dev` 域名
   - 例如: `https://cyberchef-abc123.pages.dev`

2. **功能测试**
   - 测试各种加密/解密功能
   - 确保所有 JavaScript 模块正常加载
   - 验证文件上传/下载功能

3. **性能检查**
   - 使用浏览器开发者工具检查加载时间
   - 确保 Service Worker 正常工作

## 自定义域名 (可选)

1. **添加自定义域名**
   - 在 Pages 项目设置中
   - 点击 "Custom domains"
   - 添加你的域名

2. **DNS 配置**
   - 在你的域名提供商处
   - 添加 CNAME 记录指向你的 Pages 域名

## 常见问题解决

### 构建失败
```bash
# 检查 Node.js 版本
node --version

# 清理依赖并重新安装
rm -rf node_modules package-lock.json
npm install

# 本地测试构建（使用Pages优化构建）
npm run build:pages
```

### 文件大小限制错误
如果遇到 "Pages only supports files up to 25 MiB" 错误：

```bash
# 使用优化构建命令
npm run build:pages

# 或者手动清理大文件
cd build/prod
find . -name "*.zip" -size +20M -delete
find . -name "*Report.html" -delete
```

### 资源加载问题
- 确保 `build/prod` 目录包含所有必要文件
- 检查相对路径是否正确
- 验证 webpack 配置中的 `publicPath` 设置

### 性能优化建议
1. **启用 Cloudflare 缓存**
   - 在 Pages 设置中配置缓存规则
   - 为静态资源设置长期缓存

2. **压缩优化**
   - Cloudflare 自动启用 Gzip/Brotli 压缩
   - 无需额外配置

3. **CDN 优化**
   - Cloudflare 全球 CDN 自动分发
   - 就近访问减少延迟

## 更新部署

每次代码更新时：
1. 推送代码到 GitHub
2. Cloudflare Pages 自动检测变更
3. 自动触发新的构建和部署

## 支持与帮助

- [Cloudflare Pages 文档](https://developers.cloudflare.com/pages/)
- [CyberChef GitHub 仓库](https://github.com/gchq/CyberChef)
- [Wrangler CLI 文档](https://developers.cloudflare.com/workers/wrangler/)
