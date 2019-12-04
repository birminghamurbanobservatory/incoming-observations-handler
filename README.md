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