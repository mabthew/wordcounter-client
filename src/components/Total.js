import React, { Component } from 'react';

export default class Total extends Component {
    constructor(props) {
        super(props);
    
        this.state = {
            count: 0,
            time: Date.now(),
        }
        this.getCount = this.getCount.bind(this);
    }


    getCount() {
        var url = "http://localhost:3001/total"
        fetch(url)
            .then(response => response.json())
            .then(data => this.setState({count: data}));
    }

    componentDidMount() {
        this.interval = setInterval(() => this.getCount(), 500);
        this.getCount();
      }
      componentWillUnmount() {
        clearInterval(this.interval);
      }

    render() {
        if (this.state.count === 0) {
            this.getCount();
        }
       
        return (
            <div>
                {this.state.count}
             </div>
        );
    }
}