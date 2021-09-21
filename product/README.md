Service is done and integrated into frontend

# Frontend
https://d3e0uejfmuto73.cloudfront.net/

# Additional scope
1. POST/products lambda functions returns error 400 status code if product data is invalid -done
2. All lambdas return error 500 status code on any error (DB connection, any unhandled error in code) - done
3. All lambdas do console.log for each incoming requests and their arguments - done
4. Transaction based creation of product (in case stock creation is failed then related to this stock product is not created and not ready to be used by the end user and vice versa) (https://devcenter.kinvey.com/nodejs/tutorials/bl-transactional-support) - done

All additional tasks are done.

# Endpoints
  GET - https://ufclbh8316.execute-api.eu-west-1.amazonaws.com/dev/products
  POST - https://ufclbh8316.execute-api.eu-west-1.amazonaws.com/dev/products
  GET - https://ufclbh8316.execute-api.eu-west-1.amazonaws.com/dev/products/{productId}

# Swagger documentation
  https://app.swaggerhub.com/apis-docs/sergey-kvachenok/pranksome-potato/1.1.1

# Data for images and descriptions
https://www.ogorod.ru/ru/ogorod/potatoes/13834/40-sortov-kartofelya-dlya-pyure-zharki-zapekaniya-i-kartoshki-fri.htm