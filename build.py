"""把 app.py + index.html 合并成一个自包含的 zxf.py"""
import os, base64

base = os.path.dirname(os.path.abspath(__file__))

with open(os.path.join(base, 'app.py'), 'r', encoding='utf-8') as f:
    app_code = f.read()

with open(os.path.join(base, 'static', 'index.html'), 'r', encoding='utf-8') as f:
    html_content = f.read()

# 修改 app.py 中的 send_from_directory 为直接返回 HTML
# 找到 index route 并替换
old_route = '''@app.route("/")
def index():
    return send_from_directory("static", "index.html")'''

new_route = f'''EMBEDDED_HTML = r"""{html_content}"""

@app.route("/")
def index():
    return EMBEDDED_HTML, 200, {{"Content-Type": "text/html; charset=utf-8"}}'''

app_code = app_code.replace(old_route, new_route)

# 加头部说明
header = '''"""
张雪峰智能志愿百科 v2 — 自包含版
====================================
一个文件，包含后端+前端+知识库+测评系统。

启动方法：
  1. 安装依赖：pip install flask flask-cors anthropic ddgs
  2. 运行：python zxf.py
  3. 浏览器自动打开 http://localhost:5000

或双击 启动.bat（Windows）
====================================
"""

'''

app_code = header + app_code

out_path = os.path.join(base, 'zxf.py')
with open(out_path, 'w', encoding='utf-8') as f:
    f.write(app_code)

print(f"Generated: {out_path} ({os.path.getsize(out_path)} bytes)")
