import { LinkedList } from './LinkedList';
export default class FixedSizeLinkedList extends LinkedList {
    size: number;
    maintainHigh?: boolean | undefined;
    maintainLow?: boolean | undefined;
    maintainSum?: boolean | undefined;
    totalPushed: number;
    periodHigh: number;
    periodLow: number;
    periodSum: number;
    lastShift: number;
    _push: (data: number) => void;
    constructor(size: number, maintainHigh?: boolean | undefined, maintainLow?: boolean | undefined, maintainSum?: boolean | undefined);
    add(data: number): void;
    iterator(): IterableIterator<any>;
    calculatePeriodHigh(): void;
    calculatePeriodLow(): void;
}
