import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, Observable } from "rxjs/Rx";
import { User } from '../data/user';
import { Wish } from '../data/wish';
import { Present } from '../data/present';
import { RestService } from '../services/rest.service';
import { AlertService } from '../services/alert.service';
import { StorageHandler } from '../services/localstorage.service';
import { LoginUser } from '../data/loginUser';

@Component({
    selector: 'app-presents',
    templateUrl: './presents.component.html'
})
export class PresentsComponent
{
    allUsers: User[];
    otherUsers: User[];
    selectedUser: User;

    selectedUserWishes: Wish[];
    allOtherWishes: Wish[];

    selectedUserPresents: Present[];
    selectedUserUnwishedPresents: Present[];
    presentsOfCurrentUser: Present[];
    allOtherPresents: Present[];
    
    countWishesMap: Map<number, number>;
    countPresentsByCurrentUserMap: Map<number, number>;

    selectedPresent: Present;
    oldDescr: string;
    oldLink: string;
    
    currentUserId: number;

    constructor(
        private restService: RestService,
        private alertService: AlertService,
        private storageHandler: StorageHandler)
    {
        this.selectedUser = null;
        this.selectedPresent = null;
        
        this.countWishesMap = new Map();
        this.countPresentsByCurrentUserMap = new Map();
    }

    ngOnInit()
    {
        this.storageHandler.currentUser.subscribe(
            currentUser => {
                if(currentUser === null)
                {
                    this.alertService.error("Kein angemeldeter Benutzer gefunden. Bitte neu anmelden.");
                    return;
                }
                this.currentUserId = currentUser.id;

                this.restService.readUsers().subscribe(
                    users => {
                        this.allUsers = users;
                        this.otherUsers = users.filter(
                            user => user.id !== this.currentUserId
                        );

                        this.restService.readWishes(null).subscribe(
                            wishes => {
                                this.otherUsers.forEach(
                                    user => {
                                        this.countWishesMap.set(user.id, wishes.filter(
                                            wish => wish.userId === user.id
                                        ).length);
                                    }
                                );

                                this.allOtherWishes = wishes.filter(
                                    wish => wish.userId !==currentUser.id
                                );
                            },
                            error => this.alertService.error(error)
                        );

                        this.restService.readAllPresents().subscribe(
                            presents => {
                                this.allOtherPresents = presents.filter(
                                    present => present.wisherId !== this.currentUserId
                                );

                                this.presentsOfCurrentUser = presents.filter(
                                    present => present.giverId === this.currentUserId
                                );
                                
                                this.otherUsers.forEach(
                                    user => {
                                        this.countPresentsByCurrentUserMap.set(user.id, this.presentsOfCurrentUser.filter(
                                            present => present.wisherId === user.id
                                        ).length);

                                        this.countWishesMap.set(user.id, this.allOtherPresents.filter(
                                            present => present.wisherId === user.id && (present.wishId==null ||present.wishId < 0)
                                        ).length + this.countWishesMap.get(user.id));
                                    }
                                );
                            },
                            error => this.alertService.error(error)
                        );
                    },
                    error => this.alertService.error(error)
                );
            },
            error => this.alertService.error(error)
        );
    }

    clickedUser(user: User)
    {
        this.selectedUser = user;

        this.selectedUserPresents = this.allOtherPresents.filter(
            present => present.wisherId === user.id && present.wishId !== null && present.wishId >= 0
        );

        this.selectedUserUnwishedPresents = this.allOtherPresents.filter(
            present => present.wisherId === user.id && (present.wishId === null || present.wishId < 0)
        );

        this.selectedUserWishes = this.allOtherWishes.filter(
            wish => wish.userId === user.id
        );
    }

    isWishSelected(wish: Wish): boolean
    {
        return this.presentsOfCurrentUser.findIndex(
            present => {
                //console.log(present.wishId + "=" + wish.id + " " + (present.wishId === wish.id));
                return present.wishId === wish.id;
            }
        ) >= 0;
    }

