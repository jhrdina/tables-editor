#!/bin/bash

LOGIN="xlogin10"

rm -rf ../deploy
mkdir ../deploy
cp -rf .git ../deploy/.git
cd ../deploy
git reset --hard
rm -rf .git
zip -r "${LOGIN}_56_40_src.zip" *
