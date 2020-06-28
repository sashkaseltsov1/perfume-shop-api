# perfume-shop-api

**Perfume-shop-api** is a rest-API who was developed for a perfume shop [SPIRIT.RU](http://perfume-shop-spirit.ru). 
The API was developed on platform NodeJS using Express Framework and Mongoose for MongoDB object modeling.

Path for temp uploads folder: `./uploads`  
Path for product image folder: `./images`

# Usage
1. Clone and install:  
```
git clone https://github.com/sashkaseltsov1/perfume-shop-api.git
npm install
```
2. Create folders for temp uploads and product images:  
```
mkdir uploads
mkdir images
```
3. Run project in production or development mode:
```
npm run start 
or 
npm run dev
```
# config.js
Option          | Description
----------------|----------------------
dbUrl           | Database connection string
apiUrl          | Url for generate path to static product images
port            | Listening port
secret          | Secret key for JWT tokens
expiresIn       | Time when token expired

# API
### api/auth/signin (POST) 
_Sign in_
#### :black_small_square: Request:  
>* Headers:  
> Content-Type: application/json
>* Data:  
> email: _required(string)_  
> password: _required(string)_  
#### :black_small_square: Response:
```
{
  token:string,
  refreshToken:string
}
```
---
### api/auth/signup (POST) 
_Sign up_
#### :black_small_square: Request:  
>* Headers:  
> Content-Type: application/json
>* Data:  
> email: _required(string)_  
> name: _required(string)_  
> lastname: _required(string)_  
> password: _required(string)_  
#### :black_small_square: Response:
```
{
  message:string, 
  user:Object
}
```
---
### api/auth/refresh-token (PUT) 
_Generate new tokens_
#### :black_small_square: Request:  
>* Headers:  
> Content-Type: application/json
>* Data:  
> refreshToken: _required(string)_  
#### :black_small_square: Response:
```
{
  token:string,
  refreshToken:string
}
```
---
### /api/filters/ (GET) 
_Get all categories_
#### :black_small_square: Response:
```
{
  filters:Object
}
```
---
### /api/filters/:category (GET) 
_Get category by id_
#### :black_small_square: Response:
```
{
  category: string,
  name: string,
  items: Object
}
```
---
### /api/filters/:category (POST) 
_Add new option in category(only for admin)_
#### :black_small_square: Request:  
>* Headers:  
> Content-Type: application/json  
> Authorization: Bearer token
>* Data:  
> type: _required(string)_  
#### :black_small_square: Response:
```
{
  category: string,
  name: string,
  items: Object
}
```
---
### /api/filters/:category/:optionId (DELETE) 
_Remove option in category(only for admin)_
#### :black_small_square: Request:  
>* Headers:  
> Content-Type: application/json  
> Authorization: Bearer token 
#### :black_small_square: Response:
```
{
  category: string,
  name: string,
  items: Object
}
```
---
### /api/orders/:id (GET) 
_Get order by id_
#### :black_small_square: Request:  
>* Headers:  
> Content-Type: application/json  
> Authorization: Bearer token 
#### :black_small_square: Response:
```
{
  order:Object
}
```
---
### /api/products?query (GET) 
_Return filtered products using query string_  
All params:  
#### :black_small_square: Response:
```
{
  products:Object,
  count:Number,
  error:Object
}
```
---
### /api/products/:id?count (GET) 
_Return product by id, 'count' is a query param for comments pagination_
#### :black_small_square: Response:
```
{
  product:Object
}
```
---
