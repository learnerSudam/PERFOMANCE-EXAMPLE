const express = require('express')
const cluster = require('cluster');

const app = express();

function delay(duration){
    const startTime= Date.now();
    while(Date.now() - startTime < duration){

    }
}

app.get('/', (req, res) =>{
    res.send(`Perfomance Example ${process.pid}`);
});
app.get('/timer', (req, res) =>{
    delay(9000);

    res.send(`Ding Ding Ding ${process.pid}`);
});

console.log('Running server.js ...')

app.listen(3000);


/*
Pm2 is useful because it is built uopn clusters, We dont need to create forks , while starting the server 
we can define how many clusters to start, pm2 start i -max for using all processes

*/
