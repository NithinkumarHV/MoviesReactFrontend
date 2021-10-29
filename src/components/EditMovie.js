import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { confirmAlert } from 'react-confirm-alert'; 
import 'react-confirm-alert/src/react-confirm-alert.css';
import Input from './FormComponents/input';
import TextArea from './FormComponents/textArea';
import Select from './FormComponents/select';
import Alert from './ui-components/alert';
import './EditMovie.css'

export default class EditMovie extends Component {
    constructor (props) {
        super(props);

        this.state = {
            movie: {
                id: 0,
                title: "",
                release_date: "",
                mpaa_rating: "",
                runtime: "",
                rating: "",
                description: "",
            },
            mpaaOptions: [
                {id:"G", value:"G"},
                {id:"PG", value:"PG"},
                {id:"PG13", value:"PG13"},
                {id:"R", value:"R"},
                {id:"NC17", value:"NC17"},
            ],
            isLoaded: false,
            error: null,
            errors: [],
            alert: {
                type: "d-none",
                message: "",
            }
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit = (evt) => {
        evt.preventDefault();

        let errors = []
        if(this.state.movie.title === "") {
            errors.push("title");
        }
        else if(this.state.movie.release_date === "") {
            errors.push("release_date");
        }
        else if(this.state.movie.runtime === "") {
            errors.push("runtime");
        }
        else if (this.state.movie.mpaa_rating === "") {
            errors.push("mpaa_rating");
        }
        else if (this.state.movie.rating === "") {
            errors.push("rating");
        }
        else if (this.state.movie.description === "") {
            errors.push("description");
        }

        this.setState({errors: errors})

        if(errors.length > 0) {
            return false
        }

        const data = new FormData(evt.target)
        const payload = Object.fromEntries(data.entries())
        const myHeaders = new Headers()

        myHeaders.append("Content-Type", "application/json")
        myHeaders.append("Authorization", "Bearer " + this.props.jwt)


        const requestOptions = {
            method: "POST",
            body: JSON.stringify(payload),
            headers: myHeaders,
        }

        fetch("http://localhost:4000/v1/admin/editmovie", requestOptions)
        .then((response) => response.json())
        .then(data => {
            if(data.error) {
                this.setState({
                    alert: {
                        type: "alert-danger",
                        message: data.error.message,
                    }
                })
            } else {
                this.props.history.push("/admin")
            }
        })
    }

    handleChange = (evt) => {
        let value = evt.target.value
        let name = evt.target.name
        this.setState((prevState) => ({
            movie: {
                ...prevState.movie,
                [name] : value,
            }
        }))
    }

    hasError = (key) => {
        return this.state.errors.indexOf(key) !== -1
    }

    confirmDelete = (e) => {
        confirmAlert({
            title: 'Delete Movie ?',
            message: 'Are you sure ?',
            buttons: [
              {
                label: 'Yes',
                onClick: () => {

                    const myHeaders = new Headers()

                    myHeaders.append("Content-Type", "application/json")
                    myHeaders.append("Authorization", "Bearer " + this.props.jwt)
                    
                    fetch("http://localhost:4000/v1/admin/deletemovie/" + this.state.movie.id, { method: "GET", headers: myHeaders })
                    .then((response) => response.json())
                    .then(data => {
                        if(data.error) {
                            this.setState({
                                alert: {
                                    alertType: "alert-danger",
                                    alertMessage: data.error.message,
                                }
                            })
                        }
                        else {
                            this.props.history.push({
                                pathname: "/admin",
                            })
                        }
                    })
                }
              },
              {
                label: 'No',
                onClick: () => {}
              }
            ]
          });
    }

    componentDidMount () {
        if(this.props.jwt === "") {
            this.props.history.push({
                pathname: "/login"
            })
            return
        }
        const id = this.props.match.params.id
        if(id > 0) {
            fetch("http://localhost:4000/v1/movie/" + id)
            .then((response) => {
                if(response.status !== "200") {
                    let err = Error;
                    err.message = "Invalid response code: " + response.status;
                    this.setState({error: err})
                }
                return response.json()
            })
            .then((json) => {
                const releaseDate = new Date(json.movie.release_date)
                this.setState({ 
                    movie: {
                        id: id,
                        title: json.movie.title,
                        release_date : releaseDate.toISOString().split("T")[0],
                        runtime: json.movie.runtime,
                        mpaa_rating: json.movie.mpaa_rating,
                        rating: json.movie.rating,
                        description: json.movie.description,
                    },
                    isLoaded: true,
                },
                (error) => {
                    this.setState({
                        isLoaded: true,
                        error
                    })
                })
            })
        } else {
            this.setState({
                isLoaded: true,
            })
        }
    }

    render() {
        let { movie } = this.state
        const { isLoaded, error, alert } = this.state

        if(error) {
            return <div>Error: {error.message}</div>
        }
        else if(!isLoaded) {
            return <p>Loading....</p>
        }
        else {
            return (
                <Fragment>
                    <h2>Add/Edit Movie</h2>

                    <Alert
                        alertType= {alert.type}
                        alertMessage= {alert.message}    
                    />

                    <hr/>

                    <form onSubmit={this.handleSubmit}>
                        <input 
                            type="hidden"
                            id="id"
                            name="id"
                            value={movie.id}
                            onChange={this.handleChange}
                        />

                        <Input
                            title={"Title"}
                            className={this.hasError("title") ? "is-invalid" : ""}
                            type={"text"}
                            name={"title"}
                            value={movie.title}
                            handleChange={this.handleChange}
                            errorDiv={this.hasError("title") ? "text-danger" : "d-none"}
                            errorMsg={"Please enter a title"}
                        />

                        <Input
                            title={"Release Date"}
                            className={this.hasError("release_date") ? "is-invalid" : ""}
                            type={"date"}
                            name={"release_date"}
                            value={movie.release_date}
                            handleChange={this.handleChange}
                            errorDiv={this.hasError("release_date") ? "text-danger" : "d-none"}
                            errorMsg={"Please enter release date"}
                        />

                        <Input
                            title={"Runtime"}
                            className={this.hasError("runtime") ? "is-invalid" : ""}
                            type={"text"}
                            name={"runtime"}
                            value={movie.runtime}
                            handleChange={this.handleChange}
                            errorDiv={this.hasError("runtime") ? "text-danger" : "d-none"}
                            errorMsg={"Please enter runtime"}
                        />  

                        <Select
                            title={"MPAA Rating"}
                            className={this.hasError("mpaa_rating") ? "is-invalid" : ""}
                            name={"mpaa_rating"}
                            options={this.state.mpaaOptions}
                            value={movie.mpaa_rating}
                            handleChange={this.handleChange}
                            placeholder={"Choose"}
                            errorDiv={this.hasError("mpaa_rating") ? "text-danger" : "d-none"}
                            errorMsg={"Please select mpaa_rating"}
                        />

                        <Input
                            title={"Rating"}
                            className={this.hasError("rating") ? "is-invalid" : ""}
                            type={"text"}
                            name={"rating"}
                            value={movie.rating}
                            handleChange={this.handleChange}
                            errorDiv={this.hasError("rating") ? "text-danger" : "d-none"}
                            errorMsg={"Please enter rating"}
                        />

                        <TextArea
                            title={"Description"}
                            className={this.hasError("description") ? "is-invalid" : ""}
                            name={"description"}
                            rows={"3"}
                            value={movie.description}
                            handleChange={this.handleChange}
                            errorDiv={this.hasError("description") ? "text-danger" : "d-none"}
                            errorMsg={"Please enter description"}
                        />

                        <hr/>

                        <button className="btn btn-primary">
                            Submit
                        </button>
                        <Link to="/admin" className="btn btn-warning ms-1">Cancel</Link>

                        {movie.id > 0 && (
                            <a
                                href="#!"
                                onClick={this.confirmDelete} 
                                className="btn btn-danger ms-1"
                            >Delete</a>
                        )}
                    </form>
                </Fragment>
            )
        }
    }
}