# cloud-app
A simple app with Rest APIs for posting pictures and upvoting. 
Built using Node JS, mongo DB.
Included dockerfile for dockerization.

Orch.js is a simple container orchestrator which does :
  - auto scaling
  - fault tolerance
  - load balancing
# to run containers
docker build --t=users .

docker build --t=acts .

docker run -p 80:8000 users

docker run -p 8000:8000 acts

# to run orchestrator
node orch.js
