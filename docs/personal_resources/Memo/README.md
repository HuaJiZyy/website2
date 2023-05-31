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

## scp命令
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


## Nginx配置
目录: `/etc/nginx/sites-available/zhangyiyang.xyz`
```
server {
    listen 443 ssl;
    server_name zhangyiyang.xyz;

    ssl_certificate /etc/nginx/ssl/zhangyiyang.xyz.pem;
    ssl_certificate_key /etc/nginx/ssl/zhangyiyang.xyz.key;

    location / {
        root /var/www/zhangyiyang.xyz;
        index index.html;
    }
}

server {
    listen 80;
    server_name zhangyiyang.xyz;
    return 301 https://$host$request_uri;
}
```

重新启动Nginx:
```
sudo service nginx restart

```

```bash
scp -r /Users/zyy/Desktop/zyy/CODE/Github/website2/website2/docs root@66.135.29.181:/var/www/zhangyiyang.xyz
```
