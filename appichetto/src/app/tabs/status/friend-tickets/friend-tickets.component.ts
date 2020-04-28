import {Component, Input, OnInit, QueryList, ViewChild, ViewChildren} from '@angular/core';
import {User} from '../../../models/user';
import {Router} from '@angular/router';
import {Ticket} from '../../../models/ticket';
import {RetrieveTicketService} from '../../../services/retrieve-ticket.service';
import {LoginService} from '../../../services/login.service';
import {UserFriends} from '../../../models/user-friends';
import {UserFriendsService} from '../../../services/user-friends.service';
import {Observable} from 'rxjs';
import {IonSlides} from '@ionic/angular';
import {FriendSlideComponent} from './friend-slide/friend-slide.component';

@Component({
    selector: 'app-friend-tickets',
    templateUrl: './friend-tickets.component.html',
    styleUrls: ['./friend-tickets.component.scss'],
})
export class FriendTicketsComponent implements OnInit {

    private loggedUser: User;
    private userFriends: UserFriends;
    private userFriendsObs: Observable<UserFriends>;

    private slideOpts = {
        initialSlide: 0,
        speed: 400,
    };
    private startingUserIndex: any;
    private selectedFriendName: string;

    @ViewChildren('friendSlide') slideList: QueryList<FriendSlideComponent>;
    @ViewChild(IonSlides, {static: false}) slides: IonSlides;


    constructor(private router: Router, private loginService: LoginService, private userFriendsService: UserFriendsService) {
        this.startingUserIndex = router.getCurrentNavigation().extras.state ? router.getCurrentNavigation().extras.state.friendIndex : 0;
        this.slideOpts.initialSlide = this.startingUserIndex;
    }


    async ngOnInit() {
        try {
            this.loggedUser = await this.loginService.getLoggedUser();

            this.userFriendsObs = this.userFriendsService.getUserFriends(this.loggedUser.email);
            this.userFriendsObs.subscribe(userFriends => {
                if (userFriends !== undefined) {
                    this.userFriends = userFriends;
                    this.selectedFriendName = userFriends.friends[this.startingUserIndex].name;
                } else {
                    this.userFriends = {friends: []};
                }
            });
        } catch (e) {
            this.router.navigateByUrl('tabs/status');
        }
    }

    getSlideFriendName() {
        this.slides.getActiveIndex().then(i => this.selectedFriendName = this.slideList.toArray()[i].getFriendName());
    }


}
