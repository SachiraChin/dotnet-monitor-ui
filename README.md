# dotnet-monitor UI

![dotnet-monitor UI build and deploy to Azure Web App](https://github.com/SachiraChin/dotnet-monitor-ui/workflows/dotnet-monitor%20UI%20build%20and%20deploy%20to%20Azure%20Web%20App/badge.svg)

This project is created as an easy to access user experience for `dotnet-monitor` tool which can be found [here](https://github.com/dotnet/diagnostics). If you haven't read original article about this, please read [this](https://devblogs.microsoft.com/dotnet/introducing-dotnet-monitor/) to get better understanding about features available in this tool.

## Updates

### 2020-07-23

- Updated landing page UI to show full details of single app when API returns only one process.
- Added UI for `/metrics` endpoint to show graph of returned metrics. Details [here](#metrics).
- Updated how to run the project with the support to CORS rules in source repository. Details [here](#i-want-to-try-it-out).
- Added better error handling for `trace` POST endpoint access.
- Increased width of views so user has more visibility on content.
- Added thanking note. Read [here](#thank-you).

### 2020-07-27

- Added `text/event-stream` support for `/logs` endpoint.
- Added dark theme (experimental).
- Improvements for `/metrics` endpoint access.
- Demo app is now available for use: [https://dotnet-monitor-ui.dev/](https://dotnet-monitor-ui.dev/)

### 2020-07-28

- Metrics download options added.
- Loading animation and error message banner added for API URL reload events.

## Demo

Now you can use the latest version of `dotnet-monitor ui` online from [https://dotnet-monitor-ui.dev/](https://dotnet-monitor-ui.dev/). Please follow below instruction to use this site to access `dotnet-monitor` endpoints accessible to your machine. For now, you have to build the solution from the repo to make it work with UI. More details why can be found [here](#i-want-to-build-it).

1. Clone official `dotnet diagnostics` repository from this url. [https://github.com/dotnet/diagnostics](https://github.com/dotnet/diagnostics)
2. Navigate to `\src\Tools\dotnet-monitor` from your favorite command line tool.
3. Run `dotnet build`
4. Open `\artifacts\bin\dotnet-monitor\Debug\netcoreapp2.1\appsettings.json` and add below section to the end.

```json
  "CorsConfiguration": {
    "AllowedOrigins": "https://dotnet-monitor-ui.dev"
  }
```

5. Goto `\artifacts\bin\dotnet-monitor\Debug\netcoreapp2.1\` using command line tool said above.
6. Run `dotnet exec dotnet-monitor.dll collect`
7. Now you can goto [https://dotnet-monitor-ui.dev/](https://dotnet-monitor-ui.dev/) and enjoy full experience of `dotnet-monitor`

---
**NOTE**

[https://dotnet-monitor-ui.dev/](https://dotnet-monitor-ui.dev/) does not collect any details from your browser nor collect any response received from `dotnet-monitor` tool. It does not have tracking integrated and does not contain any library or tool to collect your personal information. Site hosted here is pure build from the code you can find in this repository.

---

## Features

In the landing page, user can setup endpoints of the `dotnet-monitor` tool and after clicking `Reload` (application will try to access default endpoint urls on load and show processes if it's available), all available processes from `dotnet-monitor` will be shown in list like this. In the list, user can use `Download` button to download dumps, gcdumps or traces with default parameters. But if user wants to fine-tune input for each endpoint, user can click `More` button to goto process page.
![Landing page](documentation/images/home.png?raw=true "Landing page")

Process page has expansion panes to each available endpoint from `dotnet-monitor`. Those functions are `dump`, `gcdump`, `trace` and `logs`.
![Alt text](documentation/images/process-home.png?raw=true "Title")

### dump

`/dump` endpoint supports one parameter called `type`. From the UI, user can select supported types and click download to download dump file.

More info: [https://devblogs.microsoft.com/dotnet/introducing-dotnet-monitor/#dump](https://devblogs.microsoft.com/dotnet/introducing-dotnet-monitor/#dump)

![dump UI](documentation/images/dump.png?raw=true "dump UI")

### gcdump

`/gcdump` does not support any input parameters for download the file. Download button has added here so that user can see it as an option, but downloading gcdump from landing page and from here doesn't make any difference.

More info: [https://devblogs.microsoft.com/dotnet/introducing-dotnet-monitor/#gc-dump](https://devblogs.microsoft.com/dotnet/introducing-dotnet-monitor/#gc-dump)

![gcdump UI](documentation/images/gcdump.png?raw=true "gcdump UI")

### trace (GET)

`/trace` endpoint supports both GET and POST requests which used for different types of inputs. GET endpoint supports 3 parameters, `durationSeconds`, `profile` and `metricsIntervalSeconds`. Values for each of these parameters can be entered/selected from the UI and clicking download button will download trace file with selected parameters.

More info: [https://devblogs.microsoft.com/dotnet/introducing-dotnet-monitor/#traces](https://devblogs.microsoft.com/dotnet/introducing-dotnet-monitor/#traces)

![Trace UI](documentation/images/trace-get.png?raw=true "Trace UI")

### trace (POST)

`/trace` POST endpoint supports more advanced input which can be entered in UI. This endpoint supports `durationSeconds`, `requestRundown`, `providers` and `bufferSizeInMB`. User can enter multiple providers using table and can configure different parameters for each provider. I want to add here that, my knowledge about providers in this context is very low, I will update content here once I know more about it.

More info: [https://devblogs.microsoft.com/dotnet/introducing-dotnet-monitor/#traces](https://devblogs.microsoft.com/dotnet/introducing-dotnet-monitor/#traces)

![Trace UI](documentation/images/trace-post.png?raw=true "Trace UI")

### logs

This is the endpoint I enjoyed the most making. `/logs` endpoint gives stream of logs from given process. This endpoint supports `durationSeconds` and `level` parameters. `durationSeconds` is the duration it will stream logs, `level` parameter allows users to get logs in even higher level even if application is configured to write logs in low level. When user start the stream, it will update the table below with logs received from the endpoint.

Apart from inputs for API endpoint, I've added few more features in UI so user can navigate through logs easily. User can filter logs by log level, event id, category or input text. Dropdown values for filters gets automatically updated while stream is going on, for example, if new category is found in the stream, it will be added to the categories filter. These values can be changed while stream is running, but be warned that there can be lags when these are edited while stream is on.

More info: [https://devblogs.microsoft.com/dotnet/introducing-dotnet-monitor/#logs](https://devblogs.microsoft.com/dotnet/introducing-dotnet-monitor/#logs)

![Logs UI](documentation/images/logs.png?raw=true "Logs UI")

### metrics

Metrics endpoint when there's one application running to gather metrics. When there's one application is running, it returns set of metrics depends on the application type. This endpoint returns logs from prometheus exposition format. Using client UI, user can query `/metrics` endpoint for defined amount of time, graph of results will drawn below for user to analyze.

More info: [https://devblogs.microsoft.com/dotnet/introducing-dotnet-monitor/#metrics](https://devblogs.microsoft.com/dotnet/introducing-dotnet-monitor/#metrics)

![Metrics UI](documentation/images/metrics.png?raw=true "Metrics UI")

## I want to build it

With quick response for my [issue](https://github.com/dotnet/diagnostics/issues/1346), now we have support for CORS rules within `dotnet-monitor`. Thank you [@wiktork](https://github.com/wiktork) for quick turnaround for this! 😊

Until we see this in next release build, you still have to checkout the repo and build the `dotnet-monitor`. Once I have details of the build, I will update it here. Until that, please check below steps to run the latest build.

### Visual Studio 2019

1. Clone official `dotnet diagnostics` repository from this url. [https://github.com/dotnet/diagnostics](https://github.com/dotnet/diagnostics)
2. Open the solution(`diagnostics.sln`) in Visual Studio and navigate to `src -> Microsoft.Diagnostics.Monitoring.RestServer -> appsettings.json`
3. Add below section to it.

```json
  "CorsConfiguration": {
     "AllowedOrigins": "http://localhost:4200"
  }
```

4. Now set `src -> Microsoft.Diagnostics.Monitoring.RestServer -> Tools -> dotnet-monitor` as start up project
5. Start debugging
6. Clone this repository
7. Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`.

### Command-line

1. Clone official `dotnet diagnostics` repository from this url. [https://github.com/dotnet/diagnostics](https://github.com/dotnet/diagnostics)
2. Navigate to `\src\Tools\dotnet-monitor` from your favorite command line tool.
3. Run `dotnet build`
4. Open `\artifacts\bin\dotnet-monitor\Debug\netcoreapp2.1\appsettings.json` and add below section to the end.

```json
  "CorsConfiguration": {
     "AllowedOrigins": "http://localhost:4200"
  }
```

5. Goto `\artifacts\bin\dotnet-monitor\Debug\netcoreapp2.1\` using command line tool said above.
6. Run `dotnet exec dotnet-monitor.dll collect`
7. Clone this repository
8. Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`.

## Further work

- **DONE!!** Added support for `/metrics` endpoint. ~~This tool does not support `/metrics` endpoint available in `dotnet-monitor` tool. Next steps would be get integration for that.~~
- **DONE!!** Added text stream support for `logs` endpoint.
- Prepare POC for integrating UI to `dotnet-monitor` itself.

## Conclusion

I thought this is a nice addition to awesome features provided in `dotnet-monitor`. You are open to check this out, make changes and ask me questions. Please note that effort I put here is nothing compared to original `dotnet-monitor` tool. If anything, because they implemented it so nicely that I was able to query and get results without having lots of troubles in my side.

Thanks for checking out this tool!

## Thank you

Huge thanks goes to

- [@shirhatti](https://github.com/shirhatti) for being so kind and giving answers for all questions I've asked.
- [@wiktork](https://github.com/wiktork) for adding CORS feature to source repo. I would be stuck with my small *hacks* without that.
- [@noahfalk](https://github.com/noahfalk), [@loic-sharma](https://github.com/loic-sharma), [@MaximRouiller](https://github.com/MaximRouiller) for kind words, it really encouraged me to keep pushing. 😊
