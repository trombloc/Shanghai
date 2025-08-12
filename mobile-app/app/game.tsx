// Track currently dragged card
const [draggingIndex, setDraggingIndex] = useState<number | null>(null);
const [dragPos, setDragPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
import React, { useState } from "react";
import { PanGestureHandler } from "react-native-gesture-handler";
import Animated, { useSharedValue, useAnimatedStyle, withSpring, useAnimatedGestureHandler, runOnJS } from "react-native-reanimated";
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
    const [bookBox, setbookBox] = useState<Card[]>([]);
    const [enlargedIndex, setEnlargedIndex] = useState<number | null>(null);
    // Drag state and animated style refs for each card, always initialized in the same order
    const MAX_HAND_SIZE = 20;
    const dragRefs = React.useRef(
        Array.from({ length: MAX_HAND_SIZE }, () => ({
            x: useSharedValue(0),
            y: useSharedValue(0)
        }))
    );
    const styleRefs = React.useRef(
        Array.from({ length: MAX_HAND_SIZE }, (_, i) =>
            useAnimatedStyle(() => ({
                transform: [
                    { translateX: dragRefs.current[i].x.value },
                    { translateY: dragRefs.current[i].y.value },
                    { scale: enlargedIndex === i ? 1.3 : 1 }
                ],
                zIndex: enlargedIndex === i ? 10 : 1,
            }))
        )
    );

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
    const moveToBookBox = (index: number) => {
        if (index < 0 || index >= hand.length) return;
        const cardToMove = hand[index];
        setbookBox(prev => [...prev, cardToMove]);
        discardCard(index);
    }

    // Handle card click to enlarge
    const handleCardPress = (index: number) => {
        setEnlargedIndex(prev => prev === index ? null : index);
    };
    return (
        <View style={{ flex: 1, padding: 20 }}>
            <TouchableOpacity onPress={drawCard} style={{ alignItems: "center" }}>
                <Text style={{ fontSize: 96, marginBottom: 20 }}>🃏</Text>
            </TouchableOpacity>

            {/*  Books above hand */}
            <View style={styles.suitBoxContainer}>
                <Text style={{ fontWeight: "bold", marginBottom: 5 }}>Book</Text>
                <ScrollView horizontal>
                    {bookBox.map((card, idx) => {
                        const CardComponent = (CardMap as { [key: string]: any })[card.id];
                        return (
                            <View key={idx} style={[styles.cardWrapper, idx !== 0 && { marginLeft: -30 }]}>
                                {CardComponent ? <CardComponent width={60} height={90} /> : <Text>❓</Text>}
                            </View>
                        );
                    })}
                </ScrollView>
                {bookBox.length > 0}
            </View>

            <View style={styles.handContainer}>
                <ScrollView horizontal>
                    {hand.map((card, index) => {
                        const CardComponent = (CardMap as { [key: string]: any })[card.id];
                        const drag = dragRefs.current[index];
                        const animatedStyle = styleRefs.current[index];
                        // Use useAnimatedGestureHandler for modern gesture handling
                        const gestureHandler = useAnimatedGestureHandler({
                            onStart: (event, ctx) => {
                                runOnJS(setDraggingIndex)(index);
                                runOnJS(setDragPos)({ x: event.absoluteX - 40, y: event.absoluteY - 60 });
                            },
                            onActive: (event, ctx) => {
                                drag.x.value = event.translationX;
                                drag.y.value = event.translationY;
                                runOnJS(setDragPos)({ x: event.absoluteX - 40, y: event.absoluteY - 60 });
                            },
                            onEnd: (event, ctx) => {
                                runOnJS(setDraggingIndex)(null);
                                drag.x.value = withSpring(0);
                                drag.y.value = withSpring(0);
                                if (event.absoluteY < 300) {
                                    runOnJS(moveToBookBox)(index);
                                }
                            },
                        });
                        // Hide the card in hand if dragging
                        if (draggingIndex === index) return null;
                        return (
                            <PanGestureHandler key={index} onGestureEvent={gestureHandler}>
                                <Animated.View style={[styles.cardWrapper, index !== 0 && { marginLeft: -30 }, animatedStyle]}>
                                    <TouchableOpacity onPress={() => handleCardPress(index)} activeOpacity={0.8}>
                                        {CardComponent ? <CardComponent width={enlargedIndex === index ? 80 : 60} height={enlargedIndex === index ? 120 : 90} /> : <Text>❓</Text>}
                                    </TouchableOpacity>
                                </Animated.View>
                            </PanGestureHandler>
                        );
                    })}
                    {/* Drag preview card */}
                    {draggingIndex !== null && hand[draggingIndex] && (
                        (() => {
                            const CardComponent = (CardMap as { [key: string]: any })[hand[draggingIndex].id];
                            return (
                                <Animated.View
                                    style={{
                                        position: 'absolute',
                                        left: dragPos.x,
                                        top: dragPos.y,
                                        zIndex: 100,
                                    }}
                                >
                                    {CardComponent ? <CardComponent width={80} height={120} /> : <Text>❓</Text>}
                                </Animated.View>
                            );
                        })()
                    )}
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
    suitBoxContainer: {
        position: "absolute",
        bottom: "30%",
        left: "5%",
        borderColor: "#333",
        borderWidth: 1,
        borderRadius: 8,
        backgroundColor: "#f5f5f5",
        padding: 10,
        minHeight: 70,
        width: "90%",
        zIndex: 2,
    },
    handContainer: {
        position: "absolute",
        bottom: "15%",
        left: "5%",
        borderColor: "black",
        borderWidth: 1,
        height: "12.5%",
        width: "100%",
        zIndex: 1,
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