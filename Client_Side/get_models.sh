rm -rf node_modules/wos-api
cd ../Server_Api/src/swagger/
./generate.sh
cp -R generator/workspace/dist/wos-api ../../../Client_Side/node_modules/wos-api