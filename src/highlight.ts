import * as vscode from 'vscode';
import {Range, TextEditorDecorationType} from 'vscode';

export interface Highlightable {
    readonly key: string;
    readonly decorationType: TextEditorDecorationType,
    
    getHighlightRange(): Range[];
};

export class WordHighlight implements Highlightable {
    readonly key: string;
    readonly decorationType: TextEditorDecorationType;

    constructor(word: string, dec: TextEditorDecorationType) {
        this.decorationType = dec;
        this.key = word;
    }

    getHighlightRange(): vscode.Range[] {
        const doc = vscode.window.activeTextEditor?.document; if (!doc) return[];

        let ranges: Range[] = [];
        let offset = doc.getText().indexOf(this.key, 0);
        while (offset != -1) {
            ranges.push(new Range(
                doc.positionAt(offset),
                doc.positionAt(offset+this.key.length)));
            offset = doc.getText().indexOf(this.key, offset+this.key.length);
        }

        return ranges;
    }
}

export class RegexHighlight implements Highlightable {
    readonly key: string;
    readonly decorationType: TextEditorDecorationType;
    readonly regex: RegExp;

    constructor(key: string, dec: TextEditorDecorationType) {
        this.decorationType = dec;
        this.key = key;
        this.regex = new RegExp(key, 'g');
    }

    getHighlightRange(): vscode.Range[] {
        const doc = vscode.window.activeTextEditor?.document; if (!doc) return [];

        let ranges: Range[] = [];
        const matches = doc.getText().matchAll(this.regex);
        for (const m of matches) {
            if (m.index == undefined) continue;
            ranges.push(new Range(
                doc.positionAt(m.index),
                doc.positionAt(m.index+m[0].length)
            ));
        }
        return ranges;
    }
}

