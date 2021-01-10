export default interface ShoppingList
{
    id: number;
    name: string;
    created: string;
    due: string;
    type: number;
    list_size: number;
}

export enum FutureTime
{
    NextDays,
    NextWeek,
    NextMonth
}

// export class ShoppingList
// {
//     id: number;
//     name: string;
//     created: string;
//     due: string;
//     type: number;
//     listSize: number;
// }
