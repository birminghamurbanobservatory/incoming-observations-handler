# incoming-observations-handler

Handles incoming observations, giving them context, making sure they are quality controlled, and making sure they are saved.

# Responsibilities

Rather than having incoming observations passed on from microservice to microservice in a waterfall type approach, e.g:


```
ingester
   |
   V
sensor-deployment-manager
   |
   V
quality controller
   |
   V
observations-manager
   |
   V
http-forwarder, etc...
```

It makes more sensor to have this microservice manage the whole process, e.g:


```
ingester
   |
   V
incoming-observations-manager <--------->  sensor-deployment-manager
          |                         |
          |                         |---> quality controller                              
          |                         |
          |                          ---> observations-manager
          |                         
          V
    http-forwarder, etc...
```

This makes it far easier to remove/add extra microservices to the processing sequence.

Previously the incoming-observation-manager was communicating with the other microservices, e.g. the sensor-deployment-manager, using a RPC request/response type approach, but this was replaced with a series of queues instead. E.g. it will receive messages on the `observation.incoming` queue, then once validated at them to a `observation.add-context` queue, then listen for them to come back on a `observation.with-context` queue.
This approach was deemed better because [RabbitMQ](https://www.rabbitmq.com/tutorials/tutorial-six-javascript.html) suggests using asynchronous pipelines over RPC, and because loads of observations tend to arrive all at once, there the more we can keep them queued rather than waiting on loads of direct responses the better.