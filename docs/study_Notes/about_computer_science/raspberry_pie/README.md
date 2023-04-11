# 树莓派 zero 2 w 配置过程

!> 此网页正在装修中, 请稍候!

2023.2 在闲鱼购入了一台树莓派zero 2 w. 其性能和树莓派3B相近, 但是扩展接口极少, 只有两个过时的micro USB接口, 一个mini HDMI(甚至不是标准HDMI)接口. 手边既没有屏幕也没有蓝牙键鼠, 只能在完全无线的情况下配置.

首先, 需要一个SD卡做硬盘, 不低于8GB即可. 在电脑(以Mac为例)上安装[Raspberry Pi Imager]( https://www.raspberrypi.com/software/)后, 即可进行系统的烧录.

打开Imager软件, 首先选择系统:  
![img](1.png ':size=60%')  
首次使用建议选择带图形化界面的Raspberry OS, 即使没有显示器, 后续也可以使用VNC Viewer无线显示, 并且带图形化界面的OS兼容不带界面的OS.
如果不需要图形界面, 也可以烧录Lite版系统:  
![img](2.png ':size=40%')

选好系统和要烧录的SD卡路径后, 不要急于烧录, 一定要在右下角配置栏中进行初始化配置. 点击设置按钮, 界面如下:  
![img](3.png ':size=40%')

Set hostname 这里可以把主机名称设置为raspberrypi, 便于后续SSH连接.  
Enable SSH 这里可以先不勾选.  
Set username and password 这里一定要勾选, 后面SSH连接验证需要用.  
Configure wireless LAN 配置Wi-Fi用的, 可以先不勾选.  
Set locale settings 设置时区和键盘布局, 时区可以选上海, 键盘布局选US即可.  

后面还有三个勾选框, 保持默认即可.
配置结束后可以按"Write"按钮, 开始烧录. 等待一段时间, 树莓派所需的系统会自动烧录进SD卡中. 
烧录结束后, 我们来手动配置一下刚才没有配置的SSH和Wi-Fi. 在**SD卡根目录**下新建一个名为SSH的文件(不需要后缀名, 也不需要任何内容), (MacOS可以在终端用touch命令创建). 

以及一个名为`wpa_supplicant.conf`的文件, 用于树莓派启动时连接预设好的Wi-Fi. 文件内容为:
```
country=CN
ctrl_interface=DIR=/var/run/wpa_supplicant GROUP=netdev
update_config=1

network={
ssid="Wi-Fi名1"
psk="密码"
key_mgmt=WPA-PSK
priority=1
}

network={
ssid="Wi-Fi名2"
psk="密码"
key_mgmt=WPA-PSK
priority=10
}
```
其中, Wi-Fi名和密码替换为需要连接的Wi-Fi. `priority`项是一个正整数值, 代表连接的优先级.

这两个文件写好以后, 就可以在电脑端弹出SD卡了, 插入到树莓派后, 给树莓派上电, 等待几分钟, 它会自动启动系统. 你可以在路由器的设置页面查看Raspberry pi是否已经连接了Wi-Fi.

连接好网络后, 就可以进行SSH连接了. SSH连接的目的是在电脑命令行上对树莓派进行控制.


然后, 需要在树莓派上安装VNC Server, 在需要当显示屏的设备上安装VNC Viewer.








- 关机命令 sudo poweroff