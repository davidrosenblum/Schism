# Schism

![Schism](https://raw.githubusercontent.com/davidrosenblum/schism/master/src/app/assets/images/ui_logo.png "Schism")

### Environment Setup
1. Install [MongoDB]([https://www.mongodb.com/download-center/community](https://www.mongodb.com/download-center/community)) (4.2.x reccommended)
2. Install [Node.js and NPM]([https://nodejs.org/en/](https://nodejs.org/en/)) (10.9.x or higher reccommended)
3. `npm i`
4. `npm run build`
5. `npm start`


### Common Errors

Getting this error?

WebSocket connection to 'wss://localhost:8080/' failed: Error in connection establishment: net::ERR_CERT_COMMON_NAME_INVALID

Go to https://localhost:8080 in your browser, it will give you an untrusted site warning.

Click proceed to localhost.

Now, ws://localhost:8080 should work using the localhost:3000 client to connect.

Getting constant socket connection errors when trying to login?

Make sure you have the `port=8080` query string (or whatever port the server is running on) in the browser! 

### Settings File
```javascript
{
	"port": 8080,
	"mongoUri": "mongodb://localhost:27017/schism",
	"wsOrigin": "*",
	"popLimit": 50,
	"ssl": {
		"pfxFile": "",
		"pfxPassphrase": "",
		"keyFile": "",
		"crtFile": ""
	}
}
```

### Environment Variables


| Variable  | Type    | Description                            | Default                          | Example                                  |
|-----------|---------|----------------------------------------|----------------------------------|------------------------------------------|
| PORT      | Integer | Server will bind to this port          | 8080                             | PORT=8080                                |
| MONGO_URI | String  | Database connection uri                | mongodb://localhost:27017/schism | MONGO_URI=mongodb://localhost:27017/test |
| WS_ORIGIN | String  | Enforced websocket origin              | *                                | WS_ORIGIN=test.com                       |
| POP_LIMIT | Integer | Max simultaneous websocket connections | 50                               | POP_LIMIT=99                             |
| KEY       | String  | SSL .key file                          | ""                               | KEY=certs/local.key                      |
| CRT       | String  | SSL .crt file                          | ""                               | CRT=certs/local.crt                      |
| PFX       | String  | SSL .pfx file                          | ""                               | PFX=certs/local.pfx                      |
| PFX_PP    | String  | SSL .pfx file's passphrase             | ""                               | PFX_PP=myPassphrase                      |

  

### Browser Query Strings


| Parameter | Type    | Description               | Example       |
|-----------|---------|---------------------------|---------------|
| port      | Integer | Server port for websocket | port=8080     |
| username  | String  | Default username          | username=test |
| password  | String  | Default password          | password=123  |
| dev_map   | Boolean | Map builder mode          | dev_map=true  |
| test      | Boolean | Graphics test mode        | test=true     |
  


