import React, { Component } from 'react';
import StyledMapWithAnInfoBox from './StyledMapWithAnInfoBox';

export default class App extends Component {
  render() {
    return (
      <div>
		  <h1>Hi! Welcome to the TRM take-home interview!</h1>
		  <h3>Intro:</h3>
		  <p>At TRM, we have many users: marketers, compliance officers, CEOs and the core TRM team.</p>
		  <p>Everything we do at TRM is centered around better serving the needs of these users. </p>
		  <p>In your role, you'll be using your ninja JavaScript skills to empower TRM to better serve these users.</p>
		  <p>That's why we've included this piece in the interview process. It gives you an opportunity to demonstrate your creative problem-solving, user-centric design, and coding style. </p>
		  <h3> Here's how it works:</h3>
		  <p></p>

		  <p>Below are some real-life <a href="https://en.wikipedia.org/wiki/User_story">user stories</a> that we face at TRM.</p>
		  <p>We'd love to see how you use JS and React to address these user stories.</p>
		  <p>Feel free to add libraries, create new components, or otherwise change the codebase. This app is yours!</p>
		  <p>Implementing the user stories listed should take between 2-5 hours. If you're having trouble, don't be afraid to ask for help!</p>
		  
		  <strong>User stories for a marketer:</strong>
		  <ul>
		    <li>As a marketer, I want to see a map of San Francisco</li>
		    <li>As a marketer, I want to see a map that has all the stores represented as markers/pins on the map.</li>
		    <li>Bonus: As a marketer, I want to be able to click on a store and add it to a list of 'My Favorite Stores'</li>
		  </ul>

		  <p>Helpful tips:</p>
		  <ul>
		  	<li><i>Feel free to use our Google Maps API key (or you own): AIzaSyCVH8e45o3d-5qmykzdhGKd1-3xYua5D2A</i></li>
		  	<li><i>The list of stores is located in the file store_directory.json </i></li>
		  	<li><i>Focus on the user, not the technology. A simple implementation that impresses the user is better than a super technical solution that impresses other developers.</i></li>
		  	<li><i>That said, code that is easy to follow is always appreciated :)</i></li>
		  </ul>

		  <StyledMapWithAnInfoBox/>

      </div>
    );
  }
}
