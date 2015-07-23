# Unit 13 Distributed systems

## The goal in this project is to create a site that allows users to upload images.

Oftentimes for every image tyhat a user uploads you would usually want to crop it and resize it into different formats. We're using a little library to do this called gm. It relies on imagemagick and graphicsmagick to work. 

Processing images can take a lot fo computational power however and we could find our server really lagging down trying to do this work even with fast computers.

The code that processes this image is contained in `processor.js` feel free to dig in and change it if you want, all its doing is some crazy image processing.

Our goal in this challenge is to connect this worker and pass the filepath to it.

# Starting out

You'll want to check out the code in Roundrobin, theres a ton of interesting things going on in here but all this code basically does it story work and send it to the next available worker.


The code your going to want to write is in the `RoundRobin` `createWorker` method,  we need to create a child process to run our processor.js. this worker needs to have a `givework` method that has a function signature `function(filepath, next)` remember, next will automatically passed in.

Chjild processes are eventemmiters and we need to send it a datapacket with the filepath, when that childprocess emits a message, we need a function that will handle the data that emits as well.
