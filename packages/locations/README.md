# @6nomads/locations
> Locations services for 6nomads task

The project provides out of the box solutions for figuring out closest cities in a list of arrays. It uses google geo coding api to retrieve accurate distances among cities.

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

# Start the server in production environment
npm run start --prefix packages/locations
```

## Usage



