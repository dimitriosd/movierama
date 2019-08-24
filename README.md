## To check demo

- Visit https://movierama-ddouras.herokuapp.com

## To run locally

- Prerequisites 
 1) Install Node JS.
    You can get it at https://nodejs.org/en/
    
 2) Install MongoDB. You can download the MongoDB Community Server from the MongoDB download page.
    The download is a zip file. Unzip the contents, change the folder name to “mongodb”, and
    move it to your users home directory. From there, create a “mongodb-data” directory in
    your user directory to store the database data.
    You can start the server using the following command. Make sure to swap out
    “username” with the correct path to your users home directory.
    /Users/{username}/mongodb/bin/mongod --dbpath=/Users/{username}/mongodb-data

- Install client dependencies:

### `cd client`
### `npm install`

- Install server dependencies:

### `cd ../`
### `npm install`

- Run locally:
### `npm run dev`

- To run eslint check:
### `npm run lint`

- To run integration tests:
### `npm run test`

