from flask import Flask, request, jsonify, send_file
import os
import random
import string

app = Flask(__name__)

# 获取当前脚本所在目录
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# 设置数据存储目录为 ~/zhangyiyangxyz/files/clipboard_data
DATA_DIR_PATH = os.path.expanduser('~/zhangyiyangxyz/files/clipboard_data')

# 确保数据目录存在
if not os.path.exists(DATA_DIR_PATH):
    os.makedirs(DATA_DIR_PATH, exist_ok=True)

def generate_code():
    """生成不重复的4位数字代码"""
    while True:
        code = ''.join(random.choices(string.digits, k=4))
        if not os.path.exists(os.path.join(DATA_DIR_PATH, f"{code}.txt")):
            return code

@app.route('/clipboard/')
def index():
    return send_file(os.path.join(BASE_DIR, 'clipboard.html'))

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
