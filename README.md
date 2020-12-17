# Creating a RESTful API with Node.js
After cloning repo do 
 1. npm i
 2. npm start in root folder to run the server at localhost:3000
 this runs the script in package.json which is nodemon server.js
Make sure to also add your Mongo Atlas Admin Username to a nodemon.json file (which you have to create).

```
{
    "env": {
        "MONGO_ATLAS_PW": "YOUR_MONGO_USER_PW"
    }
}
```
