const express = require('express')
const cluster = require('cluster');
const os = require('os');

const app = express();

function delay(duration){
    const startTime= Date.now();
    while(Date.now() - startTime < duration){

    }
}

app.get('/', (req, res) =>{
    //by using the process.pid we can get to know the id of the current process
    //mater and worker process have different id
    res.send(`Perfomance Example ${process.pid}`);
});
app.get('/timer', (req, res) =>{
    delay(9000);

    res.send(`Ding Ding Ding ${process.pid}`);
});
/*
The worker process run the same code that we have in our server .js. The only way we differentiate our master process from the worker processes is by using the 
isMaster boolean flag.
*/
if(cluster.isMaster){
    console.log('Master has been started...');
    //As master is responsibel for handling and cordinating with the worker proscesses, We will create the worker process
    //when master process is running
    //When we have more number of requests comming in, creating ting this clusters one by one is not preferred
    // cluster.fork();
    // cluster.fork();
   const NUM_WORKERS = os.cpus().length;
   console.log(NUM_WORKERS)
   for(let i= 0; i< NUM_WORKERS; i++){
    cluster.fork();
   }
} else{
    console.log('Worker process started...');

    /*We want to listen to our incoming http requests only as a worker and handle them using express routes
    //Wither it is nodes http listen function or express's listen function, nodes cluster module understands the listen function
    node knows each of the workers will be listening the same port(3000) and the nodes http server knows how to devide the incomming requests between the worker processes
    in the console Worker "process started..." will be logged twice as we have 2 workers running an the code for each process is the same, mster process will also run the same code
    the only difference id the cluster.isMaster falg
    */
    app.listen(3000);
}



//here we are just waiting for 9 seconds , at this moment if we get any other request
//that wont be executed until the waiting time is over. So here we are blocked for the 9 sconds

//This code will be run by both master and worker process
console.log('Running server.js ...')

/*
Whenever we run server.js to start our node application, The main node process is created, Which is called The master process. Inside cluster module we have a fork() function
Whenever we call this fork() function node takes the master process and creates a copy of it, Which is called Worker process. We can call this fork() how many times we like and 
create any number of worker process. Each worker contins the required to respond any kind of request in our server. The Master is only responsible for cordinating with the worker process
So for eg: If we call the fork() twice, We will have three node processes, 1 master and 2 worker process
The workers accepts the request in round robin approach, If ther are 3 requests coming in worker 1 will receive 1st req, worker 2 will receive 2 req, Req 3 will be received by 
the worker who ever gets free earlier
*/

/*
Browsers sometimes try to be clever by checking if we are making 2 requests to the same end point, it will wait for the first response of the 1st request before even making the 
second request, to avoid this in the network tab disable the cache, so that chrome will make the requests side by side at the same time
*/

/*
On the round robin approach, because of how windows manage processes node makes no guarntee on using the round robin approach
*/