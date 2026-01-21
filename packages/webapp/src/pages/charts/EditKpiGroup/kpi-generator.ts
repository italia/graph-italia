type KpiItemId = `item-${number}`;
type KpiItem = {
    i: KpiItemId;
};

function* kpiGenerator(
    layout: Array<KpiItem>
): Generator<KpiItemId, never, void> {
    let index = 0;
    const itemsAlreadyUsed = new Set<KpiItemId>(layout.map((l) => l.i));

    while (true) {
        const item = `kpi-${index}-id` as KpiItemId;
        if (!itemsAlreadyUsed.has(item)) {
            itemsAlreadyUsed.add(item);
            yield item;
        }
        index++;
    }
}