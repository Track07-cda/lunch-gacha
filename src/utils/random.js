export function pickWeighted(items) {
    if (!items || items.length === 0) return null

    const totalWeight = items.reduce((sum, item) => sum + (Number(item.weight) || 0), 0)
    if (totalWeight <= 0) return items[Math.floor(Math.random() * items.length)]

    let random = Math.random() * totalWeight

    for (const item of items) {
        const weight = Number(item.weight) || 0
        if (random < weight) {
            return item
        }
        random -= weight
    }

    return items[items.length - 1]
}
