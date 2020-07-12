cd src/swagger/
rm -rf swagger.json
./../../node_modules/.bin/multi-file-swagger swagger-dev.json > swagger.json
cd ../../
npm run dev