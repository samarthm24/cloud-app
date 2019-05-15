const http = require('http')
const forward = require('http-forward')
const request = require('request');
const { exec } = require('child_process'); 
var containers = {'8000':'docker'};
var count=0;
var k;
var p;
var lines;
var container_object = {'exit_code':125,'container_id':'not_set'};
global.valid;
var no_req = 0;
var no_cnt = 0;
var dump = {'8000':'docker'}





function check_port(port,callback){
	request('http://localhost:'+port+'/api/v1/_health', { json: true  }, (err, res, body) => {
		if(err){
			console.log("error connecting to port ",port,err);
			callback(-1,port,set_container_id);
		}
		else{
			console.log("status code of port ",port,res.statusCode);
			if(res.statusCode!=200){
				callback(0,port,set_container_id);
			}
			else{
				console.log(port,"working fine");
			}
		}
	});
}

function create_container(valid,port,callback){
	var prt = port;
	if(valid == 0){
		container_id = containers[port];
		console.log("deleting container with port ",port," and container_id ",container_id);
		prc = exec('sudo docker kill '+ container_id);
		prc.on('close', function (code) {
	        console.log('process exit code ' + code);
	    });
	}
	prc = exec('sudo docker run -d -p '+ port+':8000  acts');
    prc.stdout.setEncoding('utf8');
    prc.stdout.on('data', function (data) {
	    var str = data.toString()
	    lines = str.split(/(\r?\n)/g);
	    console.log(lines.join(""));
	    container_object["container_id"] = lines[0];
	    dump[prt] = lines[0];
	});
	prc.on('close', function (code) {
        console.log('process exit code ' + code);
        container_object["exit_code"] = code;
        if(code == 0){
    	containers[prt] = dump[prt];
    	console.log("dump",dump);
    }
    });
}

function delete_container(port){
	container_id = containers[port];
	console.log("deleting container with port ",port," and container_id ",container_id);
	prc = exec('sudo docker kill '+ container_id);
	prc.on('close', function (code) {
        console.log('process exit code ' + code);
    });
    delete containers[port];
}

function set_container_id(port,container_id){
	containers[port] = container_id;
	console.log("set container id of port ",port," to ",container_id);
}

create_container(-1,'8000',set_container_id);

console.log(containers);
setInterval(function(){ 
	var ports = Object.keys(containers);
	for(i=0;i<ports.length;i++){
		check_port(ports[i],create_container);
		console.log(containers);
	}
}, 3000);


function start(){
	setInterval(function(){ 
		var ports = Object.keys(containers);
		last2Mins_req = no_req;
		console.log("started scaling",last2Mins_req);
		no_req = 0;
		if(last2Mins_req<20){
			if(ports.length>1){
				for(i=1;i<ports.length;i++){
					delete_port = 8000+i;
					delete_container(delete_port);
				}
			}
		}
		else{
			var k=Math.floor(last2Mins_req/20);
			// while((last2Mins_req>=k*20) && (last2Mins_req<=20*(k+1)))
			// {k++;};

			console.log(++k);
			if(ports.length>(k))
			{
				for(i=k;i<ports.length;i++)
				{
					delete_port=8000+i;
					delete_container(delete_port);
				}


			}
			else if (ports.length<k)
			{
				for(i=ports.length;i<k;i++)
				{
					create_container(-1,8000+i,set_container_id);
				}
			}

		}

	}, 120000);
}

var server = http.createServer(function (req, res) {
  console.log(req.url);
//var res = str.slice(-1);
  if((req.url.search("_health")==-1) && (req.url.search("_crash")==-1) && (req.url[req.url.length-1]!='/')){
  	no_req+=1;
  	no_cnt+=1;
  }
  if(no_cnt == 1){
  	console.log("calling that");
  	start();
  }
  console.log(no_req);
  flag=1;
  ports = Object.keys(containers);
  port=ports[count%ports.length]
  count=count+1
  console.log("accsinjds",port)
  req.forward = { target: 'http://localhost:'+port }
  forward(req, res)
})
 
server.listen(3000)
