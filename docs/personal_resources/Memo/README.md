## 备忘 <!-- {docsify-ignore} -->

## Vim的使用
### 如何编辑文件
进入插入模式：在 Vim 的正常模式下（也就是你启动 Vim 后的默认模式），按 i 键进入插入模式。在插入模式下，你可以添加、修改文本。

退出插入模式：按 Esc 键退出插入模式并返回到正常模式。

保存修改：在正常模式下，输入 :w 然后按 Enter 键保存你的修改。

退出 Vim：在正常模式下，输入 :q 然后按 Enter 键退出 Vim。如果你在没有保存的情况下尝试退出，Vim 会警告你。此时，你可以输入 :q! 强制退出（但这样会丢失所有未保存的修改），或输入 :wq 保存修改并退出。

### 可视行模式
在 Vim 中，可视行模式(Visual Line mode)用于选择（或者说高亮）文本。

在正常模式下按 `v` 键，Vim 会进入可视行模式。在这个模式下，你可以使用光标移动命令（例如 `h`、`j`、`k`、`l`(上下左右)、`0`(行首)、`$`(行尾)、`gg`(文件首)、`G`(文件尾) 等）来选择文本。你选择的文本会被高亮显示。例如, `gg + V + G`可实现全选操作。

在可视行模式下，你可以进行一些操作，例如复制（`y`/`yy`(复制一整行)）、剪切（`d`/`dd`(剪切一整行)）、粘贴（`p`）、改变大小写（`~`）、搜索（`/` 或 `?`）等。

例如，如果你想复制当前行到下一行，你可以在正常模式下按 `V` 进入可视行模式，然后按 `y` 复制选择的行，最后按 `p` 粘贴复制的行。

> 撤销`u`, 重做`control + r`

## Linux常用命令

### 进程管理
搜索进程   
`ps -A | grep QQ`  
杀死进程  
`kill pid` 或 `kill -9 pid`

### chmod
`chmod` 是 Unix 和 Unix-like 操作系统（包括 Linux, macOS）中的一个命令，用于改变文件或目录的权限。`chmod` 是 "change mode" 的缩写。

在 macOS 中，你可以使用 `chmod` 命令来设置文件或目录的读（r）、写（w）和执行（x）权限。权限可以应用于文件/目录的所有者（u）、所属组（g）和其他用户（o）。

`chmod` 命令的基本语法是：

```bash
chmod [options] mode file
```

其中，`mode` 可以是数字（例如 `755`）或符号（例如 `u+x`）。

- 数字模式：每个数字代表一个权限集，第一个数字代表所有者的权限，第二个数字代表组的权限，第三个数字代表其他用户的权限。每个数字是 0-7 之间的一个数，代表三种权限（读、写、执行）的组合。例如，`7`（即 `4+2+1`）代表读、写、执行权限，`6`（即 `4+2`）代表读、写权限，`5`（即 `4+1`）代表读、执行权限。

- 符号模式：`u`、`g` 和 `o` 分别代表所有者、组和其他用户，`+`、`-` 和 `=` 分别代表添加、删除和设置权限，`r`、`w` 和 `x` 分别代表读、写和执行权限。例如，`u+x` 代表给所有者添加执行权限，`g-w` 代表删除组的写权限，`o=r` 代表设置其他用户的权限为只读。

例如，如果你想给一个文件添加执行权限，你可以使用以下命令：

```bash
chmod +x filename
```

如果你想设置一个文件的权限为所有者读写执行、组和其他用户只读，你可以使用以下命令：

```bash
chmod 744 filename
```

请注意，改变文件或目录的权限可能会影响你和其他用户对文件或目录的访问，所以在使用 `chmod` 命令时需要谨慎。

### rsync

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

### scp
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

## macOS查看SSH密钥的方法
通过以下步骤来检查系统是否已经有 SSH key：

1. 打开 Terminal。

2. 输入以下命令：

```bash
ls -al ~/.ssh
```

这个命令会列出你的 `~/.ssh` 目录下的所有文件。如果你看到 `id_rsa.pub`（或者类似 `id_ed25519.pub` 的文件），那么你的系统已经有 SSH key。如果没有这些文件，那么你需要生成新的 SSH key。

如果你已经有 SSH key，你可以使用 `cat` 命令查看你的公钥：

```bash
cat ~/.ssh/id_rsa.pub
```

然后复制输出的内容，粘贴到你需要使用 SSH key 的服务中。

## macOS清除DNS缓存命令
```bash
sudo killall -HUP mDNSResponder

```

## macOS终端快捷键
`control + A` 光标移至行首
`control + E` 光标移至行尾
