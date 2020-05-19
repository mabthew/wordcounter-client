import React, { Component } from 'react';
import { w3cwebsocket as W3CWebSocket } from "websocket";

const client = new W3CWebSocket('ws://127.0.0.1:8000');

export default class Total extends Component {
    constructor(props) {
        super(props);
    
        this.state = {
            words: {},
            total: 0,
            totalUnique: 0,
            mostUsedWords:  [null, null, null, null, null],
            mostUsedWordCounts: [0,0,0,0,0],
        }

        this.extractMetrics = this.extractMetrics.bind(this);
    }

    extractMetrics(string) {

        var newWords = string.split(" ");
        if (newWords[0] === '') {
            newWords.shift();
        } 

        var total = this.state.total;
        total += newWords.length;

        var mostUsedWords = this.state.mostUsedWords;
        var mostUsedWordCounts = this.state.mostUsedWordCounts;
        var words = this.state.words;

        newWords.forEach(function(w) {
            if (!words[w]) {
                words[w] = 0;
            }
            words[w] += 1;

            var i = 4;

            if (mostUsedWords.includes(w)) {
                i = mostUsedWords.indexOf(w)
            } 
            if (words[w] > mostUsedWordCounts[i]) {
                mostUsedWords[i] = w;
                mostUsedWordCounts[i] = words[w];
                
                while (mostUsedWordCounts[i] > mostUsedWordCounts[i-1] && i >= 1) {
                    // swap
                    var tempWord = mostUsedWords[i];
                    var tempWordCount = mostUsedWordCounts[i];
    
                    mostUsedWords[i] = mostUsedWords[i-1];
                    mostUsedWordCounts[i] = mostUsedWordCounts[i-1];

                    mostUsedWords[i-1] = tempWord;
                    mostUsedWordCounts[i-1] = tempWordCount;
    
                    i--;   
                }
            }
        });
        
        var totalUnique = Object.keys(words).length;

        this.setState({words, total, totalUnique, mostUsedWords,  mostUsedWordCounts});
    }

    componentDidMount() {
        client.onopen = () => {
          console.log('WebSocket Client Connected');
        };
        client.onmessage = (message) => {  
            this.extractMetrics(message.data)
        };
    }

    render() {       
        return (
            <div>
                Total unique words: {this.state.totalUnique}
                <br></br>
                Total words: {this.state.total}
                <br></br>
                Most used words: 
                    {this.state.mostUsedWords.map((word,index) => 
                        <div key={index}>{word} {!word ? null : ": "  + this.state.mostUsedWordCounts[index]}</div>
                    )}
             </div>
        );
    }
}