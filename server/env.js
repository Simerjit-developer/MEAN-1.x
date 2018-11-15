var path = require('path'),
	rootPath = path.normalize(__dirname + '/../../');
	
module.exports = {
	development: {
		rootPath: rootPath,
		db: 'mongodb://dostuser:dostpwd@ds143231.mlab.com:43231/dost_new',
		port: process.env.PORT || 3001
	},
        production: {
		rootPath: rootPath,
		db: 'mongodb://dostuser:dostpwd@ds143231.mlab.com:43231/dost_new',
		port: process.env.PORT || 3001
	}
//	production: {
//		rootPath: rootPath,
//		db: process.env.MONGOLAB_URI || 'you can add a mongolab uri here ($ heroku config | grep MONGOLAB_URI)',
//		port: process.env.PORT || 80
//	}
};