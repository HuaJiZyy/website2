from flask import Flask, request, jsonify
import os
import random
import string

app = Flask(__name__)

# 设置数据存储目录为 ~/zhangyiyangxyz/files/clipboard_data
DATA_DIR_PATH = os.path.expanduser('~/zhangyiyangxyz/files/clipboard_data')

# 确保数据目录存在
if not os.path.exists(DATA_DIR_PATH):
    os.makedirs(DATA_DIR_PATH, exist_ok=True)

HTML_CONTENT = """
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>在线剪贴板</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; max-width: 900px; margin: 0 auto; padding: 20px; background-color: #f4f4f9; }
        .container { background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.1); }
        h1 { margin-top: 0; color: #333; text-align: center; }
        .input-group { display: flex; gap: 10px; margin-bottom: 20px; align-items: center; justify-content: center; }
        .input-group input { padding: 10px; border: 1px solid #ddd; border-radius: 4px; font-size: 16px; width: 120px; text-align: center; letter-spacing: 2px;}
        textarea { width: 100%; box-sizing: border-box; height: 300px; max-height: 50vh; margin-bottom: 20px; padding: 15px; font-size: 16px; border: 1px solid #ddd; border-radius: 4px; resize: none; font-family: monospace;}
        .btn-container { display: flex; gap: 10px; flex-wrap: wrap; align-items: center; justify-content: center; }
        button { padding: 10px 20px; font-size: 16px; cursor: pointer; border: none; border-radius: 4px; transition: background 0.3s; }
        button.primary { background-color: #007bff; color: white; }
        button.primary:hover { background-color: #0056b3; }
        button.secondary { background-color: #6c757d; color: white; }
        button.secondary:hover { background-color: #545b62; }
        button.success { background-color: #28a745; color: white; }
        button.success:hover { background-color: #218838; }
        #status { margin-top: 10px; color: #666; font-size: 14px; text-align: center; display: block; height: 20px;}
        .code-display { font-size: 1.2em; font-weight: bold; color: #d9534f; margin: 0 5px; }
        .help-text { text-align: center; color: #888; margin-bottom: 10px; font-size: 0.9em; }
    </style>
</head>
<body>
    <div class="container">
        <h1>在线剪贴板</h1>
        
        <div class="help-text">输入取件码提取内容，或输入内容点击保存生成取件码</div>

        <div class="input-group">
            <input type="text" id="code-input" placeholder="取件码..." maxlength="4">
            <button class="primary" onclick="retrieveContent()">提取内容</button>
        </div>

        <textarea id="content" placeholder="在此输入内容..."></textarea>
        
        <div class="btn-container">
            <button class="success" onclick="saveContent()">保存并生成取件码</button>
            <button class="secondary" onclick="copyContent()">复制</button>
            <button class="secondary" onclick="clearContent()">清空</button>
        </div>
        <span id="status">Ready</span>
    </div>
    <script>
        const API_URL = '/clipboard/api';

        async function retrieveContent() {
            const code = document.getElementById('code-input').value.trim();
            if (!code) {
                showStatus('请先输入取件码', true);
                return;
            }
            showStatus('正在提取...', false);
            try {
                const res = await fetch(`${API_URL}?code=${code}`);
                const data = await res.json();
                if (res.ok && data.found) {
                    document.getElementById('content').value = data.content;
                    showStatus('🥰提取成功', true);
                } else {
                    showStatus('未找到该取件码的内容', true);
                }
            } catch (e) {
                console.error(e);
                showStatus('连接失败', true);
            }
        }

        async function saveContent() {
            const content = document.getElementById('content').value;
            if (!content) {
                showStatus('内容不能为空', true);
                return;
            }
            showStatus('正在保存...', false);
            try {
                const res = await fetch(API_URL, {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({content})
                });
                const data = await res.json();
                if (data.status === 'success') {
                    document.getElementById('code-input').value = data.code;
                    showStatus(`🥰保存成功! 取件码: ${data.code}`, false); 
                    alert(`🥰保存成功！\\n取件码：${data.code}`);
                } else {
                    showStatus('保存失败', true);
                }
            } catch (e) {
                console.error(e);
                showStatus('保存失败', true);
            }
        }

        function copyContent() {
            const copyText = document.getElementById("content");
            copyText.select();
            copyText.setSelectionRange(0, 99999); 
            
            navigator.clipboard.writeText(copyText.value).then(() => {
                showStatus('已复制', true);
            }, (err) => {
                showStatus('复制失败', true);
            });
        }
        
        function clearContent() {
            document.getElementById("content").value = '';
            document.getElementById("code-input").value = '';
            showStatus('已清空', true);
        }

        let timeoutId;
        function showStatus(msg, autoHide) {
            const el = document.getElementById('status');
            el.innerText = msg;
            if (timeoutId) clearTimeout(timeoutId);
            if (autoHide) {
                timeoutId = setTimeout(() => el.innerText = '', 5000);
            }
        }
    </script>
</body>
</html>
"""

def generate_code():
    """生成不重复的4位数字代码"""
    while True:
        code = ''.join(random.choices(string.digits, k=4))
        if not os.path.exists(os.path.join(DATA_DIR_PATH, f"{code}.txt")):
            return code

@app.route('/clipboard/')
def index():
    return HTML_CONTENT

@app.route('/clipboard/api', methods=['GET'])
def get_clipboard():
    code = request.args.get('code')
    if not code:
        return jsonify({"found": False, "message": "No code provided"}), 400
    
    # 安全检查：确保 code 只是文件名，不包含路径遍历字符
    safe_code = os.path.basename(code)
    file_path = os.path.join(DATA_DIR_PATH, f"{safe_code}.txt")
    
    if os.path.exists(file_path):
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
            return jsonify({"found": True, "content": content})
        except Exception as e:
            return jsonify({"found": False, "message": str(e)}), 500
    else:
        return jsonify({"found": False, "message": "Code not found"}), 404

@app.route('/clipboard/api', methods=['POST'])
def update_clipboard():
    data = request.json
    content = data.get('content', '')
    if not content:
        return jsonify({"status": "error", "message": "Empty content"}), 400
    
    try:
        code = generate_code()
        file_path = os.path.join(DATA_DIR_PATH, f"{code}.txt")
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        return jsonify({"status": "success", "code": code})
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

if __name__ == '__main__':
    # 默认运行在 5002 端口，避免与其他服务冲突
    app.run(host='0.0.0.0', port=5002)
