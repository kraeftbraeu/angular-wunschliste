import {html, render} from '../lit-html/lit-html.js';
import { StorageHandler } from '../services/localstorage.service.js';
import { WlLogin } from './wl-login.js';
import { WlHome } from './wl-home.js';

export default class WlApp extends HTMLElement
{
    get template() {
        return (currentUser, year, daysLeftToChristmas) => html`
        <nav class="navbar navbar-default">
            <div class="container-fluid">
                <div class="navbar-header">
                    <button type="button" class="navbar-toggle">
                        <span class="icon-bar"></span>
                        <span class="icon-bar"></span>
                        <span class="icon-bar"></span>
                    </button>
                    <span class="navbar-toggle navbar-right" style="border:0">${currentUser ? currentUser.username : ''}</span>
                    <a class="navbar-brand" href="">Wunschliste</a>
                </div>
                <div class="collapse navbar-collapse" id="myNavbar">
                ${currentUser
                    ? html`
                        <ul class="nav navbar-nav">
                            <li><a @click=${() => this.openPage('home')}>Start</a></li>
                            <li><a @click=${() => this.openPage('wishes')}>Wünsche</a></li>
                            <li><a @click=${() => this.openPage('presents')}>Geschenke</a></li>
                        </ul>
                        <form class="navbar-form navbar-right" action="" method="post" role="search">
                            <span id="jsLogoutForm" style="padding-left:15px; padding-right:15px;">
                                <span class="glyphicon glyphicon-user" aria-hidden="true"></span>
                                <span id="jsLoginName">${currentUser.username}</span>
                            </span>
                            <a type="button" class="btn btn-default" @click=${() => this.openPage('logout')} *ngIf="(currentUser|async)">Logout</a>
                        </form>`
                    : html``}
                </div>
            </div>
        </nav>
        <div class="container">
            <div id="wl-alert"></div>
            <div id="wl-content"></div>
        </div>
        <footer class="footer">
            <div class="container">
                <p class="text-muted">
                © Krämer ${year}
                <span>| ${daysLeftToChristmas} Tage bis Weihnachten</span>
                </p>
            </div>
        </footer>
        `;
    }

    connectedCallback() {
        const currentUser = StorageHandler.getCurrentUser();
        render(this.template(currentUser, 2019, 123), this);
        if(currentUser)
            this.openPage('home');
        else
            this.openPage('login');
    }

    openPage(page) {
        console.log('open ' + page);
        const content = document.getElementById('wl-content');
        if(content) {
            while(content.lastChild)
                content.removeChild(content.lastChild);
            content.appendChild(document.createElement('wl-' + page));
        }
    }
}
customElements.define("wl-app", WlApp);