/**
 *
 * Main (JS)
 *
 * @author Takuto Yanagida @ Space-Time Inc.
 * @version 2019-01-20
 *
 */


'use strict';

const { app, globalShortcut } = require('electron');
const require_ = (path) => { let r; return () => { return r || (r = require(path)); }; }

const FS      = require_('fs');
const PROCESS = require_('process');
const Twin    = require('./twin.js');


class Main {

	constructor() {
		this._isReady = false;
		const gotTheLock = app.requestSingleInstanceLock()
		if (!gotTheLock) app.quit();

		this._twins = [];
		this._twinId = 0;
		this._focusedTwin = null;
		let path = this._getArgPath();

		app.setName('Croqujs');  // for Mac
		app.on('activate', () => { if (this._twins.length === 0) this._createNewWindow(); });  // for Mac
		app.on('will-finish-launching', () => {  // for Mac
			app.on('open-file', (ev, p) => {
				ev.preventDefault();
				path = this._checkArgPath(p);
				if (this._isReady) this._createNewWindow(path);
			});
		});
		app.on('ready', () => {
			this._createNewWindow(path);
			this._isReady = true;
			globalShortcut.register('CmdOrCtrl+F12',       () => { this._focusedTwin.toggleFieldDevTools(); });
			globalShortcut.register('CmdOrCtrl+Shift+F12', () => { this._focusedTwin.toggleStudyDevTools(); });
		});
		app.on('second-instance', (ev, argv, workDir) => {
			const path = (argv.length === 1) ? null : this._checkArgPath(argv[argv.length - 1]);
			this._createNewWindow(path);
		})
		app.on('browser-window-focus', (ev, win) => { this._focusedTwin = this._twins.find(t => t.isOwnerOf(win)); });
		app.on('window-all-closed', () => {
			globalShortcut.unregisterAll();
			app.quit();
		});
	}

	_getArgPath() {
		const argv = PROCESS().argv;
		if (argv.length === 1) return null;
		return this._checkArgPath(argv[argv.length - 1]);
	}

	_checkArgPath(path) {
		try {
			if (!FS().existsSync(path)) return null;
			if (FS().statSync(path).isDirectory()) return null;
		} catch (e) {
			return null;
		}
		return path;
	}

	_createNewWindow(path = null) {
		this._twinId += 1;
		new Twin(this, this._twinId, path);
	}

	onTwinCreated(t) {  // Called By Twin
		this._twins.push(t);
	}

	onTwinDestruct(t) {  // Called By Twin
		this._twins.splice(this._twins.indexOf(t), 1);
	}

}

const main = new Main();
