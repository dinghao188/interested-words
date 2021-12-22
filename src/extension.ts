import * as vscode from 'vscode';
import { InterestedWords } from './interested-words';

export function activate(context: vscode.ExtensionContext) {
	const interestedWords = new InterestedWords();

	let disposable = vscode.commands.registerCommand('interested-words.helloWorld', () => {
		vscode.window.showInformationMessage('Hello World from interested-words!');
	});
	context.subscriptions.push(disposable);

	disposable = vscode.commands.registerCommand('interested-words.toggleHighlightWord', () => {
		const editor = vscode.window.activeTextEditor; if (editor === undefined) return;

		let word = editor.document.getWordRangeAtPosition(editor.selection.active);
		if (word === undefined) return;
		interestedWords.ToggleHLWord(
			editor.document.getText().substring(
				editor.document.offsetAt(word.start),
				editor.document.offsetAt(word.end)));
	});
	context.subscriptions.push(disposable);

	disposable = vscode.commands.registerCommand('interested-words.toggleHighlightSelect', () => {
		const editor = vscode.window.activeTextEditor; if (editor === undefined) return;

		let selection = editor.selection;
		interestedWords.ToggleHLWord(
			editor.document.getText().substring(
				editor.document.offsetAt(selection.start),
				editor.document.offsetAt(selection.end)));
	});
	context.subscriptions.push(disposable);

	disposable = vscode.commands.registerCommand('interested-words.clearAllHighlights', () => {
		interestedWords.CleanForEditor(vscode.window.activeTextEditor);
		interestedWords.Clear();
	});
	context.subscriptions.push(disposable);

	disposable = vscode.window.onDidChangeActiveTextEditor((oldEditor) => {
		interestedWords.CleanForEditor(oldEditor);
		interestedWords.RenderForEditor(vscode.window.activeTextEditor);
	});
	context.subscriptions.push(disposable);
}

export function deactivate() {}