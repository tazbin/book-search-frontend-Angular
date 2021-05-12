import { Subscription } from "rxjs";

export class Book {
    sub: Subscription;
    err: string;
    loading: boolean;

    info: any;
}
