from flask import Flask, request, send_from_directory 
# Flask 是主要的框架，request 用于处理请求数据，send_from_directory 用于安全地发送文件。os 模块用于与操作系统交互，例如文件路径操作。
import os

app = Flask(__name__) # 创建了一个 Flask 实例

# 设置最大上传文件大小为1000MB
app.config['MAX_CONTENT_LENGTH'] = 1000 * 1024 * 1024

# 这里设置了一个常量 UPLOAD_FOLDER，用来指定上传文件存储的文件夹名称。然后将这个路径配置到 Flask 应用的配置中，方便后续引用。
UPLOAD_FOLDER = '/home/zyy/Desktop/zyy/CODE/websites/zhangyiyang_xyz/docs/Tools/NetDisk/upload_files'
UPLOAD_FOLDER = os.path.expanduser(UPLOAD_FOLDER)  # 展开 ~ 为用户的家目录
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# 使用 os.makedirs 函数创建定义的上传文件夹，如果文件夹已经存在，则不会抛出错误（exist_ok=True 参数的作用）。
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# 定义了一个路由 /，当用户访问应用的根目录时，会调用这个 index 函数。
@app.route('/files')
def index():
    # HTML 表单允许用户上传文件到 /files/upload
    return '''
    <!doctype html>
    <title>老仓库网盘</title>
    <h1>上传文件到老仓库网盘</h1>
    <form method=post enctype=multipart/form-data action="/files/upload">
      <input type=file name=file>
      <input type=submit value=上传>
    </form>
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
        文件上传成功！<br><br>
        <a href="/files/download/{filename}">点击这里下载文件或右键复制链接地址</a>
        '''
        # 如果文件对象存在，并且文件名有效，将文件保存到之前设置的上传文件夹中。然后返回一个确认信息，并提供一个链接让用户可以下载他们刚刚上传的文件。

# 定义了一个下载路由 /download/<filename>，它使用 URL 中的 filename 参数来确定用户想要下载的文件。
@app.route('/files/download/<filename>', methods=['GET'])
def download_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename, as_attachment=True) # 这个函数调用 send_from_directory 来发送请求的文件给用户。as_attachment=True 参数使得浏览器会提示用户保存文件，而不是尝试打开它。

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True) # 这行代码告诉你的Flask应用在所有可用的IP地址上侦听，并在5000端口上运行。