    getGiversForWish(wish: Wish): string[]
    {
        return this.selectedUserPresents.filter(
            p => p.wishId === wish.id
        ).map(
            p => this.allUsers.find(
                    user => user.id === p.giverId
                ).name
        );
    }

    getGiverForPresent(present: Present): string
    {
        return this.allUsers.find(
            user => user.id === present.giverId
        ).name;
    }

    clickedSelectWish(wish: Wish)
    {
        this.createPresent(new Present(null,
                                       wish.userId,
                                       this.currentUserId,
                                       wish.id,
                                       wish.description,
                                       wish.link));
    }

    private createPresent(present: Present)
    {
        this.restService.createOrUpdate(present).subscribe(
            result => {
                present.id = result;
                this.presentsOfCurrentUser.push(present);
                this.selectedUserPresents.push(present);
                this.countPresentsByCurrentUserMap.set(present.wisherId, this.countPresentsByCurrentUserMap.get(present.wisherId) + 1);
            },
            error => {
                this.alertService.error(error);
            }
        );
    }

    clickedUnselectWish(wish: Wish)
    {
        this.deletePresent(this.presentsOfCurrentUser.find(
            present => present.wishId === wish.id
        ));
    }

    private deletePresent(present: Present)
    {
        this.restService.delete(present).subscribe(
            result => {
                this.presentsOfCurrentUser.splice(this.presentsOfCurrentUser.findIndex(p => p === present), 1);
                this.selectedUserPresents.splice(this.selectedUserPresents.findIndex(p => p === present), 1);
                this.countPresentsByCurrentUserMap.set(present.wisherId, this.countPresentsByCurrentUserMap.get(present.wisherId) - 1);
            },
            error => {
                this.alertService.error(error);
            }
        );
    }

    clickedEdit(present: Present)
    {
        this.selectedPresent = present;
        this.oldDescr = present.description;
        this.oldLink = present.link;
    }

    clickedResetEdit(index: number, present: Present)
    {
        if(index > -1 && present.id <= 0)
        {
            // remove from list, if not yet persistent
            this.selectedUserUnwishedPresents.splice(index, 1);
            this.countWishesMap.set(present.wisherId, this.countWishesMap.get(present.wisherId) - 1);
            this.countPresentsByCurrentUserMap.set(present.wisherId, this.countPresentsByCurrentUserMap.get(present.wisherId) - 1);
        }

        this.selectedPresent = null;
        this.oldDescr = null;
        this.oldLink = null;
    }

    clickedSaveEdit(index, present: Present)
    {
        this.restService.createOrUpdate(present).subscribe(
            result => {},
            error => {
                this.alertService.error(error);
                present.description = this.oldDescr;
                present.link = this.oldLink;
            },
            () => {
                this.oldDescr = null;
                this.oldLink = null;
                this.selectedPresent = null;
            }
        );
    }

    clickedRemove(index: number, present: Present)
    {
        this.restService.delete(present).subscribe(
            result => {
                console.log('deleted present#' + present.id);
                this.selectedUserUnwishedPresents.splice(index, 1);
                this.countWishesMap.set(present.wisherId, this.countWishesMap.get(present.wisherId) - 1);
                this.countPresentsByCurrentUserMap.set(present.wisherId, this.countPresentsByCurrentUserMap.get(present.wisherId) - 1);
            },
            error => console.error(error)
        );
    }

    clickedAddNew(event)
    {
        let present = new Present(-1, this.selectedUser.id, this.currentUserId, -1, '', '');
        this.selectedUserUnwishedPresents.push(present);
        this.countWishesMap.set(present.wisherId, this.countWishesMap.get(present.wisherId) + 1);
        this.countPresentsByCurrentUserMap.set(present.wisherId, this.countPresentsByCurrentUserMap.get(present.wisherId) + 1);
        
        this.clickedEdit(present);
    }
}