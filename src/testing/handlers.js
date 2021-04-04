import { rest } from "msw";
import launches from "../__fixtures__/launches.json";

export const handlers = [
  rest.get("https://lldev.thespacedevs.com/2.2.0/launch/", (req, res, ctx) => {
    const searchParams = req.url.searchParams;
    const
      window_start__gte = searchParams.get('window_start__gte'),
      window_end__lte = searchParams.get('window_end__lte'),
      _offset = searchParams.get('offset'),
      _limit = searchParams.get('limit'),
      lsp__ids = searchParams.get('lsp__ids'),
      status = searchParams.get('status');

    const offset = parseInt(_offset);
    const end = offset + parseInt(_limit);
    const agenciesArr = lsp__ids?.split(",");

    const filtered = launches.filter((launch) => {
      const windowGteMatch =
        !window_start__gte ||
        new Date(launch.window_start) >= new Date(window_start__gte);
      const windowLteMatch =
        !window_end__lte ||
        new Date(launch.window_end) <= new Date(window_end__lte);

      const statusMatch = !status || launch.status === status;
      const agencyMatch =
        !agenciesArr ||
        agenciesArr.indexOf(launch.launch_service_provider.id) !== -1;

      return windowGteMatch && windowLteMatch && statusMatch && agencyMatch;
    });

    const sliced = filtered.slice(offset, end);
    const result = {
      next: end < filtered.length,
      results: sliced,
    };


    return res(
      ctx.delay(10), 
      ctx.json(result)
    );
  }),
];
