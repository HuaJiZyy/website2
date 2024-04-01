## Mac上ClashX快捷键配置方法 <!-- {docsify-ignore} -->

!> 2023.6.3 更新: Mac版ClashX Pro已支持全局快捷键, 无需额外配置!

> 通过本方法, 可以实现在Mac上通过AppleScript实现了系统级快捷键开启/关闭ClashX代理, 以及全局/规则代理模式的切换.

## AppleScript简介

AppleScript是Apple公司的一种脚本语言，用于自动化Mac OS操作系统及其各种应用程序的任务。它允许用户创建脚本来自动执行一系列的命令，这些命令可以控制和协调软件应用程序的行为，以完成更复杂的任务。AppleScript的语法设计成了类似自然语言的样式，主要是英语，这使得AppleScript脚本通常更易于阅读和理解。它采用面向对象的设计，其中许多系统和应用程序功能都被封装在对象中。

例如，你可以编写一个AppleScript脚本，该脚本打开一个指定的电子邮件客户端，创建一封新的电子邮件，输入收件人、主题和正文，然后发送它。或者，你可以编写一个脚本来批量修改文件名，自动备份文件，甚至控制媒体播放。

总的来说，AppleScript是一种强大的工具，用于在Mac OS系统上自动化任务和增强生产力。
在AppleScript中，tell语句是一种非常重要的控制结构，它允许你向特定的应用程序或对象发送命令或请求信息。

tell语句的基本结构如下：
```AppleScript
tell application "ApplicationName"
    -- Your commands here
end tell
```
在这个结构中，ApplicationName是你想要交互的应用程序的名称。在tell和end tell之间的部分是你想要应用程序执行的命令。

比如，你想要让Finder打开一个新窗口，你可以这样写：
```AppleScript
tell application "Finder"
    make new Finder window
end tell
```
> 看不懂代码? 没关系, 下面手把手介绍Mac上添加ClashX快捷键的方法:

## 新建AppleScript
- 在Launchpad(启动台)中找到Automator应用程序并打开. Automator程序图标如下:  
![img](1.png ':size=10%')

- 左上任务栏File-New, 选择Quick Action;  
![img](2.png ':size=60%')

- 在"Workflow receives"下拉选项框中, 选择"no input", 表示本服务不需要输入;  
![img](3.png ':size=55%')

- 在搜索栏中搜索"Run AppleScript"并双击, 添加一个AppleScript到此新建的文件中;  
![img](4.png ':size=30%')

- 在代码窗口中输入所需的AppleScript代码(具体内容见[下一部分](https://zhangyiyang.xyz/#/eat_drink_play_laugh/AppleScript/?id=clashx%E7%9A%84applescript%E4%BB%A3%E7%A0%81)). 这里以Clash开启/关闭代理的代码为例:  
![img](5.png ':size=60%')
- `command` + `s`保存此文件, 添加一个自定义命名即可.

## 添加至系统快捷键
- 在System Settings(系统设置) -> Keyboard -> Keyboard Shortcuts -> Services -> General 中勾选所需的服务并自定义一个系统级快捷键即可.
![img](6.png ':size=60%')

## ClashX的AppleScript代码

开启/关闭代理:
```AppleScript
on run {input, parameters}
    (* Your script goes here *)
    tell application "ClashX Pro"
        toggleProxy
        reopen
        activate
    end tell
end run
```

设置代理模式为Rule(规则):
```AppleScript
on run {input, parameters}
	(* Your script goes here *)
	tell application "ClashX"
		activate
		proxyMode("rule") 
	end tell
end run
```

设置代理模式为Global(全局):
```AppleScript
on run {input, parameters}
	(* Your script goes here *)
	tell application "ClashX"
		activate
		proxyMode("global") 
	end tell
end run
```


!> 以上做法的瑕疵之处:  
    1. 无法直接在桌面使用快捷键, 你需要进入任意程序中才能启动快捷键;  
    2. 在任何程序中第一次启用该快捷键都要点击一次确认授权才能启动快捷键.  
    3. 系统级快捷键可能和应用内快捷键发生冲突, 而前者的优先级低于后者.
    
>   以上过程基于Macos Ventura 13.1.  
    参考资料: https://github.com/yichengchen/clashX/blob/master/Shortcuts.md