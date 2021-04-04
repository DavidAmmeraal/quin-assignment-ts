# QUIN Technical assignment

This app displays all the launches on a map within a given time frame.

## Installing/Building/etc

To install dependencies

```
yarn
```

To develop

```
yarn start
```

To build

```
yarn build
```

## Implemented

- A map showing all launches for a given timeframe, can be narrowed down using the date filters.
- When clicking on a launch, displays basic data for launch
- When an error occurs retrieved data from the API a (very basic) error message is shown.
- A loading indicator is shown when data is being retrieved.

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

## Update 2 (Outside of time limit)

I added a test suite into a separate [branch](https://github.com/DavidAmmeraal/quin-assignment-ts/tree/tests).

## Update 1 (Outside of time limit)

Now I have some more time I would like to ellaborate on some of my design choices:

### Getting started

I extracted the following tasks from the requirements:

- Data retrieval (fetching from API)
- Data visualisation (rendering launches on a map, along with inspection of launches)
- Data filtering (filtering whatever data is retrieved from the API through UI)

I drew a very rough user interface with paper/pen, consisting of a topbar with user inputs for filtering. And a map containg markers. 

After this I setup my project structure, I chose CRA with TypeScript to get going fast. Along with that I chose tailwind for styling (might be a bit overkill, but CSS purging is enabled).

Since the application has a very small amount of client side state, I chose not to include a state management package. It would just introduce unneccesary complexity. Instead I keep some (component-specific) local state in some of the components, and maintain a ```filters``` state inside App.tsx which contains the current state of the filters (which is really most the of state that is shared among multiple components). 

I also noticed we need some method to inspect a launch on the map. I chose to implement this functionality through a popout, I use ```react-popper``` for handling the popout behaviour. 

### Data retrieval/fetching

I chose a method of progressively retrieving launches to give feedback to the user ASAP. At first I chose a limit of 100 launches per request, but this aversely affected performance, instead I chose a more conservative limit of 10 launches per request. I spent a bit more time then I wished on getting this working at a an acceptable level.

I lost time studying the API fields and mapping them to a TypeScript type. In my experience importing and checking external untyped data into TypeScript is where TypeScript causes the biggest overhead in terms of extra time being spent.

I grouped the calls to the external API in [api.ts](src/api.ts). 

After this I encapsulated the fetching behaviour into [useLaunches.ts](src/useLaunches.ts).

What needs to be improved: 

- There's probably a better number of launches per requests being retrieved for an optimal user experience. 
- There should probably be a limit on the time window between which launches are retrieved. If you retrieve launches for a lot of time (say more then a year), depending on how many launches there are, you'll probably be waitin a long time. 
- I noticed a null-pointer at a later moment when selecting a very large timeframe in the filters I think in the ```launch_service_provider``` field. The launches should go through a typeguard before being returned by ```fetchLaunches```.

### Rendering markers on a map

I've only used map tools very sporadically during my projects at Noterik. So this sort of caught me off guard. I chose ```react-map-gl```, and luckily it was quite painless to get a map of the world to render. I created a component ```<Launches />```([code here](src/Launches.tsx)) that renders a map. 

After getting the map to render, I focussed on getting markers on the map. I created a new component ```<LaunchMarker />```([code here](src/LaunchMarker.tsx)) that renders a marker on the map. 

Now, I had to create a popout to render the launch info. I used ```react-popper``` to create a very rough popout. It doesn't look very nice, but it gets the job done I also had to create a way to get the popout to dissapear when clicking outside the popout. 

To do this, I attach a listener to the ```click``` event on the window whenever a popout is being shown. When you click outside of the popout, the popout will be hidden.

To display the current loading status, I created a new component ```LaunchesLoading``` that uses ```useIsFetching``` from react-query to display the current global loading status. 

What needs to be improved:

- We need to limit the amount of markers, or group them up if they overlap, when you select a very large time window, a very long list of launch markers will render, and this will negatively affect user experience while using the map zooming/panning functionalities. 
- Styling could be better.
- I forgot to render the arrow for the popout :(

### Filtering launches

By the time I got to the filters, I'd already spent most of my time, and I hadn't written any tests yet. I decided to just create a single component ```<LaunchFilters />```([code here](src/LaunchFilters.tsx)) that contains all filter inputs. This component takes a ```filter``` and ```onChange``` for displaying and updating the state of the filters which is actually lifted into the ```<App />``` component.

I chose two very simple ```date``` inputs to get the basic date picking functionality.. It's also possible to filter on ```status``` when calling ```fetchLaunches()``` directly, however by the time I got to actually coupling this to the user input in the filter, I had already spent more then 3 hours on coding without writing a single test, so it was time to wrap up.

What needs to be improved:

- The status filter needs to be implemented, it's a shame I didn't have time to at least get the status one running, especially since most of the code to get it working is there. 
- The agency filter needs to be implemented. Its a bit more complex, because it requires using the launches data to retrieve the available list of agencies.
- There should be logic that prevents users from selecting start-times that are before end-times and vice-versa.

### Testing

I really didn't get around to testing. It's a shame, and I probably should've added test after each of the tasks. However, I also wanted to provide you with an app that provides at least some of the functionality you documented. 

You specified that the amount of time is deliberatly too little for the amount of work and, at least for me, adding meaningful tests within this time frame seems a bit of a stretch. 

I would've mostly looked at integration testing the application as a whole. So interacting with the filters through testing-library. You could write tests for every component separately, but I think this would take too much time, and since we're probably not looking at reusing most of these components in other places, we can gain more coverage by just testing the application as a whole. I would've spun up a mock server using miragejs or mock service worker, and check the following core functionalities:

I would check:
  - Changing the filters invalidates the current result.
  - While fetching launches, show a loading indicator. 
  - Any fetching errors result in an error message. 
  - Launches are being rendered that fall between the constraints set by the filters. 
    - Test combinations of filters.
  - Launch markers are rendered on the screen for the current result see.
  - Clicking on a launch shows the popout. 
  - Clicking outside a popout/launch hides any open popout.