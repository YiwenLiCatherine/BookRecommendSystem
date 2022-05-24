## **Build, setup and configure** 

The system will be run under the *Lubuntu 20.4.1 LTS* environment (Virtual Machine provided from COMP9900 course), the following was run through Mozilla Firefox browser. 

**Set up and run on the local environment**

Before setup, ensure to upgrade the advanced packaging tool (apt):	

- `sudo apt update`

And download two packages:   

- `sudo apt install curl`
- `sudo apt install python3-pip`

Download and initialize: 

* install the code from through github

- If the git cloning is not possible, please download the zip file through the repository 

Run both the backend and the frontend using the following instructions

**backend**

- - Python 3.8.10 is already installed in the *Lubuntu 20.4.1 LTS* environment. Please open a terminal in the “Backend” folder and run the following commands:

  - - `pip install -r requirements.txt`
    - `python3 Apis.py` 

  After starting the backend successfully, you can run the frontend by following:

**frontend**

* Make sure the following requirements are install, the requirements can be installed using the following commands:

  * `curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -`

  - `sudo apt-get install -y nodejs`

  - Use `node -v` and `npm -v` to ensure that the verison of node is v16.14.2(or later). The version of npm is v8.3.1(or later).

- Open a new terminal in the “frontend” folder and start frontend through the following commands: 

  * `npm install`  (only run once)

  - `npm start` (if it shows “sh no script …” `npm install` again and retry again)

  - If the website does not pop up automatically in the browser, please go to the default starting URL at localhost:3000/ after the npm start command run sucessfully


