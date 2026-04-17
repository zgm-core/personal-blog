@echo off
chcp 65001 >nul 2>&1
echo ========================================
echo       一键部署到 GitHub Pages
echo ========================================
echo.

:: 检查是否为 Git 仓库
if not exist ".git" (
    echo [错误] 当前目录不是 Git 仓库！
    pause
    exit /b 1
)

:: 创建 .nojekyll（GitHub Pages 必须）
if not exist ".nojekyll" (
    echo 正在创建 .nojekyll...
    (echo.) > ".nojekyll"
)

:: 询问提交信息
echo.
set /p commitMsg="请输入提交信息（直接回车使用默认）: "
if "%commitMsg%"=="" set commitMsg=更新博客

:: 暂存文件
echo.
echo [1/4] 正在添加文件...
git add app/ components/ layouts/ css/ data/ *.ts *.js *.json *.mjs .github/ public/ scripts/ .gitignore .nojekyll

:: 检查是否有变更
git diff --staged --quiet
if %errorlevel% equ 0 (
    echo [提示] 没有需要提交的变更！
    pause
    exit /b 0
)

:: 提交
echo.
echo [2/4] 正在提交...
git commit -m "%commitMsg%"

:: 推送
echo.
echo [3/4] 正在推送到 GitHub...
git push origin main

echo.
echo ========================================
echo [完成] 部署已触发！
echo.
echo 请等待 1-2 分钟后访问:
echo https://zgm-core.github.io/personal-blog
echo.
echo 查看部署状态:
echo https://github.com/zgm-core/personal-blog/actions
echo ========================================
echo.
pause
