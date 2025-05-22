function DrawCard(deck) {
    let row, col, card;

    do {
        row = Math.floor(Math.random() * 4);
        col = Math.floor(Math.random() * 13);
        card = deck[row][col];
    } while (card === 0);

    deck[row][col] = 0;
    return { row, card };
}
export default function MoveCard(hand) {
    const rows = 4
    const column = 13
    const matrix = Array.from({ length: rows }, () => Array.from({ length: column }, (_, i) => i + 1));

    const card = DrawCard(matrix);
    hand.length += 1;
    hand.push(card);
    return hand;
};