export default interface SuggestedWord
{
    itemID: number;
    itemName: string;
}

export class SuggestedWordImpl implements SuggestedWord
{
    itemID: number;
    itemName: string;

    constructor(itemID: number, itemName: string)
    {}
}
