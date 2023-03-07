/**
 * Server Proxy - IPC
 *
 * @author Takuto Yanagida
 * @version 2023-03-07
 */

'use strict';

class ServerProxy {

	#id = null;

	constructor(id) {
		this.#id = id;
	}

	addWindowCloseListener(fn) {
		window.ipc.on('windowClose', fn);
	}


	// -------------------------------------------------------------------------


	onStudyToggleDevTools() {
		this.#send('onStudyToggleDevTools');
	}

	onStudyModified() {
		this.#send('onStudyModified');
	}

	onStudyErrorOccurred(params) {
		this.#send('onStudyErrorOccurred', params);
	}

	onStudyToggleDevToolsField() {
		this.#send('onStudyToggleDevToolsField');
	}

	onStudyTitleChanged(title) {
		this.#send('onStudyTitleChanged', title);
	}

	onStudyProgramClosed() {
		this.#send('onStudyProgramClosed');
	}

	doUnmaximize() {
		this.#send('doUnmaximize');
	}


	// -------------------------------------------------------------------------


	doReady() {
		return this.#invoke('doReady');
	}

	doCapturePage(r) {
		return this.#invoke('doCapturePage', r);
	}

	doCopyImageToClipboard(url) {
		return this.#invoke('doCopyImageToClipboard', url);
	}

	//

	doNew() {
		return this.#invoke('doNew');
	}

	doOpen() {
		return this.#invoke('doOpen');
	}

	doClose(text) {
		return this.#invoke('doClose', text);
	}

	doFileDropped(path) {
		return this.#invoke('doFileDropped', path);
	}

	//

	doSave(text, dialogTitle) {
		return this.#invoke('doSave', text, dialogTitle);
	}

	doSaveAs(text, dialogTitle) {
		return this.#invoke('doSaveAs', text, dialogTitle);
	}

	doSaveCopy(text, dialogTitle) {
		return this.#invoke('doSaveCopy', text, dialogTitle);
	}

	doExportAsWebPage(text) {
		return this.#invoke('doExportAsWebPage', text);
	}

	doExportAsLibrary(text, libName, flag, codeStructure) {
		return this.#invoke('doExportAsLibrary', text, libName, flag, codeStructure);
	}

	doRun(text) {
		return this.#invoke('doRun', text);
	}

	doRunWithoutWindow(text) {
		return this.#invoke('doRunWithoutWindow', text);
	}



	// -------------------------------------------------------------------------


	#send(msg, ...args) {
		window.ipc.send(`notifyServer_${this.#id}`, msg, ...args);
	}

	#invoke(msg, ...args) {
		return window.ipc.invoke(`callServer_${this.#id}`, msg, ...args);
	}
}
