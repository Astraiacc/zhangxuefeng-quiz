@echo off
chcp 65001 >nul
echo ============================================
echo   张雪峰智能志愿百科 v2
echo ============================================
echo.
echo [1/3] 检查 Python...
python --version >nul 2>&1
if errorlevel 1 (
    echo [错误] 未找到 Python！请先安装 Python 3.8+
    echo 下载地址: https://www.python.org/downloads/
    pause
    exit /b 1
)

echo [2/3] 安装依赖...
pip install flask flask-cors anthropic ddgs -q

echo [3/3] 启动服务...
echo.
echo ============================================
echo   浏览器将自动打开 http://localhost:5000
echo   如果没有自动打开，请手动访问
echo   按 Ctrl+C 停止服务
echo ============================================
echo.

python zxf.py
pause
