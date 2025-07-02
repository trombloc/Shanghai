import React, { useState } from "react";
import { View, StyleSheet, Text, TouchableOpacity, ScrollView } from "react-native";
import { CardMap } from "../components/CardComponents";

const suits = ["C", "D", "H", "S"];
const ranks = ["2", "3", "4", "5", "6", "7", "8", "9", "T", "J", "Q", "K", "A"];

const createDeck = () => {
    const standardCards = suits.flatMap(suit =>
        ranks.map(value => ({ id: `${value}${suit}`, suit, value }))
    );
    return [...standardCards, { id: 'RJ' }, { id: 'BJ' }];
};

export default function Game() {
    type Card = { id: string; suit?: string; value?: string; };
    const [deck, setDeck] = useState<Card[]>(shuffle(createDeck()));
    const [hand, setHand] = useState<Card[]>([]);

    function shuffle(array: Card[]) {
        return [...array].sort(() => Math.random() - 0.5);
    }

    const drawCard = () => {
        if (deck.length === 0) return;
        const [drawnCard, ...rest] = deck;
        setDeck(rest);
        setHand(prev => [...prev, drawnCard]);
    };
    return (
        <View style={{ flex: 1, padding: 20 }}>
            <TouchableOpacity onPress={drawCard} style={{ marginBottom: 20 }}>
                <Text style={{ fontSize: 24 }}>🃏 Tap to Draw a Card</Text>
            </TouchableOpacity>

            <Text style={{ fontSize: 18, marginBottom: 10 }}>Your Hand:</Text>
            <ScrollView horizontal>
                {hand.map((card, index) => {
                    const CardComponent = (CardMap as { [key: string]: any })[card.id];
                    console.log(card.id, CardComponent);
                    return (
                        <View key={index} style={{ marginRight: 10 }}>
                            {CardComponent ? <CardComponent width={60} height={90} /> : <Text>❓</Text>}
                        </View>


                    );
                })}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    handContainer: {
        marginTop: 20,
        borderColor: "black",
        borderWidth: 1,
        bottom: 0,
        height: "25%",
        width: "75%",
    },
    handRow: {
        flexDirection: "row",
        alignItems: "center",
        height: 130,
    },
    cardWrapper: {
        // No marginLeft for the first card, negative for overlap
    },
});