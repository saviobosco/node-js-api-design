API Design with Node V2
> Learn to build with Node, Express, Mongo, and GraphQL

## What you'll need to know
* JavaScript
* basic HTTP knowledge
* basic API knowledge
* User Authentication
* Api Error Handling
* Mongoose

## Dependencies
* Mongo (if you don't have this, signup for a free mongo DB [at mLab](https://mlab.com/))
* Node 6+
* Yarn or Npm (Yarn recommended)

## SetUp
* Please configure your mongodb in the ```config``` folder.
* ```npm install``` to install app dependencies.
* ```npm run test``` to execute test.

## Endpoints 
* ```GET <url>/api/user``` lists all users 
* ```POST <url>/api/user``` creates a new user
* ```GET <url>/api/user/:id``` get the user record
* ```PUT <url>/api/user/:id``` updates the user record
* ```DELETE <url>/api/user/:id``` deletes the specified user
** creating a new user requires username and passwordHash .