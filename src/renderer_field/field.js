/**
 *
 * Field (JS)
 *
 * @author Takuto Yanagida @ Space-Time Inc.
 * @version 2019-03-28
 *
 */


'use strict';


window.addEventListener('DOMContentLoaded', () => { new Field(); });


class Field {

	constructor() {
		[this._id, ] = window.location.hash.replace('#', '').split(',');
		this._winstate = new WinState(window, 'winstate_field');

		this._container = document.createElement('div');
		document.body.appendChild(this._container);

		window.ondragover = window.ondrop = (e) => {e.preventDefault(); return false;};
		window.addEventListener('storage', (e) => {
			if ('field_' + this._id !== e.key) return;
			window.localStorage.removeItem(e.key);
			const ma = JSON.parse(e.newValue);
			if (ma.message === 'callFieldMethod' && this[ma.params.method]) {
				this[ma.params.method](...ma.params.args);
			}
		});
		window.addEventListener('keydown', (e) => this.onKeyDown(e));
		this.initializeFullscreenPoller();
	}

	openProgram(url) {
		this.closeProgram();
		this._frame = document.createElement('iframe');
		this._frame.setAttribute('src', url);
		this._frame.addEventListener('load', () => {
			this._frame.contentWindow.addEventListener('keydown', (e) => this.onKeyDown(e));
		});
		this._container.appendChild(this._frame);
	}

	closeProgram() {
		if (!this._frame) return;
		try {
			this._container.removeChild(this._frame);
		} catch (e) { }
		this._frame = null;
	}

	alignWindow(x, y, width, height) {
		window.moveTo(x, y);
		window.resizeTo(width, height);
	}

	onKeyDown(e) {  // Called also from injection.js
		if (e.which === 122 || (e.ctrlKey && e.metaKey && e.which === 70)) {  // F11, Cmd+Ctrl+F
			e.preventDefault();
			this.setFullscreenEnabled(!this._isFullscreenEnabled);
		} else if ((e.ctrlKey && e.which === 84) || (e.metaKey && e.which === 84)) {  // Ctrl+T, Cmd+T
			this.closeProgram();
			window.close();
		}
	}


	// -------------------------------------------------------------------------


	initializeFullscreenPoller() {
		this._isFullscreenEnabled = false;
		let last = window.performance.now();
		const loop = (cur) => {
			if (200 < cur - last) {
				const f = this.isFullscreenEnabled();
				if (f && !this._isFullscreenEnabled) {
					this.onFullscreenEntered();
				} else if (!f && this._isFullscreenEnabled) {
					this.onFullscreenLeft();
				}
				last = cur;
			}
			window.requestAnimationFrame(loop);
		};
		window.requestAnimationFrame(loop);
	}

	setFullscreenEnabled(enabled) {
		const f = this._isFullscreenEnabled;
		if (enabled && !f) {
			for (let f of ['requestFullscreen', 'webkitRequestFullscreen', 'mozRequestFullScreen']) {
				if (document.body[f] !== undefined) document.body[f]();
			}
			this.onFullscreenEntered();
		} else if (!enabled && f) {
			for (let f of ['exitFullscreen', 'webkitExitFullscreen', 'mozCancelFullScreen']) {
				if (document[f] !== undefined) document[f]();
			}
			this.onFullscreenLeft();
		}
	}

	isFullscreenEnabled() {
		for (let p of ['fullscreenElement', 'webkitCurrentFullScreenElement', 'mozFullScreenElement']) {
			if (document[p] !== undefined && document[p] !== null) return true;
		}
		return false;
	}

	onFullscreenEntered() {
		if (this._isFullscreenEnabled) return;
		this._isFullscreenEnabled = true;
		if (!this._frame) return;
		window.localStorage.setItem('injection_' + this._id, JSON.stringify({ message: 'window-fullscreen-entered' }));
	}

	onFullscreenLeft() {
		if (!this._isFullscreenEnabled) return;
		this._isFullscreenEnabled = false;
		if (!this._frame) return;
		window.localStorage.setItem('injection_' + this._id, JSON.stringify({ message: 'window-fullscreen-left' }));
	}

}
