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
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

    function shuffle(array: Card[]) {
        return [...array].sort(() => Math.random() - 0.5);
    }

    const drawCard = () => {
        if (deck.length === 0) return;
        const [drawnCard, ...rest] = deck;
        setDeck(rest);
        setHand(prev => [...prev, drawnCard]);
    }

    const discardCard = (index: number) => {
        if (index < 0 || index >= hand.length) return;
        const newHand = [...hand];
        newHand.splice(index, 1);
        setHand(newHand);
        if (selectedIndex === index) {
            setSelectedIndex(null);
        } else if (selectedIndex !== null && selectedIndex > index) {
            setSelectedIndex(selectedIndex - 1);
        }
    }

    return (
        <View style={{ flex: 1, padding: 20 }}>
            <TouchableOpacity onPress={drawCard} style={{ alignItems: "center" }}>
                <Text style={{ fontSize: 96, marginBottom: 20 }}>🃏</Text>
            </TouchableOpacity>

            <View style={styles.handContainer}>
                <ScrollView horizontal>
                    {hand.map((card, index) => {
                        const CardComponent = (CardMap as { [key: string]: any })[card.id];
                        return (
                            <View key={index} style={[
                                styles.cardWrapper,
                                index !== 0 && { marginLeft: -30 }]}>
                                <View key={index}>
                                    {CardComponent ? <CardComponent width={60} height={90} /> : <Text>❓</Text>}
                                </View>
                            </View>

                        );
                    })}
                </ScrollView>
            </View>
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
        position: "absolute",
        bottom: "15%",
        left: "5%",
        borderColor: "black",
        borderWidth: 1,
        height: "12.5%",
        width: "100%",
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