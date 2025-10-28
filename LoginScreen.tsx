import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  Alert,
  ScrollView
} from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import Button from '../../components/common/Button';
import AppText from '../../components/common/AppText';

const LoginScreen: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const { colors } = useTheme();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Ошибка', 'Пожалуйста, заполните все поля');
      return;
    }

    setIsLoading(true);
    try {
      await login(email, password);
    } catch (error) {
      Alert.alert('Ошибка входа', (error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const demoCredentials = [
    { email: 'student@school.ru', password: '123456', role: 'Студент' },
    { email: 'teacher@school.ru', password: '123456', role: 'Преподаватель' },
    { email: 'admin@school.ru', password: '123456', role: 'Администратор' },
  ];

  const fillDemoCredentials = (demoEmail: string, demoPassword: string) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
  };

  return (
    <ScrollView
      contentContainerStyle={[
        styles.container,
        { backgroundColor: colors.background }
      ]}
    >
      <AppText variant="bold" style={[styles.title, { color: colors.text }]}>
        IT School App
      </AppText>
      <AppText style={[styles.subtitle, { color: colors.textSecondary }]}>
        Вход в систему
      </AppText>

      <View style={styles.form}>
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
              color: colors.text
            }
          ]}
          placeholder="Email"
          placeholderTextColor={colors.textSecondary}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
              color: colors.text
            }
          ]}
          placeholder="Пароль"
          placeholderTextColor={colors.textSecondary}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <Button
          title="Войти"
          onPress={handleLogin}
          loading={isLoading}
          disabled={isLoading}
        />
      </View>

      <View style={[styles.demoSection, { borderTopColor: colors.border }]}>
        <AppText style={[styles.demoTitle, { color: colors.textSecondary }]}>
          Демо доступы:
        </AppText>
        {demoCredentials.map((cred, index) => (
          <Button
            key={index}
            title={`Войти как ${cred.role}`}
            onPress={() => fillDemoCredentials(cred.email, cred.password)}
            variant="secondary"
          />
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 40,
  },
  form: {
    marginBottom: 40,
  },
  input: {
    borderWidth: 1,
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    fontSize: 16,
  },
  demoSection: {
    borderTopWidth: 1,
    paddingTop: 20,
  },
  demoTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 15,
    textAlign: 'center',
  },
});

export default LoginScreen;