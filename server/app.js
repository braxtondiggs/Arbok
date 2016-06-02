/**
 * Main application file
 */

'use strict';

import express from 'express';
import cors  from 'cors';
import config from './config/environment';
import http from 'http';

// Setup server
var app = express();
var server = http.createServer(app);
var firebase = require('firebase');

app.use(cors());
require('./config/express').default(app);
require('./routes').default(app);

// Start server
function startServer() {
	app.angularFullstack = server.listen(config.port, config.ip, function() {
		console.log('Express server listening on %d, in %s mode', config.port, app.get('env'));
	});

	firebase.initializeApp({
		serviceAccount: {
			projectId: 'project-5031518690366493269',
			clientEmail: 'server@project-5031518690366493269.iam.gserviceaccount.com',
			privateKey: '-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCUba7HiEqkEtNh\nNIMU68u2qx8UMYL3Z9+zRH+6bRVccecYnHidSRpVS2r0eufJhlh436CSwaC1G4AR\nheLzg7zrzyynQZ0mYvs0YVx3p1A3oTD3kKL8BtCcv6sVra4O4ghD+PfKZU/e32CX\nsdF0Y99WKPaV0UOeSjNbAu+/SucsT9urfSFlEU9eAFR10mlEaRU6AB3zprniqwRG\nJRin5YpYldXWXWcCmcVCMBciqQ9CSyFPLXfxWjYxrnm7Bbr+70/qCfGv2FyVagfR\nvEIwezrQumBy0we93iVwK0YQkybjFKOGMyhGQT78wDZvki+j+YSICGb+Vml3PTOw\n69C3Uho7AgMBAAECggEAKSmt4fojMRNjeb61Z5To/vS//rqoZnJxMGcbwRjFZsjT\n3RhvvrbqTaNHuxtmspXGbWcfQfPe3LsOrk1iHkR3nTHsYUoqCd5Dakhh+3D0JylV\nyiJbgOdm7UGecbmj3s7Cmg8usPudxeJPCGKxAsU7x8o+cFgDl59eVKwgzv031Sq2\nNqEshL7da99cs7M0oBZZ5a+qmKzDh967/DcY562mD/jYYgJ8imBtshIjKtQLxY61\nCAW8F/TM+Xp0htObzh/7s9X9cJXd/zAIi3ZwOcEwsR0JQ4hcoFkU0khmx0bGpXYi\n2LVE5gQIrOdsW4+KYeDG7L7lb9+pAlpvqmbibr3wmQKBgQDtdiJIwGcz18DHG2VO\nzkuFb9Qu5fQUG9IsU6sumdJVVZgJp3X044IGsO0+VCqoFUvFZ/YEyBhiPSbqGPv5\nd3eJ7//u8/0J2t8CuC+7Hv++DfeHDWddz+rK1pkAfI1dLMZWeB7Cogr9fCbICXCw\nmaLfiHxOJPUhHNyZgwuuq6rs3QKBgQCgBCZHJLVYYGPbHgBqr+EqCYFUMfLCyJNn\nt2MmmMA7/T7ze7Lp/TfUZIAdUWKh6r9nTU9dci2aOtK4VeCIlgySnDir3J1hyPrj\nlXxORhIqV/Ey1Gddk8feyP5OFxtE4nPDdUROfs1ozRhZm/r1sFwDiAILbdoCXPLd\nEo5w0NBF9wKBgQDfqBfsjAPoSXtSTZRi4F0zZjvknEQDOJ0BkSC3eLwqEb9swGSS\nbkKGyNf7j8zJmZ1PZnbK1ChbRxvC/BtAQWy+5+UYDIi1YogQCKk0RqM8P+13L4G/\nU1jjCbL8SVPggY6h3OukCHnvfKMOYA3a2CoW/neOJrMXKBcDI/G56AjKpQKBgAdc\niYJGXw1kydM/yxcdZkdvzoJYFen+HkHsPuR8rINWADplW3LGUnYz9Wzj3JzEVu/i\nr58F7LEmuaD/WmgONx/bjgPiD197RoeHzgMv2BAYoaEMAoFclhpattBS4c9Gd7rr\nPyw5SyviG5erxFzfMyx6alWqRRhMvGONQf5QrPQ7AoGANAjCGDcFyXFVGu6NEwN5\nxHuCAJL51h6Sc6xU73Ve72dDVsREuaMAsx0PT6hEzPi84t/nA/wqxJhHWOpDWGiY\nmlRvz6V3DIboyXZJ1XDFzpoutyPCoPZAozurNnSV8wlvGbUZOUSiUXeXXh+REbzh\nzFWWATbkTyGxZvJgDvLC+mE=\n-----END PRIVATE KEY-----\n',
		},
		databaseURL: 'https://arbok.firebaseio.com'
	});
}

setImmediate(startServer);

// Expose app
exports = module.exports = app;