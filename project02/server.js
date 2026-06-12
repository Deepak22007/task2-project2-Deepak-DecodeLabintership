const http = require("http");

let usersDatabase = [
  { id: 1, name: "Martina Plantijn", email: "martina@decodelabs.tech" },
  { id: 2, name: "Deepak Kumar", email: "deepak@example.com" },
];

const PORT = 3000;

const server = http.createServer((req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  if (req.url === "/users") {
    if (req.method === "GET") {
      res.writeHead(200);
      res.end(
        JSON.stringify({
          status: "success",
          message: "Users retrieved successfully",
          data: usersDatabase,
        }),
      );
      return;
    }

    if (req.method === "POST") {
      let body = "";

      req.on("data", (chunk) => {
        body += chunk.toString();
      });

      req.on("end", () => {
        try {
          if (!body) {
            res.writeHead(400);
            res.end(
              JSON.stringify({
                status: "error",
                message: "Malformed Data: Request body cannot be empty",
              }),
            );
            return;
          }

          const parsedData = JSON.parse(body);

          if (!parsedData.name || !parsedData.email) {
            res.writeHead(400);
            res.end(
              JSON.stringify({
                status: "error",
                message:
                  "Syntactic Validation Failed: 'name' and 'email' fields are required.",
              }),
            );
            return;
          }

          const emailExists = usersDatabase.some(
            (user) =>
              user.email.toLowerCase() === parsedData.email.toLowerCase(),
          );
          if (emailExists) {
            res.writeHead(400);
            res.end(
              JSON.stringify({
                status: "error",
                message:
                  "Semantic Validation Failed: This email is already registered.",
              }),
            );
            return;
          }

          const newUser = {
            id: usersDatabase.length + 1,
            name: parsedData.name,
            email: parsedData.email,
          };

          usersDatabase.push(newUser);

          res.writeHead(201);
          res.end(
            JSON.stringify({
              status: "success",
              message: "User resource created successfully",
              data: newUser,
            }),
          );
        } catch (error) {
          res.writeHead(400);
          res.end(
            JSON.stringify({
              status: "error",
              message: "Invalid JSON format payload received.",
            }),
          );
        }
      });
      return;
    }
  }

  res.writeHead(404);
  res.end(
    JSON.stringify({
      status: "error",
      message: "Endpoint route not found.",
    }),
  );
});

server.listen(PORT, () => {
  console.log(`===================================================`);
  console.log(` DECODELABS BACKEND APPLICATION ENGINE ACTIVATED   `);
  console.log(` Server core is listening locally on port: ${PORT} `);
  console.log(` Test Endpoint: http://localhost:${PORT}/users     `);
  console.log(`===================================================`);
});
