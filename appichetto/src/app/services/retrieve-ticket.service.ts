import { Injectable } from '@angular/core';
import { Ticket, TicketFirebase } from '../models/ticket';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFirestoreCollection } from '@angular/fire/firestore/public_api';
import { environment } from 'src/environments/environment';
import { FirebaseTicketPipe } from '../pipe/firebase-ticket.pipe';
import { User } from '../models/user';

@Injectable({
    providedIn: 'root'
})
export class RetrieveTicketService {

    sampleTicket = {
        products: [
            {
                name: 'Pasta e patate e fagioli',
                quantity: 2,
                price: 1.1,
                participants: []
            }, {
                name: 'Pasta',
                quantity: 2,
                price: 1.1,
                participants: []
            }, {
                name: 'Pasta pesto panna saliccia sugo',
                quantity: 2,
                price: 1.1,
                participants: []
            }, {
                name: 'Pasta',
                quantity: 2,
                price: 1.1,
                participants: []
            },
            {
                name: 'Pasta e patate e fagioli',
                quantity: 2,
                price: 1.1,
                participants: []
            }, {
                name: 'Pasta',
                quantity: 2,
                price: 1111111111.1,
                participants: []
            }, {
                name: 'Pasta pesto panna saliccia sugo',
                quantity: 2,
                price: 1.1,
                participants: []
            }
        ],
        timestamp: 9999,
        owner: { name: 'Pippo' },
        id: 'aaa',
        participants: [{ name: 'Pippo' }]
    };




    ticketCollection: AngularFirestoreCollection<Ticket>;

    constructor(
        private firestore: AngularFirestore,
        private firebaseTicketPipe: FirebaseTicketPipe,
    ) {
        this.ticketCollection = this.firestore.collection(environment.firebaseDB.ticket_history) as AngularFirestoreCollection<Ticket>;

    }

    async getTicket() {
        return await (await this.ticketCollection.doc("Giuseppe Palazzolo").collection("my-ticket").doc("1587831699023").ref.get()).data()
    }

    saveTicket(ticket: Ticket) {
        const firebaseTicket = this.firebaseTicketPipe.transform(ticket);
        this.ticketCollection.doc(ticket.owner.name).collection('my-ticket').doc(ticket.timestamp.toString()).set(firebaseTicket).catch(error => {
            throw new Error(error);
        });
    }

    getTicketBoughtByWithParticipant(boughtBy: User, participant: User): Ticket[] {

        this.sampleTicket.owner = boughtBy;
        this.sampleTicket.participants = [boughtBy, participant];
        this.sampleTicket.products.forEach(p => {
            p.participants = [];
            p.participants.push(boughtBy, participant);
        });

        const arr = new Array(this.sampleTicket, this.sampleTicket, this.sampleTicket);
        return arr;
    }

    getTickets(): Ticket[] {
        return [{
            market: "Esselunga",
            owner: { name: "Pippo" },
            timestamp: Date.now(),
            totalPrice: 12,
        },
        {
            market: "Coop",
            owner: { name: "Pluto" },
            timestamp: Date.now(),
            totalPrice: 42,
        },
        {
            market: "Conad",
            owner: { name: "Paperino" },
            timestamp: Date.now(),
            totalPrice: 32.33,
        }]
    }
}
