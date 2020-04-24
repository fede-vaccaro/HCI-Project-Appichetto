import { User } from './user';
import { Product } from './product';

export class Ticket {
    id?: string;
    description?: string;
    timestamp?: number;
    owner?: User;
    products: Product[];
    participants?: User[];
}

export class ParticipantTicket {
    id?: string;
    description?: string;
    timestamp?: number;
    owner?: User;
    products: Product[];
    participant: User;
}

