import React from 'react';
import { screen, render, waitFor, waitForElementToBeRemoved, fireEvent } from '@testing-library/react';
import App from './App';
import { QueryClient, QueryClientProvider } from 'react-query';
import { server } from './testing/node';
import { rest } from 'msw';
import userEvent from '@testing-library/user-event';

// Mocking out react-map-gl, probably better to test this inside the browser using cypress. 
jest.mock('react-map-gl', () => {
  const React = require('react');
  const mockContextDefaultValue = {
    viewport: {
      project: () => [0, 0] 
    }
  };
  const MockMapContext = React.createContext(mockContextDefaultValue);

  return {
    __esModule: true, // this property makes it work
    default: (props: any) => (
      <div><MockMapContext.Provider value={mockContextDefaultValue}>{props.children}</MockMapContext.Provider></div>
    ),
    MapContext: MockMapContext,
  }
});

let queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const NOW = "2021-04-04T12:00:00Z";

const Wrapper: React.FC = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

// Set Date.now to a fixed time so our fixtures will keep working.

beforeAll(() => {
  jest
    .useFakeTimers('modern')
    .setSystemTime(new Date(NOW).getTime());

  server.listen();
})

afterEach(() => {
  queryClient.clear();
  server.resetHandlers();
})

afterAll(() => {
  jest.useRealTimers();
  server.close();
})

test('it renders', () => {
  const { container } = render(<Wrapper><App /></Wrapper>);
  expect(container).toMatchSnapshot();
});

const renderAndWaitForInitialLoading = async () => {
  const result = render(<Wrapper><App /></Wrapper>);
  await waitFor(() => screen.getByText("Loading launches..."));
  await waitForElementToBeRemoved(() => screen.getAllByText("Loading launches..."));

  return result;
}

test('it shows a loading indicator when loading', async () => {
  render(<Wrapper><App /></Wrapper>);
  // Wait for loading indicator to pop up
  await waitFor(() => screen.getByText("Loading launches..."));
  await waitForElementToBeRemoved(() => screen.getAllByText("Loading launches..."));
});

test('by default loads upcoming launches for three months into the future', async() => {
  const { getByLabelText } = await renderAndWaitForInitialLoading();
  expect(getByLabelText("Launch 2")).toBeInTheDocument();
  expect(getByLabelText("Launch 57")).toBeInTheDocument();
  expect(getByLabelText("Launch 81")).toBeInTheDocument();
  expect(getByLabelText("Launch 21")).toBeInTheDocument();
});

test('sets focus to first launch for given time frame', async() => {
  const { getByLabelText } = await renderAndWaitForInitialLoading();

  expect(getByLabelText("Launch 2")).toHaveFocus();
});

test('shows popout for first first launch for given time frame', async() => {
  const { getByLabelText } = await renderAndWaitForInitialLoading();


  await waitFor(() => screen.getByLabelText("Nissan Volt"));
  expect(getByLabelText("Nissan Volt")).toMatchSnapshot();
});

test('when changing starttime filter shows filtered results', async() => {
  const { getAllByLabelText, queryByLabelText } = await renderAndWaitForInitialLoading();

  const startInput = screen.getByLabelText('Launches after');
  fireEvent.change(startInput, { target: { value: '2020-01-01' }});

  await waitFor(() => screen.getByText("Loading launches..."));
  await waitForElementToBeRemoved(() => screen.getAllByText("Loading launches..."));

  const allLaunches = getAllByLabelText(/Launch [0-9]+/);
  const firstElement = queryByLabelText("Launch 54");
  expect(allLaunches[0]).toBe(firstElement);

  const lastElement = queryByLabelText("Launch 21");
  expect(allLaunches[allLaunches.length - 1]).toBe(lastElement);
});

test('when changing endtime filter shows filtered results', async() => {
  const { getAllByLabelText, queryByLabelText } = await renderAndWaitForInitialLoading();

  const endInput = screen.getByLabelText('Launches before');
  fireEvent.change(endInput, { target: { value: '2021-06-20' }});

  await waitFor(() => screen.getByText("Loading launches..."));
  await waitForElementToBeRemoved(() => screen.getAllByText("Loading launches..."));

  const allLaunches = getAllByLabelText(/Launch [0-9]+/);
  const firstElement = queryByLabelText("Launch 2");
  expect(allLaunches[0]).toBe(firstElement);

  const lastElement = queryByLabelText("Launch 57");
  expect(allLaunches[allLaunches.length - 1]).toBe(lastElement);
});

