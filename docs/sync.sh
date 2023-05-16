#!/bin/bash

# 将你的文件移出版本控制
git rm --cached file.txt
echo file.txt >> .gitignore
git commit -m "temporarily remove file.txt"

# 强制同步到gitee
# 这里你需要替换为你的gitee仓库地址
git push -f https://gitee.com/zyyjyw/zyyjyw.git

# 将你的文件恢复到版本控制
git rm --cached .gitignore
sed -i '' '/file.txt/d' .gitignore
git add file.txt
git commit -m "re-add file.txt"

# 推送到GitHub
# 这里你需要替换为你的GitHub仓库地址
git push -f https://github.com/HuaJiZyy/website2.git
