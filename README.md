# ORCESTRA
ORCESTRA is a new web application that enables users to search, request and manage pharmacogenomic datasets (PSets).
PSets are generated with an automated pipeline by using a version controlling platform called Pachyderm. Upon completion of the pipeline, a newly generated PSet is uploaded to Zenodo, a data-sharing platform, and is assigned a DOI.
With Pachyderm's strict version controlling system, coupled with the DOI assignment, ORCESTRA ensures that your experiments with PSets are transparent and easily reproducible.

## Setup Instructions

- Clone the repo
  
```bash
git clone git@github.com:bhklab/ORCESTRA.git
cd ORCESTRA
```

- In the project directory, install all the server dependencies using `npm install
- To start the server run this command `npm start`
- Start the client (development mode) by running `npm start`
- Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Dependencies

- React
- React-Router
- Express
- MongoDB
- Body-parser

## Dev Dependenices

- Nodemon

## Build Instructions

### `cd client && npm build`

Builds the app for production to the `build` folder.
It correctly bundles React in production mode and optimizes the build for the best performance.

## Server
- Production Server: [https://www.orcestra.ca/](https://www.orcestra.ca/)
