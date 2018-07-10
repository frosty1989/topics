## Prerequisites
- Node.js 8.4+
- MongoDB 3.4+1

## uuApp Deployment Requirements
- 1x TID
- 1x ASID + awidOwner uuIdentity
- 1x AWID + awidOwner uuIdentity
- 1x OSID (or a MongoDB connection string for local development)
      
## IntelliJ settings
For proper configuration of your IDE go to Settings - Languages & Frameworks - JavaScript and select ECMAScript 6 JavaScript version. 
Also go to Settings - Languages & Frameworks - Node.js and NPM and enable Node.js Core library.

## Install and run server
1. Mongo DB Installation and startup
    - Download Mongo DB for windows from [MongoDB](https://www.mongodb.com/download-center?jmp=nav#community)
    - Execute downloaded executable and choose complete installation.
    - Run command line. Open "C:\Program Files\MongoDB\Server\3.x\bin" and execute

      > mongod.exe

     ! This installation is only for development only !
    - Recommended client is [Robo 3T](https://robomongo.org) for database administration.
    - Documentation with detailed information is available on [Documentation](https://plus4u.net/ues/sesm?SessFree=ues%253AVPH-BT%253AUAFTEMPLATE)
2. Configure server
    - Edit configuration uu_jokesg01_main-server/development.json and replace <asidOwner> with your uuIdentity.
3. Installation
    Open server folder and execute install in command line:

    > npm install
4. Run
    Execute command (in folder uu_jokesg01_main-server):

    > npm start
    
    Application starts locally on default port 6221.
	
# uuApp Initialization
! Obtain authentication token from [showToken VUC](https://oidc.plus4u.net/uu-oidcg01-main/0-0/showToken). 
  After login it shows token. This key must be used as Authorization header with value "Bearer <token>" in all following calls.

1. Initialize uuApp
2. Initialize uuAppWorkspace
3. Configure profiles and permissions
4. Test functionality

## 1. Initialize uuApp
Initialize uuApp and change runtime mode to STANDARD to allow calls of unprivileged commands.

    Use any rest client and call following calls

    POST http://localhost:6221/uu-demoappg01-main/00000000000000000000000000000000-00000000000000000000000000000001/sys/initApp
    Request body:
    {
        "runtimeMode": {
            "mode": "standard"
        }     
    }
        




## 2. Initialize uuAppWorkspace


    Use any rest client and call following calls

    POST http://localhost:6221/uu-jokesg01-main/00000000000000000000000000000000-00000000000000000000000000000001/sys/initAppWorkspace
    Request body:
    {
        "awid": "11111111111111111111111111111111",
        "awidOwner": "<uuIdentity>",
        "licenseOwner" : {
            "organization" : {
                "name" : "Unicorn a.s.",
                "oId" : "154156465465162",
                "web" : "http://www.unicorn.com/"
            },
            "userList" : [
                {
                    "uuIdentity" : "1-1",
                    "name" : "Vladimír Kovář"
                }
            ]
        }
    }
    ! Replace <uuIdentity> with your uuIdentity id.
    Request initialize workspace for local application.

## 3. Configure profiles and permissions

Use any rest client and call following call

    POST: http://localhost:6221/uu-jokesg01-main/00000000000000000000000000000000-11111111111111111111111111111111/sys/setProfile
    Request body:
    {
        "code": "Readers",
        "roleUri": "urn:uu:GGALL"
    }
Request sets all users as Readers for public rights.

After that, it's necessary to initialize the application. To do so, execute _init_ uuCMD:
Replace _<uuGroup>_ by desired Plus4U location, e.g. ues:UNI-BT:USYUAB/COWORKERS

    POST: http://localhost:6221/uu-jokesg01-main/00000000000000000000000000000000-11111111111111111111111111111111/init
    Request body:
    {
    	"uuAppProfileAuthorities": "<uuGroup>"
    }

#Test functionality

The application does not provide any UI. 
All the requests has to be executed by your favorite REST client.
The endpoint of API is:
    
    http://localhost:6221/uu-jokesg01-main/00000000000000000000000000000000-11111111111111111111111111111111/


