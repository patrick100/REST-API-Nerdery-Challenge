# REST-API-Nerdery-Challenge

# Api Blog

> This project is a challenge to create a REST-API using Express and Prisma ORM.

## :red_circle: Live Demo:

[Live Demo Link](https://blog-api-challenge-ravn.herokuapp.com)

## :hammer: Built with

- Nodejs v14.17.6
- Express
- Typescript
- Prisma
- Postgres
- Heroku
- SendGrid
- Swagger
- Linters
- Prettier
- VS code

## :hammer: Tested with

- npm run test
- npm run test:coverage

## :construction_worker: Getting Started

To get a local copy up and running follow these simple steps:

1. Clone it using git command `git clone <link>`.
2. Follow 'Setup' steps.

## :memo: Setup

1. Open the terminal.
2. On the terminal navigate to the project directory using `cd REST-API-Nerdery-Challenge`.
3. Install dependencies using: `npm install`.
4. Configure the environment

```
DATABASE_URL=

SENDGRID_API_KEY=

JWT_SECRET=
```

4. Migrate the database: `npx prisma migrate dev --name init`.
5. Migrate the database: `npx prisma db seed`.

## :memo: How to use the application?

1. Open the terminal and go to the directory.
2. Start the application : `npm run dev`.
3. Open the browser and go to : `http://localhost:3000/` to see the documentation
4. Optional: use the [live version link](https://blog-api-challenge-ravn.herokuapp.com)
5. Import ApiBlog.postman_collection.json in postman
6. Test the diferents endpoints.

## :bust_in_silhouette: Authors

:bust_in_silhouette: **Patrick Lazo**

- GitHub: [patrick100](https://github.com/patrick100)

:bust_in_silhouette: **Kenvin Cotrina**

- GitHub: [kcotrinam](https://github.com/kcotrinam)
