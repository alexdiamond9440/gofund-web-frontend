import React from "react";
import { Link } from 'react-router-dom'

const NotFound = () => {
    return(
        <div className="error-page">
        <div className="container">
            <div className="row d-flex justify-content-center page-404-wrap">
                <div className="col-lg-7 col-md-8 col-12 text-center">
                    <img src="assets/img/404.png" alt="404" className="mw-100"/>
                    <h4>Oops! This Page is Not Found</h4>
                    <h5>The page you are looking for does not exist. It might have been moved or deleted.</h5>
                    <div className="btn-together">
                        <Link className="btn btn-donate-big" to="/">Back to Home</Link>
                        <a className="btn btn-donate-big" href="/">Contact Us Now</a>
                    </div>
                </div>
            </div>
        </div>
    </div>
    )
}

export default NotFound;