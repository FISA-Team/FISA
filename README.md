[![Codacy Badge](https://api.codacy.com/project/badge/Grade/05beb4ff562945958b40411f84017a31)](https://app.codacy.com/gh/FISA-Team/FISA?utm_source=github.com&utm_medium=referral&utm_content=FISA-Team/FISA&utm_campaign=Badge_Grade_Dashboard)
[![Build Status](https://travis-ci.org/FISA-Team/FISA.svg?branch=master)](https://travis-ci.org/FISA-Team/FISA)

<img src="fisa-logo.svg" height="144">

A tool to setup a SensorThings-Datamodel on a visual basis.

## Usage

You need to have [docker](https://docs.docker.com/get-docker/) and [docker-compose](https://docs.docker.com/compose/install/) installed on your machine

Download the docke-compose.yml file with `wget https://raw.githubusercontent.com/FISA-Team/FISA/master/docker-compose.yml` (Linux) or directly from
<a href="https://raw.githubusercontent.com/FISA-Team/FISA/master/docker-compose.yml" download="docker-compose.yml">docker-compose.yml</a> if you want just the FISA-Application.

Download the docke-compose.extended.yml file with `wget https://raw.githubusercontent.com/FISA-Team/FISA/master/docker-compose.extended.yml` (Linux) or directly from
<a href="https://raw.githubusercontent.com/FISA-Team/FISA/master/docker-compose.extendet.yml" download="docker-compose.extended.yml">docker-compose.extended.yml</a> if you want the FROST-Server inside a docker-container as well.

Open the terminal and navigate to the location of the docker-compose.yml / docker-compose.extended.yml file

If you use the `decker-compose.extended.yml` rename it to `docker-compose.yml` and start the application with `docker-compose up -d`. The frontend is accessible on port 3000, the backend on 8081 and the FROST-Server on 8080.

To use the application, you need a FISA-Document that describes a abstract use-case that is the base for your project. Examples can be found in the examples-folder.

After uploading a use-case you can create a new project on the main page of the application.

## Backend

The backend ist based on Spring-Boot and can be build via the maven-goal `package`. To execute the tests, run the maven goal `test`.

Configuration options for the backend:

- Root-Path of the API: server.servlet.context-path
- Path to save the use-case and project files: app.filesDirectory

## Frontend

The frontend uses react and is created via `create-react-app`. To execute it, run `npm i` to install the dependencies and `npm run start` to run only the frontend. To execute frontend-tests, run `npm run test`

Configuration options for the frontend:

- Location of the Backend: API_URL

## FisaDoc specification

The specification of the FisaDoc in typescript notation

```
interface FisaDocument {
    name: string;
    fisaObjects: FisaObjectDefinition[];
    fisaTemplate: FisaObject[];
}

interface FisaObjectDefinition  {
    name: string;
    caption: string;
    infoText: string;
    isTopLayer: boolean;
    mapsTo: string;
    exampleData: ExampleData | null;
    attributes: FisaObjectAttributeDefinition[];
    children: ChildDefinition[];
    isNotReusable: boolean;
    positionAttributes: [string, string];
}

interface ExampleData {
    count: number;
    valueRange: {
        max: number;
        min: number;
    },
    timeRange: {
        min: DateTime;
        max: DateTime;
    }
}

interface FisaObjectAttributeDefinition  {
    name: string;
    infoText: string;
    valueType: "string" | "number" | "boolean" | "dropdown" | "exampleDropdown" | "polygonPosition"
    value: string | number | boolean | [number, number][];
    isPredefined: boolean
    dropDownValues: string[] | number[] | null;
    mapsTo: string;
    validationRule: RegExp;
}

interface ChildDefinition {
    object: string;
    quantity: number;
    infoText: string;
}
```

You can find example FISA-Documents in the example folder.

## Features of FISA

<img src="readme-imgs/FISA-usage.gif" width="100%">

1. Define Usecases with the help of a FISA-Document
2. Clone already defined Entities
3. Link already defined Entities
4. Pick a Location-Point ore Polygon with the help of a Card-Function
5. Upload the finished Project to your FROST-Server (create the Entities)
6. Save the Project to reuse it later
