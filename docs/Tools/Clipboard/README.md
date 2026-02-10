# 云剪贴板 (Cloud Clipboard)

这是一个简单的跨设备云剪贴板工具，基于 Flask 和 HTML/JS 实现。

## 功能
- **跨设备同步**：在任何设备上打开网页即可查看和编辑内容。
- **实时保存**：点击保存后，内容存储在服务器上。
- **一键复制**：方便地将内容复制到本地剪贴板。

## 使用方法 (Run)

确保你的服务器上安装了 Python 和 Flask。

1. 进入目录：
   ```bash
   cd docs/Tools/Clipboard
   ```
2. 安装依赖：
   ```bash
   pip install flask
   ```
3. 运行服务（默认端口 5002）：
   ```bash
   python clipboard_server.py
   ```
   或者后台运行：
   ```bash
   nohup python clipboard_server.py > clipboard.log 2>&1 &
   ```

## 在线使用

如果服务已启动，可以直接访问服务器地址，或者在此处使用：

<iframe src="http://zhangyiyang.xyz:5002" width="100%" height="600" frameborder="0">
  您的浏览器不支持 iframe 标签，请直接访问 <a href="http://zhangyiyang.xyz:5002">http://zhangyiyang.xyz:5002</a>
</iframe>
