import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Text, TextInput, View, StyleSheet, Button, Alert, ActivityIndicator } from "react-native";
import { z } from "zod";
import { useCRUD } from "./conexao/useCrud";
import { Usuario } from "./inteface/usuario";
import { useAuth } from "./context/auth";

const loginSchema = z.object({
  usunom: z.string().min(1, "Nome é obrigatório"),
  ususen: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
});

export default function LoginScreen() {
  const { data: usuarios, loading, error, getAll } = useCRUD<Usuario>("usuario");
  const { login } = useAuth();
  const router = useRouter();

  const [usunom, setUsunom] = useState("");
  const [ususen, setUsusen] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  useEffect(() => {
    console.log("Error from useCRUD:", error);
    getAll();
  }, []);

  const handleLogin = async () => {
    setIsLoggingIn(true);
    try {
      // Validação dos campos com Zod
      const validatedData = loginSchema.parse({ usunom, ususen });
      setValidationError(null);

      // Garantir que usuarios é um array
      const usersArray = Array.isArray(usuarios) ? usuarios : [];

      if (usersArray.length === 0) {
        throw new Error("Nenhum usuário cadastrado");
      }

      // Buscar usuário
      const usuarioEncontrado = usersArray.find(
        (user) => user.usunom === validatedData.usunom && user.ususen === validatedData.ususen
      );

      if (usuarioEncontrado) {
        await login(usuarioEncontrado);
        router.push("/principal"); // Corrigir o caminho para a rota absoluta
      } else {
        throw new Error("Usuário ou senha incorretos");
      }
    } catch (err) {
      if (err instanceof z.ZodError) {
        setValidationError(err.errors[0].message);
      } else {
        const message = err instanceof Error ? err.message : "Ocorreu um erro durante o login";
        Alert.alert("Erro", message);
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  const errorMessage = error instanceof Error ? error.message : String(error) || "Erro ao carregar usuários";

  return (
    <View style={styles.container}>
      <Text style={styles.title}>TimeOff</Text>

      {validationError && <Text style={styles.errorText}>{validationError}</Text>}

      {error && <Text style={styles.errorText}>{errorMessage}</Text>}

      <TextInput
        style={styles.input}
        placeholder="Nome de usuário"
        value={usunom}
        onChangeText={setUsunom}
        autoCapitalize="none"
        editable={!isLoggingIn}
      />

      <TextInput
        style={styles.input}
        placeholder="Senha"
        value={ususen}
        onChangeText={setUsusen}
        secureTextEntry
        editable={!isLoggingIn}
      />

      {isLoggingIn ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <Button title="Entrar" onPress={handleLogin} disabled={loading || isLoggingIn} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#f8f9fa",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 40,
    color: "#2c3e50",
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: "#ced4da",
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    backgroundColor: "#ffffff",
    fontSize: 16,
  },
  errorText: {
    color: "#e74c3c",
    textAlign: "center",
    marginBottom: 15,
    fontSize: 14,
  },
});