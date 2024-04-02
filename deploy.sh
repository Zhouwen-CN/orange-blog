#!/usr/bin/env sh

# 确保脚本抛出遇到的错误
set -e

# 构建项目
pnpm run docs:build

# 获取最近的两次提交的父提交的哈希值  
parent_commit=$(git log --pretty=format:'%H' -n 2 | tail -n 1)  
  
# 检查是否找到了父提交  
if [ -z "$parent_commit" ]; then  
    echo "没有找到最近的两次提交的父提交"  
    exit 1  
fi  

# 重置到父提交  
git reset "$parent_commit"  

# 将所有更改添加到暂存区  
git add -A  

# 创建一个新的合并提交  
git commit -m "deploy commit"

# 如果发布到 https://<USERNAME>.github.io
git push -f https://gitee.com/Zhouwen-CN/orange-blog.git master