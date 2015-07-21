//Insert Load Balancer Here

/*

  create 2 Servers
  1) public Facing - HTTP Proxy
  2) Private Facing - TCP/Persistant Connection

  When A Duplicate Comes online
    -It makes a connection to the proxy
    -It sends its own IP Address to the proxy
    -It sends the subdomain/Route that the proxy should watch for

  When a new HTTP Requests comes in
    -Find routes
    -Make request on behalf
*/

