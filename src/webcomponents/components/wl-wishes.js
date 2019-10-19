import {html, render} from '../lit-html/lit-html.js';
import { StorageHandler } from '../services/localstorage.service.js';

export class WlWishes extends HTMLElement {

    /*wishes: Wish[];
    selectedWish: Wish;
    oldDescr: string;
    oldLink: string;

    currentUserId: number;
    acceptedWishIds: number[];
    isForceDeletion: boolean;* /

    constructor(
        private restService: RestService,
        private alertService: AlertService,
        private storageHandler: StorageHandler)
    {
        this.selectedWish = null;
        this.isForceDeletion =  false;
    }*/

    connectedCallback()
    {
        this.storageHandler.currentUser.subscribe(
            currentUser => {
                if(currentUser === null)
                {
                    this.alertService.error("Kein angemeldeter Benutzer gefunden. Bitte neu anmelden.");
                    return;
                }
                this.currentUserId = currentUser.id;
                this.restService.readWishes(currentUser.id).subscribe(
                    wishes => this.wishes = wishes,
                    error => this.alertService.error(error)
                );
                this.restService.readPresents(currentUser.id, false).subscribe(
                    presents => this.acceptedWishIds = presents.map(present => present.wishId)
                                                              .filter(wishId => wishId >= 0),
                    error => this.alertService.error(error)
                );
            },
            error => this.alertService.error(error)
        );
    }

    clickedEdit(wish: Wish)
    {
        this.selectedWish = wish;
        this.oldDescr = wish.description;
        this.oldLink = wish.link;
    }

    clickedResetEdit(index: number, wish: Wish)
    {
        // remove from list, if not yet persistent
        if(index > -1 && wish.id <= 0)
            this.wishes.splice(index, 1);

        this.selectedWish = null;
        this.oldDescr = null;
        this.oldLink = null;
    }

    clickedSaveEdit(index, wish: Wish)
    {
        this.restService.createOrUpdate(wish).subscribe(
            result => {},
            error => {
                this.alertService.error(error);
                wish.description = this.oldDescr;
                wish.link = this.oldLink;
            },
            () => {
                this.oldDescr = null;
                this.oldLink = null;
                this.selectedWish = null;
            }
        );
    }

    clickedRemove(index: number, wish: Wish)
    {
        if(!this.isForceDeletion && this.acceptedWishIds.indexOf(wish.id) !== -1)
            this.alertService.error("Dieser Wunsch kann leider nicht mehr gelöscht werden.");
        else
        {
            this.restService.deleteWish(wish, this.isForceDeletion).subscribe(
                result => {
                    console.log('deleted wish#' + wish.id);
                    this.wishes.splice(index, 1);
                },
                error => console.error(error)
            );
        }
    }

    clickedAddNew(event)
    {
        let wish = new Wish(-1, this.currentUserId, '', '');
        this.wishes.push(wish);
        
        this.clickedEdit(wish);
    }

    clickedTrash(event)
    {
        this.alertService.success("In dieser Sicht können Wünsche gelöscht werden, die schon andere Wichtel ausgewählt haben. "
                                + "Die Wichtel bekommen davon nichts mit, also mit Vorsicht nutzen!", true);
        this.isForceDeletion = true;
    }

    clickedResetTrash(event)
    {
        this.alertService.success("Das ist wieder die ganz normale Sicht deiner Wünsche.");
        this.isForceDeletion = false;
    }
}
customElements.define("wl-wishes", WlWishes);