import { Subscription } from "rxjs";

export class SearchResult {
    sub: Subscription;
    err: string;
    loading: boolean;
    totalPages: number;

    res: {
        error: string,
        total: number,
        page: number,
        books: {
            title: string,
            subtitle: string,
            isbn13: string,
            price: string,
            image: string,
            url: string
        }[]
    }
}
