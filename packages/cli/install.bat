@ECHO OFF
cmd.exe /c tsc src\index.ts --outDir dist
npm i -g .