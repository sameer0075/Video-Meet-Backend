Steps To Run Backend

1) Install Npm Packages  via (npm install command)

2) Check env-example file and make an env file similar to that in root path

3) Techstack used for backend is Postgres Database, Nest JS & Typeorm

4) Create Database in pgadmin or something like that

5) Run Migrations via command (npm run migration:run)

6) Run server using command (npm run start:dev)

7) Swagger is integrated in project you can access swagger on route (BASE_URL from env/api endipoint e.g: http://localhost:3001/api)

8) In Swagger first use login api to get token by default the user created via migration is (email:admin@gmail.com,password:pass@word) get token by adding these in body using swagger and then get token from it and click the green authorize button it will ask for token. Place the token there without using Bearer.After that you would be able to use other apis

9) You can also use gmail information of your own but for default i have put gmail information in env.example file