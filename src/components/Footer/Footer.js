import React from "react";
import "./Footer.css";
export default function Footer() {
    return (
        <div className="footer-container">
            <h2>Build By Shivang Baranwal</h2>
            <div className="footer-item">
                <div className="tech-used-container">
                    <h3>Tech Used</h3>
                    <div className="tech-used-box">

                        <div className="tech-used-item">
                            React.js
                        </div>
                        <div className="tech-used-item">
                            Javascript
                        </div>
                        <div className="tech-used-item">
                            Data Structure & Algorithms
                        </div>
                    </div>
                </div>
                <div className="contact-me">
                    <h3>Contact me</h3>
                    <div className="contact-me-link">
                        <a href="https://www.linkedin.com/in/shivang-baranwal-022531218/">
                            <img className="contact-me-icon" src="./images/linkedin.png" alt="" />
                            <div>LinkedIn</div>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}