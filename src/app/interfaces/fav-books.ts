import { Subscription } from "rxjs";

export class FavBooks {
    sub: Subscription;
    err: string;
    loading: boolean;

    list: any[];
}
