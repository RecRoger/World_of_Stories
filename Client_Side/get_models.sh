rm -rf src/client-api
cd ../Server_Api/src/swagger/
./generate.sh
cp -R generator/workspace/dist/client-api ../../../Client_Side/src/client-api