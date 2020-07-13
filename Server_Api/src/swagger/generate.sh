rm -rf swagger.json
./../../node_modules/.bin/multi-file-swagger swagger-dev.json > swagger.json
rm -rf generator/workspace

java -jar swagger-codegen-cli.jar generate \
    -i swagger.json \
    -l typescript-angular \
    -o  generator/workspace \
    -t generator/templates \
    -c generator/option.json 

cd generator/workspace
# rm -rf package.json
# cp ../package.json .

npm i
npm run build
