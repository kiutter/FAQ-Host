# PWP SPRING 2019

# FAQ-Host

## Group information

- Student 1. Kimmo Utter kutter18@student.oulu.fi

## Description

FAQ-Host is a simple REST API to post questions and answers to questions.

## Documentation

- REST API documentation: https://faqhost.docs.apiary.io/#
- Project documentation: https://github.com/kiutter/FAQ-Host/wiki

## Implementation

- Client running at: https://kut-faqhost.appspot.com/
- REST API entry: https://kut-faqhost.appspot.com/api/questions/
- Database running at: Mongo DB Atlas Cloud service

# Using FAQHost

## Prerequisites

For local use and testing:

- This project pulled from GitHub to local disk.
- NodeJS with NPM Package manager installed (https://nodejs.org/en/download/)

## FAQHost

- To host REST API locally, run Launch_FAQHost.bat from bat-folder.
- REST API can also be used from https://kut-faqhost.appspot.com/api/questions/
- Client can be used from src\static\index.html for local use.
  Or from https://kut-faqhost.appspot.com/ for cloud installation.

## FAQHost testing

- To run test scripts, the prequisites must have been met (NodeJS installed).
- Run Run_tests.bat from bat-folder.

# Used libraries

## Node modules:

    	- "body-parser": "^1.18.3",
    	- "boom": "^7.3.0",
    	- "chai": "^4.2.0",
    	- "chai-http": "^4.3.0",
    	- "chai-json-schema": "^1.5.0",
    	- "cors": "^2.8.5",
    	- "express": "^4.16.4",
    	- "halson": "^3.0.0",
    	- "mocha": "^6.1.4",
    	- "mongodb": "^3.1.13",
    	- "mongoose": "^5.4.19",
    	- "mongoose-unique-validator": "^2.0.2",
    	- "nodemon": "^1.18.10",
    	- "request": "^2.88.0"

## Client

        - jQuery 3.4.0
