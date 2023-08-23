import {LitElement, html, css} from 'https://cdn.jsdelivr.net/gh/lit/dist@2/core/lit-core.min.js';

const navStyles = css`
  .nav {
    margin: 0;
    display:flex;
    justify-content:flex-end;
  }

  .nav div.button{
    display: inline;
    margin: 12px 4px;
  }

  .nav div.button.justify-left {
    margin-right: auto;
  }

  .nav div.button.text  {
    border: 1px solid black;
    border-radius: 5px;
    padding: 4px;
  }

  .nav div.button:hover {
    cursor: pointer;
  }

  .nav div.button.text:hover {
    background-color: black;
    color: white;
  }

  .nav div.button.svg:hover rect,   .nav div.button.svg:hover .rect{
    fill:black;
  }

  .nav div.button.svg:hover path.rect{
    stroke:black;
  }

  .nav div.button.svg:hover path{
    stroke:white;
  }

  a {
    text-decoration: none; 
  }

  a, a:visited, a:hover, a:active {
    color: inherit;
  }`

class PanoramaNav extends LitElement {
  
  static get styles() {
    return navStyles;
  }


  constructor() {
    // Always call super() first
    super();
  
  }

  render() {
    
    let introButton = 
      html`
        <div class="button svg">
          <a href="#">
            <svg id="back-svg" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" stroke="black" stroke-width="1">
              <rect x="0.5" y="0.5" width="23" height="23" rx="5.5" fill="none"/>
              <path id="back-path" data-name="back" d="M353.774,26.165,345,34.212l8.97,7.775" transform="translate(-339.076 -22.076)" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="1"/>
            </svg>          
          </a>
        </div>` 
    
    return html`
      <div class="nav">
        ${introButton}
        ${erasButton}
      </div>`;
  }
  
}

customElements.define('fbip-nav', FBIPNav);

