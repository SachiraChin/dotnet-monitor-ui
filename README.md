# dotnet-monitor UI

This project is created as an easy to access user experience for `dotnet-monitor` tool which can be found [here](https://github.com/dotnet/diagnostics). If you haven't read original article about this, please read [this](https://devblogs.microsoft.com/dotnet/introducing-dotnet-monitor/) to get better understanding about features available in this tool.

## Features

In the landing page, user can setup endpoints of the `dotnet-monitor` tool and after clicking `Reload` (application will try to access default endpoint urls on load and show processes if it's available), all available processes from `dotnet-monitor` will be shown in list like this. In the list, user can use `Download` button to download dumps, gcdumps or traces with default parameters. But if user wants to fine-tune input for each endpoint, user can click `More` button to goto process page.
![Landing page](documentation/images/home.png?raw=true "Landing page")

Process page has expansion panes to each available endpoint from `dotnet-monitor`. Those functions are `dump`, `gcdump`, `trace` and `logs`.
![Alt text](documentation/images/process-home.png?raw=true "Title")

### dump

`/dump` endpoint supports one parameter called `type`. From the UI, user can select supported types and click download to download dump file.
![Alt text](documentation/images/dump.png?raw=true "Title")

### gcdump

`/gcdump` does not support any input parameters for download the file. Download button has added here so that user can see it as an option, but downloading gcdump from landing page and from here doesn't make any difference.
![Alt text](documentation/images/gcdump.png?raw=true "Title")

### trace (GET)

`/trace` endpoint supports both GET and POST requests which used for different types of inputs. GET endpoint supports 3 parameters, `durationSeconds`, `profile` and `metricsIntervalSeconds`. Values for each of these parameters can be entered/selected from the UI and clicking download button will download trace file with selected parameters.
![Alt text](documentation/images/trace-get.png?raw=true "Title")

### trace (POST)

`/trace` POST endpoint supports more advanced input which can be entered in UI. This endpoint supports `durationSeconds`, `requestRundown`, `providers` and `bufferSizeInMB`. User can enter multiple providers using table and can configure different parameters for each provider. I want to add here that, my knowledge about providers in this context is very low, I will update content here once I know more about it.
![Alt text](documentation/images/trace-post.png?raw=true "Title")

### logs

This is the endpoint I enjoyed the most making. `/logs` endpoint gives stream of logs from given process. This endpoint supports `durationSeconds` and `level` parameters. `durationSeconds` is the duration it will stream logs, `level` parameter allows users to get logs in even higher level even if application is configured to write logs in low level. When user start the stream, it will update the table below with logs received from the endpoint.

Apart from inputs for API endpoint, I've added few more features in UI so user can navigate through logs easily. User can filter logs by log level, event id, category or input text. Dropdown values for filters gets automatically updated while stream is going on, for example, if new category is found in the stream, it will be added to the categories filter. These values can be changed while stream is running, but be warned that there can be lags when these are edited while stream is on.
![Alt text](documentation/images/logs.png?raw=true "Title")

## I want to try it out

Well, I want to say it is easy-peasy to see this in action, but unfortunately you have to go through bit of trouble to get it up and running at the moment.

Current `dotnet-monitor` tool does not support CORS rules to be added to it's REST server. Because of this, client side app like this cannot send direct queries to the REST endpoints without having few changes in the app itself. I have discussed this in detail in [this issue](https://github.com/dotnet/diagnostics/issues/1346) in the original repository.

You can follow below steps to run the application in your machine.

1. Clone repository I mentioned in above ticket locally which has support to CORS rules. [https://github.com/SachiraChin/diagnostics/](https://github.com/SachiraChin/diagnostics/)
2. Open the solution(`diagnostics.sln`) in Visual Studio and navigate to `src -> Microsoft.Diagnostics.Monitoring.RestServer -> appsettings.json`
3. Add below section to it.

```json
  "CorsPolicy": {
    "IsOriginAllowed": null,
    "ExposedHeaders": [ "*" ],
    "Headers": [ "*" ],
    "Methods": [ "*" ],
    "Origins": [ "http://localhost:4200/" ],
    "PreflightMaxAge": null,
    "SupportsCredentials": false
  }
```

4. Now set `src -> Microsoft.Diagnostics.Monitoring.RestServer -> Tools -> dotnet-monitor` as start up project
5. Start debugging
6. Clone this repository
7. Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. 

## Further work

This tool does not support `/metrics` endpoint available in `dotnet-monitor` tool. Next steps would be get integration for that.

## Conclusion

I thought this is a nice addition to awesome features provided in `dotnet-monitor`. You are open to check this out, make changes and ask me questions. Please note that effort I put here is nothing compared to original `dotnet-monitor` tool. If anything, because they implemented it so nicely that I was able to query and get results without having lots of troubles in my side.

Thanks for checking out this tool!
