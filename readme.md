# Basic Concept

In order to Seperate Aspects of a server into micro processes we have to consider

1. The Server is able to be split up into services - Split them up and proxy
2. Certian Services can be duplicated and reduced - use load Balancer and Auto Scale
3. The intensive work a service my provide may be seperated from how it handles the requests - use load balancer and Auto Scale

Many of these should be able to be seen naturally

# Some Facts
1. Some Services will be requested more than others
  -Static Files, css, javascript
2. Some Services will not be needed to be duplicated more than others
  -Post requests do not occur as much as get requests
3. Under Predictable Scenarios, Some Services will be needed to duplicate more than others
  -If an attacker is attempting to brute force authentication, authentication routes will likely be hit hardest
4. Synchronization is can be done if there is one source for all data
5. If multiple services need to listen to the same events, its easier to emit them from one source

# Overview of a Service

### Request Response
1. Client sends Request to Server
2. Server directs request to a "Route"
3. route does work
4. route sends Client the response
5. Request/Response ends

### Persistant Connections
1. Client requests Persistan Connection to Server
2. Server directs request to a "Route"
3. Route does initial work on comming in
4. Listen for Client message
5. Listen for alternative events
6. Can Send the Client messages
7. Listen for Client end

### Cron Jobs
1. Time Event occurs
2. Do Work

### Work
1. Work may be cpu/gpu intensive (transform data)
2. Work may modify/request synchronized data
  -Need to store the data somewhere (database)
    - Memory
    - Filesystem
    - Custom handling of data
  -Need to be able to get the data on demand
    - Mulitple similar requests consolidated into one
3. Work may trigger other events
  -Need a manner for listeners to be added
  -need a manner for listeners to be removed


### Concepts
- Reverse Proxy
