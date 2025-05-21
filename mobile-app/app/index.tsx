import { Text, View, StyleSheet, TextInput, Button } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = () => {

    if (username !== "" && password === "password") {
      // Navigate to the game room
      router.replace("/game");
    }
  }

  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 20, fontWeight: "bold", top: "-15%" }}>Login</Text>
      <TextInput
        placeholder="Username"
        placeholderTextColor="black"
        value={username}
        onChangeText={setUsername}
        style={{ borderWidth: 1, marginBottom: 10, padding: 8, width: "70%", borderRadius: 5 }}
      />
      <TextInput
        placeholder="Password"
        placeholderTextColor="black"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={{ borderWidth: 1, marginBottom: 10, padding: 8, width: "70%", borderRadius: 5, }}
      />
      <Button title="Login" onPress={handleLogin} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 10,
    width: "50%",
    top: "25%",
    height: "50%",
    left: "25%",
  },
});