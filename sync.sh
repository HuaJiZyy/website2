
#!/bin/bash

# 你的 Gitee 和 GitHub 仓库地址
GITEE_REPO="https://gitee.com/zyyjyw/zyyjyw.git"
GITHUB_REPO="https://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@github.com/HuaJiZyy/website2.git"

# 你想要跳过的文件
FILE_TO_SKIP="README.md"

# 切换到 Gitee 分支，如果不存在则创建
git checkout -B gitee

# 强制同步 Gitee 仓库
git pull --allow-unrelated-histories "${GITEE_REPO}" main --no-edit
git push "${GITHUB_REPO}" gitee --force

# 切换回 GitHub 主分支
git checkout main

# 移除想要跳过的文件
git rm --cached "${FILE_TO_SKIP}"
echo "${FILE_TO_SKIP}" >> .gitignore

# 推送更改到 GitHub
git commit -m "remove ${FILE_TO_SKIP}"
git push "${GITHUB_REPO}" main

# 切换到 Gitee 分支
git checkout gitee

# 移除 .gitignore 文件
git rm --cached .gitignore
rm .gitignore

# 添加回跳过的文件
git checkout "${GITHUB_REPO}" main -- "${FILE_TO_SKIP}"
git commit -m "re-add ${FILE_TO_SKIP}"

# 推送更改到 Gitee
git push "${GITEE_REPO}" main --force

# 切换回 GitHub 主分支
git checkout main

git push origin main

