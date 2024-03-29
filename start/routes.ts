/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'

Route.get('/', async () => {
  return { hello: 'world' }
})

  Route.post("register", "AuthController.register");
  Route.post("login", "AuthController.login");
  Route.get("api/branches", "BranchesController.getBranchNames");

Route.group(() => {
      Route.group(() => {
      Route.get("/", "ProductsController.index");
      Route.get("/:id", "ProductsController.show");
      Route.put("/update", "ProductsController.update");
      Route.post("/", "ProductsController.store");
      }).middleware("auth:api");
}).prefix("products");

Route.group(() => {
  Route.post("/generate_xml", "InvoiceController.generateXML")
  Route.post("/generate_pdf", "InvoiceController.generatePDF")
}).prefix("invoices")
