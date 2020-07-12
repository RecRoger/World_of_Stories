rm -rf swagger.json
./../../node_modules/.bin/multi-file-swagger swagger-dev.json > swagger.json
rm -rf generator/workspace
java -jar swagger-codegen-cli.jar generate \
    -l typescript-angular \
    -i swagger.json \
    -t generator/templates \
    -o  generator/workspace \
    --type-mappings number=String \
    --type-mappings integre=String \
    --type-mappings string=String \
    --additional-properties npmName=WoS-api \
    --additional-properties ngVersion=1.0.0 \
    --additional-properties providedInRoot=true \