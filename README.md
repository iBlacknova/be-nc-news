# Northcoders News API

Hosted version of API is available here: https://nc-news-api-0bcj.onrender.com

This API provides the backend service to my NC News site

Minimum requirements:
Node = v22.1.0
Postgres = v16

Instructions:

1. To clone this repo, press the "code" button and copy the http link. In your terminal, navigate to the folder you would like to clone the repo in and do "git clone 'http link'":

2. To install the dependencies initiate "npm install" in your terminal after opening the project

3. To seed the database: first you need to setup the database by running "npm run setup-dp" then run "npm run seed" in your terminal.

4. To run tests type "npm run test 'insert test file here'"

You will need to create two .env files for this repo to work: .env.test and .env.development. Into each, add PGDATABASE=, with the correct database name for that environment: nc_news for dev data and nc_news_test for test data

---

This portfolio project was created as part of a Digital Skills Bootcamp in Software Engineering provided by [Northcoders](https://northcoders.com/)
