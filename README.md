# perfume-shop-api

# Table of Contents
1. [Example](#example)
2. [Example2](#example2)
3. [Third Example](#third-example)

## Example
## Example2


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
_Sign in._
#### :black_small_square: Request:  
>* Headers:  
> Content-Type: application/json
>* Body:  
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
_Sign up._
#### :black_small_square: Request:  
>* Headers:  
> Content-Type: application/json
>* Body:  
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
_Generate new tokens._
#### :black_small_square: Request:  
>* Headers:  
> Content-Type: application/json
>* Body:  
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
_Get all categories._
#### :black_small_square: Request:  
>* Headers:  
> Content-Type: application/json 
#### :black_small_square: Response:
```
{
  filters:Object
}
```
---
### /api/filters/:category (GET) 
_Get category by id._
#### :black_small_square: Request:  
>* Headers:  
> Content-Type: application/json 
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
_Add new option in category(only for admin)._
#### :black_small_square: Request:  
>* Headers:  
> Content-Type: application/json  
> Authorization: Bearer token
>* Body:  
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
_Remove option in category(only for admin)._
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
_Get order by id._
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
_Return filtered products using query string. All query params:_   
* _gender=genderId_  
* _fragrance=array of fragranceId_
* _perfumeType=perfumeTypeId_  
* _brand=brandId_ 
* _isNovelty=true or false_ 
* _isDiscount=true or false_
* _sort='dec' or 'inc'_
* _find=string for search_  
* _page=page number_  
#### :black_small_square: Request:  
>* Headers:  
> Content-Type: application/json 
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
_Return product by id. 'count' is a query param for comments pagination._
#### :black_small_square: Request:  
>* Headers:  
> Content-Type: application/json 
#### :black_small_square: Response:
```
{
  product:Object
}
```
---
### /api/products/:id (POST) 
_Add new comment. 'id' is a param of product._  
#### :black_small_square: Request:  
>* Headers:  
> Content-Type: application/json  
>* Body:  
> stars: _required(number)_  
> username: _string_  
> message: _string_  
#### :black_small_square: Response:
```
{
  comment:Object
}
```
---
### /api/products/ (POST) 
_Create new product (only for admin)._  
#### :black_small_square: Request:  
>* Headers:  
> Content-Type: multipart/form-data  
> Authorization: Bearer token 
>* File: _required(File)_  
>* Body:  
> name: _required(string)_   
> amount: _required(number)_  
> fullPrise: _required(number)_  
> count: _required(number)_   
> description: _string_  
> isDiscount: _bool_  
> isNovelty: _bool_  
> brand: _required(string)_  
> gender: _required(string)_  
> perfumeType: _required(string)_  
> fragrance: _required(Object)_  
#### :black_small_square: Response:
```
{
  message:string
}
```
---
### /api/products/remove-restore-comment/:id (PUT) 
_Remove or restore comment. 'id' is a product id (only for admin)._  
#### :black_small_square: Request:  
>* Headers:  
> Content-Type: application/json 
> Authorization: Bearer token 
>* Body:  
> commentId: _required(string)_   
> isRemoved: _required(bool)_    
#### :black_small_square: Response:
```
{
  commentId:string,
  isRemoved:bool
}
```
---
### /api/products/:id (PUT) 
_Update product by id (only for admin)._  
#### :black_small_square: Request:  
>* Headers:  
> Content-Type: multipart/form-data  
> Authorization: Bearer token 
>* File: _File_  
>* Body:  
> name: _required(string)_   
> amount: _required(number)_  
> fullPrise: _required(number)_  
> count: _required(number)_   
> description: _string_  
> isDiscount: _bool_  
> isNovelty: _bool_  
> brand: _required(string)_  
> gender: _required(string)_  
> perfumeType: _required(string)_  
> fragrance: _required(Object)_  
#### :black_small_square: Response:
```
{
  message:string
}
```
---
### /api/products/:id (DELETE) 
_Remove product by id (only for admin)._  
#### :black_small_square: Request:  
>* Headers:  
> Content-Type: application/json  
> Authorization: Bearer token   
#### :black_small_square: Response:
```
{
  message:string
}
```
---
### /api/user/ (GET) 
_Get profile data._  
#### :black_small_square: Request:  
>* Headers:  
> Content-Type: application/json  
> Authorization: Bearer token   
#### :black_small_square: Response:
```
{
  user:Object
}
```
---
### /api/user/ (PUT) 
_Update profile data._  
#### :black_small_square: Request:  
>* Headers:  
> Content-Type: application/json  
> Authorization: Bearer token  
>* Body:  
> name: _string_   
> lastname: _string_   
> phone: _string_   
> address: _string_   
> password: _string_   
> newPassword: _string_   
#### :black_small_square: Response:
```
{
  message:string
}
```
---
## Third Example
