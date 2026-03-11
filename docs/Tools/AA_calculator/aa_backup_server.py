from flask import Flask, request, jsonify
import os

app = Flask(__name__)

# 存储路径
SAVE_DIR = "/root/zhangyiyangxyz/files/AA_calculator/"
# 确保目录存在
os.makedirs(SAVE_DIR, exist_ok=True)

@app.route('/api/save_aa_backup', methods=['POST', 'OPTIONS'])
def save_backup():
    # 处理 CORS 预检请求 (如果前端和该接口属于同源，可以省略，但加了更稳妥)
    if request.method == 'OPTIONS':
        return '', 200, {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type'
        }
        
    try:
        # 尝试获取 JSON 数据
        data = request.get_json(silent=True)
        if not data:
            return jsonify({"status": "error", "message": "Invalid or missing JSON payload"}), 400
            
        filename = os.path.basename(data.get('filename', 'backup.csv')) # 避免路径穿越
        content = data.get('content', '')
        
        file_path = os.path.join(SAVE_DIR, filename)
        
        # 写入文件
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
            
        return jsonify({"status": "success", "message": f"Backup saved successfully"}), 200, {'Access-Control-Allow-Origin': '*'}
        
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500, {'Access-Control-Allow-Origin': '*'}

if __name__ == '__main__':
    # 监听本地 8088 端口，准备接收 Nginx 的反向代理请求
    app.run(host='127.0.0.1', port=8088, debug=True)
