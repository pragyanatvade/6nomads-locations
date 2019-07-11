# 6nomads-locations
Locations project for 6nomads interview.

The project provides out of the box solutions for fiding cities with minimum distances among the array of cities. We use google geocoding api to accomplish this task.

## Installing / Getting started

```shell
# Clone the repository
git clone https://github.com/pntripathi9417/6nomads-locations

cd 6nomads-locations/

# Install global dependencies.
npm install -g nodemon lerna

# Bootstrap the project. It will install dependencies for each package.
lerna bootstrap --hoist

# Build every project in watch mode to start development
lerna build:watch --parallel

# Start the server locally
npm run dev --prefix packages/locations

# Start the server in production
npm run start --prefix packages/locations
```

## Usage

The results can be accessed through the live api at `http://locations.vadelabs.com`. 

```
GET http://locations.vadelabs.com/locations?locations=["New Delhi", "Bangalore", "Kolkata", "Chennai"]
```

Just put this url in browser and you will have your result.