test('when changing status filter shows filtered results', async () => {
  const { getAllByLabelText, queryByLabelText } = await renderAndWaitForInitialLoading();

  const statusInput = screen.getByLabelText('Launch status');
  fireEvent.change(statusInput, { target: { value: '4' }});

  const startInput = screen.getByLabelText('Launches after');
  fireEvent.change(startInput, { target: { value: '2020-01-01' }});

  await waitFor(() => screen.getByText("Loading launches..."));
  await waitForElementToBeRemoved(() => screen.getAllByText("Loading launches..."));

  const allLaunches = getAllByLabelText(/Launch [0-9]+/);
  const firstElement = queryByLabelText("Launch 94");
  expect(allLaunches[0]).toBe(firstElement);
  expect(allLaunches.length).toBe(16);
  const lastElement = queryByLabelText("Launch 89");
  expect(allLaunches[allLaunches.length - 1]).toBe(lastElement);
})

test('populates agency option with agencies that are active in the current selection', async () => {
  await renderAndWaitForInitialLoading();

  const agencyOptions = screen.getAllByTestId(/agencyFilterOption_[0-9]+/);
  expect(agencyOptions.length).toBe(3);

  expect(screen.getByTestId("agencyFilterOption_2")).toBeInTheDocument();
  expect(screen.getByTestId("agencyFilterOption_1")).toBeInTheDocument();
  expect(screen.getByTestId("agencyFilterOption_3")).toBeInTheDocument();

  // Now we narrow down the result set
  const endInput = screen.getByLabelText('Launches before');
  fireEvent.change(endInput, { target: { value: '2021-05-01' }});

  await waitFor(() => screen.getByText("Loading launches..."));
  await waitForElementToBeRemoved(() => screen.getAllByText("Loading launches..."));

  expect(screen.getAllByTestId(/agencyFilterOption_[0-9]+/).length).toBe(1);
  expect(screen.getByTestId("agencyFilterOption_2")).toBeInTheDocument();
});

test('when changing agency filter shows filtered results', async () => {
  const { getAllByLabelText, queryByLabelText } = await renderAndWaitForInitialLoading();

  // Now we narrow down the result set
  const endInput = screen.getByLabelText('Agency');
  fireEvent.change(endInput, { target: { value: '1' }});

  await waitFor(() => screen.getByText("Loading launches..."));
  await waitForElementToBeRemoved(() => screen.getAllByText("Loading launches..."));
  const allLaunches = getAllByLabelText(/Launch [0-9]+/);
  expect(allLaunches.length).toBe(1);
  expect(queryByLabelText("Launch 21")).toBeInTheDocument();  
});

test('when rendering a new selection, focusses on the first item of that selection and shows popout', async () => {
  const { getByLabelText } = await renderAndWaitForInitialLoading();

  // Change result set
  const startInput = screen.getByLabelText('Launches after');
  fireEvent.change(startInput, { target: { value: '2018-09-01' }});

  const endInput = screen.getByLabelText('Launches before');
  fireEvent.change(endInput, { target: { value: '2018-10-01' }});

  await waitFor(() => screen.getByText("Loading launches..."));
  await waitForElementToBeRemoved(() => screen.getAllByText("Loading launches..."));

  await waitFor(() => screen.getByLabelText("Rolls Royce Explorer"));
  expect(getByLabelText("Rolls Royce Explorer")).toMatchSnapshot();
})

test('when clicking on a launch, only show popout for that launch', async () => {
  const { getByLabelText } = await renderAndWaitForInitialLoading();

  const currentOpenPopout = getByLabelText("Nissan Volt");
  expect(currentOpenPopout).toBeInTheDocument();

  await waitFor(() => getByLabelText("Launch 57"));
  userEvent.click(getByLabelText("Launch 57"));

  await waitFor(() => getByLabelText("Aston Martin Impala"))
  expect(currentOpenPopout).not.toBeInTheDocument();
})

test('when error occurs, shows error message', async () => {
  await renderAndWaitForInitialLoading();
  server.use(
    rest.get('https://lldev.thespacedevs.com/2.2.0/launch/', (req, res, ctx) => {
      return res(
        ctx.status(500)
      );
    })
  )

  // Change result set
  const startInput = screen.getByLabelText('Launches after');
  fireEvent.change(startInput, { target: { value: '2018-09-01' }});

  await waitFor(() => screen.getByText("Loading launches..."));
  await waitFor(() => screen.getByText("An error occurred, please try again later."));
});