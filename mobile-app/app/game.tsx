import React, { useState } from "react";
import { View, Button, StyleSheet, Text, Image, TouchableOpacity } from "react-native";
import MoveCard from "../components/MoveCard";

type Card = {
    row: number;
    card: number;
};
export default function Game() {
    const [hand, setHand] = useState<Card[]>([]);

    const handleMoveCard = () => {
        const updatedHand = MoveCard([...hand]); // Pass a copy of the current hand
        setHand(updatedHand); // Update the hand state
    };


    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={handleMoveCard}>
                <Image
                    source={require("../assets/images/deck.png")}
                    style={{ width: 200, height: 400 }}
                />

            </TouchableOpacity>
            <View style={styles.handContainer}>
                <Image style={styles.cardImage}
                    source={require("../assets/images/2C.svg")}
                />
                {/* <Text style={styles.handTitle}>Your Hand:</Text>
                {hand.map((card, index) => (
                    <Text key={index} style={styles.cardText}>
                        Row: {card.row}, Card: {card.card}
                    </Text>
                ))} */}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    handContainer: {
        marginTop: 20,
        alignItems: "center",
        borderColor: "black",
        borderWidth: 1,
        bottom: 0,
        height: "25%",
        width: "75%",
    },
    handTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 10,
    },
    cardImage: {
        left: 0,
        marginBottom: 5,
    },
});