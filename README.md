# Outline

- uuApp Local Deployment
- uuApp Distribution Package Creation

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
  

## 2. Install and run client

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
    > rake uuapps:package

