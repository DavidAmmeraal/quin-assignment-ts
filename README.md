# QUIN Technical assignment

This app displays all the launches on a map within a given time frame.

## Installing/Building/etc

To install dependencies

```
yarn
```

To develop

```
yarn develop
```

To build

```
yarn build
```

## Implemented

- A map showing all launches for a given timeframe, can be narrowed down using the date filters.
- When clicking on a launch, displays basic data for launch
- When an error occurs retrieved data from the API a (very basic) error message is shown.

## Not implemented

- Possibilities to filter by agency/launch status
- Tests, I just didn't have the time left :(

## Design choices

- I chose to get the connection to the API working first. Typescript added some overhead here.
- I chose to put the launch retrieval functionality it it's own hook, to make it more portable.
- There wasn't enough client state to really use any state manager. So instead I chose react-query to fetch data from the endpoint.
- I had to look for a map library, map-gl was the one that satisfied my needs.

## Room for improvement

- I would've really liked more time to get tests going.
- The styling is **very** basic.
- I would've liked more times to add more filters. I guess date filters are the most important, so I prioritized those. There's already some code for filtering on launch status, but did not have time fix last issues.
- Typescript added a little overhead because I had to type the API response.
