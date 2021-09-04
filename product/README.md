Service is done and integrated into frontend

# Frontend
https://d3e0uejfmuto73.cloudfront.net/

FE task-3 PR:
https://github.com/sergey-kvachenok/nodejs-aws-fe/pull/2

# Additional scope
1. Async/await is used in lambda functions - done
2. ES6 modules are used for product-service implementation - done
3. Webpack is configured for product-service - done
4. SWAGGER documentation is created for product-service - done (the link is below)
5. Lambda handlers are covered by basic UNIT tests - done
6. Lambda handlers (getProductsList, getProductsById) code is written not in 1 single module (file) and separated in codebase - done
7. Main error scenarious are handled by API ("Product not found" error) - done

# Endpoints
  GET - https://ufclbh8316.execute-api.eu-west-1.amazonaws.com/dev/products
  GET - https://ufclbh8316.execute-api.eu-west-1.amazonaws.com/dev/products/{productId}

# Swagger documentation
  https://app.swaggerhub.com/apis-docs/sergey-kvachenok/pranksome-potato/1.0.0
