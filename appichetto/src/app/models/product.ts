import { User } from './user';

export class Product {
    id?: string;
    name: string;
    quantity: number;
    price: number;
    participants: User[]
}
