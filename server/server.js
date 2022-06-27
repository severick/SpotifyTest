require('dotenv').config();
const express = require('express');
const request = require('request'); // "Request" library
const cors = require('cors');
const querystring = require('query-string');
const app = express();
app.use(express.static(__dirname + '/public'))
    .use(cors());

const client_id = process.env.CLIENT_ID;
const client_secret = process.env.CLIENT_SECRET;
const redirect_uri = process.env.REDIRECT_URI;
const server_address = 'localhost:8080'; // by default it should be http://localhost:8080 or 8081 by default
const frontend_server_port = process.env.PORT; // your Vue server port (8080 or 8081 by default)
const scope = 'user-read-email, user-read-playback-state, streaming, playlist-read-collaborative, user-modify-playback-state, playlist-modify-public, playlist-modify-private, user-library-modify, user-top-read, user-read-playback-position, user-read-currently-playing, app-remote-control, user-read-recently-played,user-library-read';

var corsOptions = {
    'origin': 'http://localhost:8080',
    'exposedHeaders': 'Location',
    'methods': 'GET, HEAD, PUT, PATCH, POST, DELETE',
    'preflightContinue': false,
    'optionsSuccessStatus': 200
}

app.get('/api/login', cors(corsOptions), function (req, res) {
    // redirect to Spotify login page
    res.writeHead(200, {
        'Location': `https://accounts.spotify.com/authorize` +
            `?client_id=${client_id}` +
            `&response_type=code` +
            `&redirect_uri=${redirect_uri}` +
            `&scope=${scope}` +
            `&show_dialog=true`,
        'Access-Control-Allow-Origin': req.headers.origin || '*'
    });
    res.send();
});

app.get('/api/refresh', function(req, res) {
    const authOptions = {
        url: 'https://accounts.spotify.com/api/token',
        form: {
            grant_type: 'refresh_token',
            refresh_token: req.headers.refresh_token
        },
        headers: {
            'Authorization': 'Basic ' + (new Buffer.from(client_id + ':' + client_secret).toString('base64'))
        }
    };

    request.post(authOptions, function(error, response, body) {
        if(!error & response.statusCode === 200) {
            res.json(body);



            // const access_token = body.access_token;
            // res.redirect('http://localhost:8080/?' +
            //     querystring.stringify({
            //         access_token: access_token,
            //         refresh_token: refresh_token
            //     }));
        }
    })    
});

app.get('/api/callback/', function (req, res) { //change '/callback' if your redirect_uri has different ending (without slash at the end)
    // after successful login make api call to get you profile's data
    const code = req.query.code || null;
    const authOptions = {
        url: 'https://accounts.spotify.com/api/token',
        form: {
            code: code,
            redirect_uri: redirect_uri,
            grant_type: 'authorization_code'
        },
        headers: {
            'Authorization': 'Basic ' + (new Buffer.from(client_id + ':' + client_secret).toString('base64'))
        },
        json: true
    };

    request.post(authOptions, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            const access_token = body.access_token;
            const refresh_token = body.refresh_token;
            //pass the tokens to the browser as a query params to make requests from there
            res.redirect('http://localhost:8080/?' +
                querystring.stringify({
                    access_token: access_token,
                    refresh_token: refresh_token
                }));
        } else {
            res.redirect(server_address +
                querystring.stringify({
                    error: 'invalid_token'
                }));
        }
    })
});

// port on with your Vue app is running
app.listen(8081);
