//Insert Load Balancer Here

/*

  create 2 Servers
  1) public Facing - HTTP Proxy
  2) Private Facing - TCP/Persistant Connection

  When A Duplicate Comes online
    -It makes a connection to the Load Balancer
    -It sends its own IP Address to the load balancer
    -They communicate over this over the future

  When a new HTTP Requests comes in
    -Find next worker
    -Proxy Request to that worker
*/

