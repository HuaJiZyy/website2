from flask import Flask, request, send_from_directory 
# Flask 是主要的框架，request 用于处理请求数据，send_from_directory 用于安全地发送文件。os 模块用于与操作系统交互，例如文件路径操作。
import os

app = Flask(__name__) # 创建了一个 Flask 实例

# 设置最大上传文件大小为1000MB
app.config['MAX_CONTENT_LENGTH'] = 2000 * 1024 * 1024

# 这里设置了一个常量 UPLOAD_FOLDER，用来指定上传文件存储的文件夹名称。然后将这个路径配置到 Flask 应用的配置中，方便后续引用。
UPLOAD_FOLDER = '~/zhangyiyangxyz/files/netdisk'
UPLOAD_FOLDER = os.path.expanduser(UPLOAD_FOLDER)  # 展开 ~ 为用户的家目录
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# 使用 os.makedirs 函数创建定义的上传文件夹，如果文件夹已经存在，则不会抛出错误（exist_ok=True 参数的作用）。
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# 定义了一个路由 /，当用户访问应用的根目录时，会调用这个 index 函数。
@app.route('/files')
def index():
    return '''
    <!DOCTYPE html>
    <html lang="zh-CN">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>老仓库网盘</title>
        <style>
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; max-width: 900px; margin: 0 auto; padding: 20px; background-color: #f4f4f9; }
            .container { background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.1); text-align: center; }
            h1 { margin-top: 0; color: #333; margin-bottom: 10px; }
            .help-text { color: #888; margin-bottom: 25px; font-size: 0.95em; }
            .upload-form { display: flex; flex-direction: column; align-items: center; gap: 20px; }
            input[type="file"] { border: 1px solid #ddd; padding: 10px; border-radius: 4px; width: 100%; max-width: 300px; cursor: pointer; }
            input[type="submit"] { padding: 10px 20px; font-size: 16px; cursor: pointer; border: none; border-radius: 4px; transition: background 0.3s; background-color: #007bff; color: white; width: 100%; max-width: 322px; font-weight: bold; }
            input[type="submit"]:hover { background-color: #0056b3; }
            #uploading { margin-top: 15px; color: #666; font-size: 14px; }
        </style>
        <script>
            function onUpload() {
                var fileInput = document.getElementById('file-input');
                if (!fileInput.value) {
                    alert('请先选择需要上传的文件');
                    return false;
                }
                document.getElementById('submit').style.display = 'none';
                document.getElementById('uploading').style.display = 'block';
                return true;
            }
        </script>
    </head>
    <body>
        <div class="container">
            <h1>老仓库网盘</h1>
            <div class="help-text">一个链接, 轻松分享文件</div>
            <form class="upload-form" method=post enctype=multipart/form-data action="/files/upload" onsubmit="return onUpload()">
                <input id="file-input" type=file name=file>
                <input id="submit" type=submit value="立即上传">
                <p id="uploading" style="display: none;">文件正在上传，不许离开哦!</p>
            </form>
        </div>
    </body>
    </html>
    '''

# 这个函数返回一个 HTML 表单的字符串。表单包含了一个文件输入和一个提交按钮。当用户填写这个表单并提交时，请求会被发送到 /upload 路径。

