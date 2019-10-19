import {html, render} from '../lit-html/lit-html.js';
import { StorageHandler } from '../services/localstorage.service.js';

export class WlHome extends HTMLElement
{
    get template() {
        return (currentUser, year, changes = null) => html`
<div class="panel panel-default">
    <div class="panel-heading">Willkommen bei Krämer Wunschliste ${year}</div>
    <div class="panel-body">
        <h1>Hallo ${currentUser==null?null:currentUser.username}!</h1>
    </div>
</div>
<div class="panel panel-default">
    <div class="panel-heading">Passwort ändern</div>
    <div class="panel-body">
        <form name="form" [formGroup]="pwChangeForm" novalidate>
            <div class="form-group" [ngClass]="{ 'has-error': isToValidate && pwChangeForm.get('mpw1').status !== 'VALID' }">
                <label for="mpw1">Neues Passwort</label>
                <input type="password" class="form-control" id="mpw1" formControlName="mpw1" placeholder="Neues Passwort" />
                ${changes && !this.isMpw1Valid(changes)
                    ? `<div class="help-block">Bitte Passwort angeben</div>`
                    : ``}
            </div>
            <div class="form-group" [ngClass]="{ 'has-error': isToValidate && pwChangeForm.get('mpw2').status !== 'VALID' }">
                <label for="mpw2">Wiederholen</label>
                <input type="password" class="form-control" id="mpw2" formControlName="mpw2" placeholder="Wiederholen" />
                ${changes && !this.isMpw2Valid(changes)
                    ? `<div class="help-block">Bitte Passwort wiederholen</div>`
                    : ``}
            </div>
            <div class="form-group">
                <button @click=${() => this.clickedDoubleCheckSubmit()} class="btn btn-default">Passwort ändern</button>
                <div id="doubleCheckSubmit" class="invisible">
                    Möchtest du dein Passwort wirklich ändern?
                    <button @click=${() => this.clickedChangePassword(changes)} class="btn btn-success">Ja</button>
                    <img class="invisible" src="data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA==" />
                    <button @click=${() => this.clickedReset()} class="btn btn-danger">Nein</button>
                </div>
            </div>
        </form>
    </div>
</div>
        `;
    }

    isMpw1Valid(changes) {
        console.log("mpw1valid: " + changes && changes.mpw1);
        return changes && changes.mpw1;
    }

    isMpw2Valid(changes) {
        console.log("mpw2valid: " + changes && (!changes.mpw1 || (changes.mpw2 && changes.mpw1 === changes.mpw2)));
        return changes && (!changes.mpw1 || (changes.mpw2 && changes.mpw1 === changes.mpw2));
    }

    connectedCallback()
    {
        fetch("../mock/login.json")
        .then(response => response.json())
        .then(token => {
            StorageHandler.storeNewToken(token.token);
            render(this.template(StorageHandler.getCurrentUser(), 2019), this);
        });
            /*StorageHandler.storeNewToken(response);
            console.log(StorageHandler.getCurrentUser());
            render(this.template(StorageHandler.getCurrentUser(), 2019), this);
        });*/

        //render(this.template(StorageHandler.getCurrentUser(), 2019), this);
        /*this.storageHandler.currentUser.subscribe(
            currentUser => {
                if(currentUser === null)
                {
                    this.alertService.error("Kein angemeldeter Benutzer gefunden. Bitte neu anmelden.");
                    return;
                }
                this.currentUser = currentUser;
            },
            error => this.alertService.error(error)
        );*/
    }

    clickedDoubleCheckSubmit()
    {
        let changes = {
            mpw1: document.getElementById('mpw1'),
            mpw2: document.getElementById('mpw2')
        };
        if(this.isMpw1Valid && this.isMpw2Valid) {
            document.getElementById('doubleCheckSubmit').classList.remove('invisible');
        } else {
            render(this.template(StorageHandler.getCurrentUser(), 2019, changes), this);
        }
    }

    clickedReset()
    {
        render(this.template(StorageHandler.getCurrentUser(), 2019), this);
        // TODO: check if fields really empty
    }

    clickedChangePassword()
    {
        const changes = {
            mpw1: document.getElementById('mpw1'),
            mpw2: document.getElementById('mpw2')
        };
        if(this.isMpw1Valid && this.isMpw2Valid) {
            document.getElementById('loading').classList.remove('invisible');
            AuthService.changePassword(document.getElementById('mpw1').value)
            .then(
                () => {
                    AlertService.success("Das Ändern des Passworts war erfolgreich.");
                    render(this.template(StorageHandler.getCurrentUser(), 2019), this);
                }
            )
            .catch(
                (error) => {
                    AlertService.error(error);
                    render(this.template(StorageHandler.getCurrentUser(), 2019, changes), this);
                }
            );
        } else {
            render(this.template(StorageHandler.getCurrentUser(), 2019, changes), this);
        }
    }
}
customElements.define("wl-home", WlHome);