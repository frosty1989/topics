# Outline
- Prerequisites for uuApp project
- uuApp Deployment Requirements
- uuApp Local Deployment
  1. Prepare uuApp
  2. IntelliJ settings
  3. NPM repository configuration
  4. Install and run client
  5. Install and run server
- uuApp Initialization
  1. Initialize uuAppWorkspace
  2. Configure profiles and permissions
  3. Test functionality
- uuApp Distribution Package Creation

# Prerequisites
- Node.js 8.4+
- MongoDB 3.4+1

# uuApp Deployment Requirements

! Specify application deployment requirements here.

Example: 

- 1x TID
- 1x ASID + sysOwner uuIdentity
- 1x AWID + sysOwner uuIdentity
- 1x OSID (or a MongoDB connection string for local development)
      
# uuApp Local Deployment

1. Prepare uuApp
2. Install and run client

## 1. Prepare uuApp

1. Rename project uu_appg01_template-uu5-javascript to new project name.
           
   Rename folders uu_appg01_main-client, uu_appg01_main-design, uu_appg01_main-server according project name.

2. Disconnect from git repository
    
    > git remote rm origin
    
    If you have new repository for new project, you can connect it with
    
    > git remote add origin ssh://git@codebase.plus4u.net:9422/<new_repozitory>.git
    
    Verify with
    
    > git remote -v        
     
       origin  ssh://git@codebase.plus4u.net:9422/<new_repozitory>.git (fetch)
       origin  ssh://git@codebase.plus4u.net:9422/<new_repozitory>.git (push)
  
## 2. IntelliJ settings
For proper configuration of your IDE go to Settings - Languages & Frameworks - JavaScript and select ECMAScript 6 JavaScript version. 
Also go to Settings - Languages & Frameworks - Node.js and NPM and enable Node.js Core library.

## 3. NPM repository configuration
**This step is no longer required as _.npmrc_ file with NPM repository configuration has been added to the project root folder.**

To install uuAppg01 node modules, NPM repository has to be configured to [https://repo.plus4u.net/repository/npm/](https://repo.plus4u.net/repository/npm/).

NPM repository can be configured in command line:
   > npm config set registry https://repo.plus4u.net/repository/npm/

Another way to configure NPM repository is to manually edit file .npmrc in you home folder (or create it if does not exist) and add following line:   
  
     registry=https://repo.plus4u.net/repository/npm/
     
_Note that only one NPM repository can be configured at the same time. Plus4u repository has set proxy to [https://www.npmjs.com](https://www.npmjs.com) so it can install also third party modules._          
    
## 4. Install and run client

1. Change project name
    Edit app.json and change values of attributes name, code, description and vendor. For name use (a-z), number (0-9) and chars (_-.). For code use (A-Z), number (0-9) and chars (_-.).

2. Installation
    Open client folder and execute install in command line:

    > cd <your client folder name e.g. uu_appg01_main-client> 
    > npm install

3. Run
    Execute command (in folder *_main-client):

    > npm start

4. In case of developing only client side of application you can open Index in browser - [localhost](http://localhost:1234/)

## 5. Install and run server
1. Mongo DB Installation and startup
    - Download Mongo DB for windows from [MongoDB](https://www.mongodb.com/download-center?jmp=nav#community)
    - Execute downloaded executable and choose complete installation.
    - Run command line. Open "C:\Program Files\MongoDB\Server\3.x\bin" and execute

      > mongod.exe

     ! This installation is only for development only !
    - Recommended client is [Robo 3T](https://robomongo.org) for database administration.
    - Documentation with detailed information is available on [Documentation](https://plus4u.net/ues/sesm?SessFree=ues%253AVPH-BT%253AUAFTEMPLATE)
2. Configure server
    - Edit configuration uu_appg01_main-server/development.json and replace <uuSubAppInstanceSysOwner> with your uuIdentity.
3. Make you sure that command "npm run dist" (chapter uuApp Distribution Package Creation) in folder uu_appg01_main-client was called before next step.
4. Installation
    Open server folder and execute install in command line:

    > cd <your server folder name e.g. uu_appg01_main-server> 
    > npm install
5. Run
    Execute command (in folder *_main-server):

    > npm start
    
    Application starts locally on default port 6221 and can be accessed e.g. with browser (http://localhost:6221/uu-demoappg01-main/0-0/home).

    _Note that you should be able to access home page. But error will raise after you run any command from demo except /echo. It is due uuAppWorkspace isn't initialized yet. Follow next chapter to do so._
# uuApp Initialization
! Obtain authentication token from [showToken VUC](https://oidc.plus4u.net/uu-oidcg01-main/0-0/showToken). 
  After login it shows token. This key must be used as Authorization header with value "Bearer <token>" in all following calls.

1. Initialize uuAppWorkspace
2. Configure profiles and permissions
3. Test functionality

## 1. Initialize uuAppWorkspace


    Use any rest client and call following calls

    POST http://localhost:6221/uu-demoappg01-main/00000000000000000000000000000000-00000000000000000000000000000001/sys/initAppWorkspace
    Request body:
    {
        "awid": "11111111111111111111111111111111",
        "sysOwner": "<uuIdentity>",
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
    Request initialize workspace for demo application.

## 2. Configure profiles and permissions

    Use any rest client and call following call

    POST: http://localhost:6221/uu-demoappg01-main/00000000000000000000000000000000-11111111111111111111111111111111/sys/setProfile
    Request body:
      {
          "code": "Guests",
          "roleUri": "urn:uu:GGALL"
      }
    Request sets all users as Guests for public rights.

## 3. Test functionality

   Open Index in browser - [Home](http://localhost:6221/uu-demoappg01-main/00000000000000000000000000000000-11111111111111111111111111111111/home).
   
   You can also execute any command from the template application (e.g. /createBook).
   
# uuApp Distribution Package Creation

1. Install npm modules if they are not installed

    > cd main/client
    > npm install

2. Build client
    Execute command (in folder main/client):

    > npm run dist

    Performs build into ../server/public/ folder.

2. Package server

    > cd main/server
    > npm run build

    Performs build into ../server/target/ folder.
