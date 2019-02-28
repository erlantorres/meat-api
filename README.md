# meat-api
### create api

* npm i (para baixar as dependências do projeto)
* create file project
* npm init -y
* npm install restify@version --save -E (alterar version pela a versão desejada, --save é para salvar no config do projeto e -E é para instalar a versão específica)
* npm install @types/restify@version -D -E (alterar version pela a versão desejada, -D igual a --save-dev e -E é para instalar a versão específica)
* create arquivo tsconfig.json (compiler options: outDir: dist, target: es2015, module: commonjs)
* npm i nodemon -g (monitorar se houve alteração dos arquivos do projeto)
* npm i -g typescript
* tsc -w (iniciar o compilador em modo de watch. abrir o cmd e digitar)
* nodemon dist/main.js (recompila o codigo a cada alteração)
* npm i mongoose@version -P -E (gerenciamento do banco de dados pelo o serviço. -P igual a --save)
* npm i @types/mongoose@version -D -E
* npm i restify-errors@version -P -E (apresentação de erros de modo legível)
* npm i @types/restify-errors -D -E (dependência necessária)
* npm i bcrypt@1.0.3 -P -E (criptografia)
* npm i @types/bcrypt@1.0.0 -D -E
* npm i jest@22.4.2 ts-jest@22.0.4 typescript@2.6.2 supertest@3.0.0 @types/jest@22.1.2 @types/supertest@2.0.4 -D -E (dependências para resalizar testes no serviço)
* npm i ts-node@5.0.1 jest-cli@22.4.2 -D -E (dependências)
* npm i jsonwebtoken@8.1.1 -P -E (token para autenticação)
* npm i @types/jsonwebtoken@7.2.5 -D -E (dependências para o token de autenticação)
* npm i pm2 -g (gerenciamento de processos)
* npm i loadtest -g (teste de carga)