## 备忘 <!-- {docsify-ignore} -->

## Vim的使用
在使用 Vim 编辑器时，你可以通过以下步骤来修改文件内容：

启动 Vim 并打开文件：在终端中输入 vim filename（其中 "filename" 是你要编辑的文件的名字），然后按 Enter 键。这会启动 Vim 并打开指定的文件。

进入插入模式：在 Vim 的正常模式下（也就是你启动 Vim 后的默认模式），按 i 键进入插入模式。在插入模式下，你可以添加、修改文本。

修改文件内容：在插入模式下，使用键盘输入你想要的内容。你可以像在其他文本编辑器中一样移动光标、删除字符等。

退出插入模式：按 Esc 键退出插入模式并返回到正常模式。

保存修改：在正常模式下，输入 :w 然后按 Enter 键保存你的修改。

退出 Vim：在正常模式下，输入 :q 然后按 Enter 键退出 Vim。如果你在没有保存的情况下尝试退出，Vim 会警告你。此时，你可以输入 :q! 强制退出（但这样会丢失所有未保存的修改），或输入 :wq 保存修改并退出。

## macOS清除DNS缓存命令
```bash
sudo killall -HUP mDNSResponder
```
## Linux常用命令
### rsync命令

```bash
rsync -avz --progress /Users/zyy/Desktop/zyy/CODE/Github/website2/website2/docs/ root@66.135.29.181:/var/www/zhangyiyang.xyz
```

这里：
- `-a` 是“归档”模式，它保留原文件的权限和元数据，并尝试保留软链接等。
- `-v` 代表“详细模式”（verbose），这样可以看到更多的输出信息。
- `-z` 开启压缩，有助于加快传输速度。
- `--progress` 显示文件传输的进度信息。
- `/path/to/local/folder` 是您Mac上的文件夹路径。
- `username` 是您在Linux服务器上的用户名。
- `server_ip` 是您Linux服务器的IP地址。
- `/path/to/remote/folder` 是服务器上的目标文件夹路径。

`rsync` 是非常灵活的，其行为取决于你如何指定源路径和目标路径。如果您想要将整个文件夹连同文件夹本身一起复制到目标路径，需要在源路径后面加上斜杠 `/`。这里有两种情况：

1. 如果您不在源文件夹的路径后面加上斜杠 `/`，`rsync` 会复制文件夹内的内容到目标路径，而不是复制文件夹本身。

   ```bash
   rsync -av /path/to/source_folder/ /path/to/destination_folder/
   ```

   在这个例子中，`source_folder` 内的所有内容（而不是 `source_folder` 文件夹本身）会被复制到 `destination_folder` 中。

2. 如果您在源文件夹的路径后面加上斜杠 `/`，`rsync` 会复制整个文件夹到目标路径。

   ```bash
   rsync -av /path/to/source_folder /path/to/destination_folder/
   ```

   在这个例子中，`source_folder` 本身及其所有内容会被复制到 `destination_folder` 中。

### scp命令
`scp` 是 Secure Copy（安全复制）的缩写，是基于 SSH (Secure Shell) 的一种网络协议，用于在本地主机和远程主机之间，或两个远程主机之间安全地传输文件。`scp` 命令是在 Linux 和 macOS 系统中常用的一个命令行工具，也可以在 Windows 上通过某些应用程序（如 Putty）使用。

`scp` 命令的基本语法如下：

```bash
scp [options] source destination
```
其中：

- `options`：`scp` 命令的选项，例如 `-r`（递归复制目录）、`-p`（保留原文件的修改时间和访问时间）等。
- `source`：源文件路径，可以是本地路径，也可以是远程主机路径。如果是远程主机路径，其格式为 `user@host:path`。
- `destination`：目标文件路径，同样可以是本地路径，也可以是远程主机路径。如果是远程主机路径，其格式为 `user@host:path`。

例如，以下命令将本地的 `file.txt` 文件复制到远程主机：

```bash
scp file.txt user@host:/path/to/destination
```

以下命令将远程主机的 `file.txt` 文件复制到本地：

```bash
scp user@host:/path/to/file.txt /path/to/destination
```

以下命令将目录及其所有内容复制到远程主机：

```bash
scp -r /path/to/directory user@host:/path/to/destination
```

```bash
rm -r /var/www/zhangyiyang.xyz/*
scp -r /Users/zyy/Desktop/zyy/CODE/Github/website2/website2/docs/* root@66.135.29.181:/var/www/zhangyiyang.xyz
```

### 重启系统
```
sudo reboot
```

### 安装.deb文件
```
sudo apt install ./app.deb
```

## Nginx配置
目录: `/etc/nginx/sites-available/zhangyiyang.xyz`
```
server {
    listen 443 ssl;
    server_name zhangyiyang.xyz www.zhangyiyang.xyz;
    client_max_body_size 1000M;

    ssl_certificate /etc/nginx/ssl/zhangyiyang.xyz.pem;
    ssl_certificate_key /etc/nginx/ssl/zhangyiyang.xyz.key;

    # 处理 /files 路径的请求，全部代理到 Flask 应用程序
    location ^~ /files {
        proxy_pass http://127.0.0.1:5000; # 确保 Flask 应用正在运行并监听在 5000 端口
        include proxy_params;
        proxy_redirect off;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # 网站根目录的请求仍然按原来的方式处理
    location / {
        root /var/www/zhangyiyang.xyz;
        index index.html;
    }
}
```
检查Nginx服务状态:
```
sudo service nginx status

```

重新启动Nginx:
```
sudo systemctl restart nginx

```
