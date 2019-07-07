#!/bin/sh
cp -R ./build/. ./mnt
cp 404.html ./mnt/404.html
echo "uiucbus.com" > ./mnt/CNAME
