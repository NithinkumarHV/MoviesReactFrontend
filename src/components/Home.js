import React, { Component } from 'react'
// import Movie from './images/movie_tickets.jpg'
import './Home.css'

export default class Home extends Component {
    render() {
        return (
            <div className="text-center">
                <h2>Home</h2>
                <hr/>
                {/* <img src={Movie} alt="movie ticket"/> */}
                <div className="backgroundImage"></div>
            </div>
        )
    }
}