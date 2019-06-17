'use strict';

const http = require('http');

const server = http.createServer((req, res) => {
	req.setEncoding('utf-8');

	req.on('data', chunk => {
		const msg = JSON.parse(chunk);
	});
});
// server.on('request', (req, res) => {
// 	req.setEncoding('utf-8');
// 	if (req.url === '/q' && req.method === 'POST') {
// 		let data = '';
// 		req.on('readable', () => {
// 			data += req.read();
// 		});
// 		req.on('end', () => {
// 			// const kv = querystring.parse(data);
// 			// for (let e of Object.entries(kv)) {
// 			// 	console.log(e);
// 			// }
// 			console.log(data + '');
// 			res.end(data);
// 		});
// 	}
	// // '/'にアクセス index.html(テスト用のGET/POSTフォーム)を表示
	// if (req.url === '/' && req.method === 'GET') {
	// 	// index.htmlを読み込む
	// 	fs.readFile(__dirname + '/index.html', {
	// 		encoding: 'utf8'
	// 	}, (err, html) => {
	// 		// ファイルの読み込みに失敗したらエラーのレスポンスを返す
	// 		if (err) {
	// 			res.statusCode = 500;
	// 			res.end('Error!');
	// 		} else {
	// 			// ファイルの読み込みが成功したらHTMLを返す
	// 			res.setHeader('Content-Type', 'text/html');
	// 			res.end(html);
	// 		}
	// 	});
	// // '/postPage'にアクセス かつ POSTリクエストだったら
	// } else if (req.url === '/postPage' && req.method === 'POST') {
	// 	var data = '';
	// 	//readableイベントが発火したらデータにリクエストボディのデータを追加
	// 	req.on('readable', function (chunk) {
	// 		data += req.read();
	// 	});
	// 	//リクエストボディをすべて読み込んだらendイベントが発火する。
	// 	req.on('end', () => {
	// 		querystring.parse(data);
	// 		res.end(data);
	// 	});
	// // '/getPage'にアクセス かつ GETリクエストだったら
	// } else if (req.url.indexOf('/getPage?') == 0 && req.method === 'GET') {
	// 	var str = '';
	// 	var data = url.parse(req.url, true).query;
	// 	// 連想配列から取り出す
	// 	for (var key in data) {
	// 		str += key + '=' + data[key] + '&';
	// 	}
	// 	res.end(str);
	// } else {
	// 	res.statusCode = 404;
	// 	res.end('NotFound');
	// }
// });

// console.log('listen');
server.listen(8888);
