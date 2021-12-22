import * as vscode from 'vscode';
import * as decoration from './decoration';
import { WordHighlight, RegexHighlight, Highlightable } from './highlight';

export class InterestedWords {
    private readonly highlight_points: Map<string, Highlightable>;

    constructor() {
        this.highlight_points = new Map();
    }

    //add or delete an interested word
    ToggleHLWord(word: string) {
        let hp = this.highlight_points.get(word);

        if (hp === undefined) {
            hp = new WordHighlight(word, decoration.getHighlightStyle());
            vscode.window.activeTextEditor?.setDecorations(hp.decorationType, hp.getHighlightRange());
            this.highlight_points.set(word, hp);
        } else {
            decoration.backHighlightStyle(hp.decorationType);
            vscode.window.activeTextEditor?.setDecorations(hp.decorationType, []);
            this.highlight_points.delete(word);
        }
    }

    //add or delete an interested regex
    ToggleHLRegex(regex: string) {
        let hp = this.highlight_points.get(regex);

        if (hp === undefined)
        {
            hp = new RegexHighlight(regex, decoration.getHighlightStyle());
            vscode.window.activeTextEditor?.setDecorations(hp.decorationType, hp.getHighlightRange());
            this.highlight_points.set(regex, hp);
        } else {
            decoration.backHighlightStyle(hp.decorationType);
            vscode.window.activeTextEditor?.setDecorations(hp.decorationType, []);
            this.highlight_points.delete(regex);
        }
    }

    //clean the highlights of specified TextEditor
    CleanForEditor(editor: vscode.TextEditor | undefined) {
        if (editor === undefined) return;

        for (const hp of this.highlight_points.values()) {
            editor.setDecorations(hp.decorationType, []);
        }
    }

    //highlight all interested points for specified TextEditor
    RenderForEditor(editor: vscode.TextEditor | undefined) {
        if (editor === undefined) return;

        for (const hp of this.highlight_points.values()) {
            editor.setDecorations(hp.decorationType, hp.getHighlightRange());
        }
    }

    //clear all interested thing
    Clear() {
        for (const hp of this.highlight_points.values()) {
            decoration.backHighlightStyle(hp.decorationType);
        }
        this.highlight_points.clear();
    }
};