Service is done and integrated into frontend

# Frontend
https://d3e0uejfmuto73.cloudfront.net/

# Endpoints
https://xzmjux47pd.execute-api.eu-west-1.amazonaws.com/dev/import

import-service-dev-importFileParser is triggered when the file is downloaded into the bucket

# Swagger documentation
  https://app.swaggerhub.com/apis-docs/sergey-kvachenok/pranksome-potato/1.2.1


# Additional scope
1. async/await is used in lambda functions - *done*
2. importProductsFile lambda is covered by unit tests  - *done*
3. At the end of the stream the lambda function should move the file from the uploaded folder into the parsed folder (move the file means that file should be copied into parsed folder, and then deleted from uploaded folder) - *done*

All tasks from the main and additional scope are done