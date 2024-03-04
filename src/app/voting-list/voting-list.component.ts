import {ChangeDetectionStrategy, Component, DestroyRef, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ApiMockService} from "../data-access/api-mock.service";
import {
    BehaviorSubject,
    catchError,
    combineLatest,
    distinctUntilChanged,
    EMPTY,
    map, shareReplay
} from "rxjs";
import {CardData} from "../data-access/types";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";

@Component({
    selector: 'app-voting-list',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './voting-list.component.html',
    styleUrl: './voting-list.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VotingListComponent {

    destroyRef = inject(DestroyRef);

    polls$ = this.apiMock.getPolls();
    categories$ = this.apiMock.getCategories().pipe(shareReplay(1));
    categoriesMeta$ = this.apiMock.getCategoriesMeta();
    selectCategory$ = new BehaviorSubject(0);

    cardsData$ = combineLatest([
        this.polls$,
        this.categories$,
        this.categoriesMeta$
    ]).pipe(
        map(([polls, categories, categoriesMeta]) => {
            return polls.map(poll => {

                const cat = categories.find(cat => cat.id === poll.category_id);
                const catMeta = categoriesMeta.find(catMeta => catMeta.alias === cat!.alias);

                if (cat && catMeta){
                    const data: CardData = {
                        id: poll.id,
                        title: poll.title,
                        points: poll.points,
                        voters_count: poll.voters_count,
                        category_id: poll.category_id,
                        image: poll.image,
                        name: cat.name,
                        alias: cat.alias,
                        smallIcon: catMeta.smallIcon, // TODO: may be card can exist without icons (without catMeta)?
                        largeIcon: catMeta.largeIcon,
                        backgroundColor: catMeta.backgroundColor,
                        textColor: catMeta.textColor,
                    }
                    return data;
                }
                throw new Error('Category not defined');
            });
        }),
        catchError(error => {
            console.error(error);
            return EMPTY;
        }),
        takeUntilDestroyed(this.destroyRef)
    );

    filteredData$ = combineLatest([
        this.cardsData$,
        this.selectCategory$.pipe(distinctUntilChanged())
    ]).pipe(
        map(([cardsData, selectedCategory]) => {
            return cardsData.filter(poll => selectedCategory === 0 || poll.category_id === selectedCategory)
        }),
        takeUntilDestroyed(this.destroyRef)
    );

    constructor(private readonly apiMock: ApiMockService) {
    }
}
