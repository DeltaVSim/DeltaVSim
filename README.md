## Inspiration
We were deeply inspired by Mr. Nicholas Lima’s experiences and journey as an aerospace engineer, particularly his work on spacecraft landings at SpaceX.

## What it does
DeltaVSim is a simulator that enables users to program their own PID controller algorithms and test them in various scenarios and levels.

## How we built it
We developed DeltaVSim primarily using JavaScript, leveraging Express.js and WebGL, and hosted it through a reverse proxy with NGINX.

## Challenges we ran into
Most of the challenges we encountered were related to graphics bugs, where the simulator failed to accurately display the intended visuals. Additionally, we ran into some hosting issues regarding our DNS records incorrectly propagating. 

## Accomplishments that we're proud of
We take pride in our simulator’s logic, physics engine, and its clean, user-friendly design. In addition, while DeltaVSim was mostly written in JavaScript, we successfully utilized a tool called Brython, which allowed us to transpile the Python code entered by the user for their PID controller into JavaScript. (Python is better suited for coding PID controllers than JavaScript.)

## What we learned
We gained a lot of valuable knowledge about WebGL, 3D graphics, and the underlying physics concepts essential to our project.

## What's next for DeltaVSim
We plan to complete the development of our Q-learning algorithm, allowing users to optimize and fine-tune their PID control algorithms efficiently. Furthermore, we will implement a way for the user to save their code and progress on a particular level.  

## How to use?
Simply go to [link](https://deltavsim.robert.directory/), and follow the directions on our home page. 