# 定义了一个新的路由 /upload，这个路由只接受 POST 方法，用于处理前面表单提交的文件上传请求。
@app.route('/files/upload', methods=['POST'])
def upload_file():
    # 检查是否有文件在请求中
    if 'file' not in request.files:
        return '没有文件部分'
        # 检查请求中是否包含文件。如果 request.files 字典中没有 file 键，意味着没有文件被上传，将返回一个错误消息。
    file = request.files['file'] # 从请求中获取上传的文件对象。
    # 如果用户没有选择文件，浏览器也会提交一个没有文件名的空部分
    if file.filename == '':
        return '没有选择文件' # 如果文件对象存在但没有文件名，意味着用户提交了一个空表单，返回一个错误消息。
    if file:
        filename = file.filename
        file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
        return f'''
        <!DOCTYPE html>
        <html lang="zh-CN">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>上传成功 - 老仓库网盘</title>
            <style>
                body {{ font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; max-width: 900px; margin: 0 auto; padding: 20px; background-color: #f4f4f9; }}
                .container {{ background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.1); text-align: center; }}
                h1 {{ margin-top: 0; color: #28a745; margin-bottom: 5px; }}
                .subtitle {{ color: #666; margin-bottom: 25px; }}
                .link-box {{ margin: 20px auto; padding: 15px; background: #f8f9fa; border: 1px solid #ddd; border-radius: 4px; word-break: break-all; max-width: 600px; }}
                .link-box a {{ color: #007bff; text-decoration: none; font-size: 16px; }}
                .link-box a:hover {{ text-decoration: underline; }}
                .btn-container {{ display: flex; gap: 15px; flex-wrap: wrap; justify-content: center; margin-top: 30px; }}
                button {{ padding: 10px 20px; font-size: 16px; cursor: pointer; border: none; border-radius: 4px; transition: background 0.3s; }}
                .primary {{ background-color: #007bff; color: white; }}
                .primary:hover {{ background-color: #0056b3; }}
                .secondary {{ background-color: #6c757d; color: white; }}
                .secondary:hover {{ background-color: #545b62; }}
                .back-link {{ display: inline-block; margin-top: 25px; color: #666; text-decoration: none; font-size: 14px; }}
                .back-link:hover {{ text-decoration: underline; color: #333; }}
            </style>
        </head>
        <body>
            <div class="container">
                <h1> 🥰文件上传成功！</h1>
                <div class="subtitle">您的文件已安全存储</div>
                
                <div class="link-box">
                    <a href="/files/download/{filename}">https://zhangyiyang.xyz/files/download/{filename}</a>
                </div>
                
                <div class="btn-container">
                    <button class="primary" onclick="window.location.href='/files/download/{filename}'">立即下载</button>
                    <button class="secondary" id="copy-btn" onclick="copyLink()">复制分享链接</button>
                </div>

                <a href="/files" class="back-link">← 返回继续上传其他文件</a>
            </div>

            <script>
                function copyLink() {{
                    const link = 'https://zhangyiyang.xyz/files/download/{filename}';
                    navigator.clipboard.writeText(link).then(() => {{
                        const btn = document.getElementById('copy-btn');
                        const originalText = btn.innerText;
                        btn.innerText = '已复制！';
                        btn.style.backgroundColor = '#28a745'; // success color
                        
                        setTimeout(() => {{
                            btn.innerText = originalText;
                            btn.style.backgroundColor = '';
                        }}, 5000);
                    }}).catch(err => {{
                        alert('复制失败，请手动复制链接');
                    }});
                }}
            </script>
        </body>
        </html>
        '''
        # 如果文件对象存在，并且文件名有效，将文件保存到之前设置的上传文件夹中。然后返回一个确认信息，并提供一个链接让用户可以下载他们刚刚上传的文件。

# 定义了一个展示下载页面的路由 /download/<filename>，让用户点击按钮再下载。
@app.route('/files/download/<filename>', methods=['GET'])
def download_page(filename):
    return f'''
    <!DOCTYPE html>
    <html lang="zh-CN">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>下载文件 - 老仓库网盘</title>
        <style>
            body {{ font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; max-width: 900px; margin: 0 auto; padding: 20px; background-color: #f4f4f9; }}
            .container {{ background: white; padding: 40px 30px; border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.1); text-align: center; }}
            h1 {{ margin-top: 0; color: #333; margin-bottom: 20px; font-size: 24px; }}
            .file-box {{ margin: 20px auto; padding: 20px; background: #e9ecef; border: 1px dashed #ced4da; border-radius: 6px; display: inline-block; min-width: 250px; max-width: 100%; word-break: break-all; }}
            .filename {{ font-weight: bold; font-size: 18px; color: #495057; }}
            .btn-container {{ display: flex; gap: 15px; flex-wrap: wrap; justify-content: center; margin-top: 30px; }}
            button {{ padding: 12px 30px; font-size: 18px; cursor: pointer; border: none; border-radius: 4px; transition: background 0.3s; font-weight: bold; }}
            .primary {{ background-color: #28a745; color: white; }}
            .primary:hover {{ background-color: #218838; box-shadow: 0 4px 8px rgba(40,167,69,0.3); }}
            .home-link {{ display: inline-block; margin-top: 30px; color: #6c757d; text-decoration: none; font-size: 14px; transition: color 0.2s; }}
            .home-link:hover {{ color: #343a40; text-decoration: underline; }}
        </style>
    </head>
    <body>
        <div class="container">
            <h1>📦 即将下载文件</h1>
            
            <div class="file-box">
                <div class="filename">{filename}</div>
            </div>
            
            <div class="btn-container">
                <button class="primary" onclick="window.location.href='/files/download_file/{filename}'">点击下载</button>
            </div>

            <a href="/files" class="home-link">← 返回网盘首页</a>
        </div>
    </body>
    </html>
    '''

# 这个路由真正负责把物理文件作为附件发送给用户
@app.route('/files/download_file/<filename>', methods=['GET'])
def send_download_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename, as_attachment=True)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True) # 这行代码告诉你的Flask应用在所有可用的IP地址上侦听，并在5000端口上运行。
