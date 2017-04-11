const util = require('util');

const helpers = {
	readCookie: (req, cookieName) => {
		const cookies = ` ${req.headers.cookie}`;
		let a = cookies.split(';');
		console.log(a);
		for (let i in a) {
			let b = a[i].split('=');
			console.log(b);
			if (b[0] == ` ${cookieName}`) {
				console.log(b[1]);
				return b[1];
			}
		}
		return null;
	}
}

module.exports = helpers
