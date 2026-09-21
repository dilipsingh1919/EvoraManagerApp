import React, {useState} from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import {COLORS} from '../../constants/colors';
import {CONFIG} from '../../constants/config';
import {FONTS} from '../../constants/fonts';
import {SPACING} from '../../constants/spacing';

const RegisterScreen = ({navigation}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  const [submitting, setSubmitting] = useState(false);

  const validateEmail = value => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  };

  const handleRegister = async () => {
    if (submitting) return;

    let valid = true;

    setNameError('');
    setEmailError('');
    setPasswordError('');
    setConfirmPasswordError('');

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();

    if (!trimmedName) {
      setNameError('Name is required');
      valid = false;
    }

    if (!trimmedEmail) {
      setEmailError('Email address is required');
      valid = false;
    } else if (!validateEmail(trimmedEmail)) {
      setEmailError('Enter a valid email address');
      valid = false;
    }

    if (!password) {
      setPasswordError('Password is required');
      valid = false;
    } else if (password.length < 8) {
      setPasswordError('Password must be at least 8 characters');
      valid = false;
    }

    if (!confirmPassword) {
      setConfirmPasswordError('Please confirm your password');
      valid = false;
    } else if (password !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match');
      valid = false;
    }

    if (!valid) return;

    setSubmitting(true);

    try {
      const url = `${CONFIG.API_BASE_URL}/auth/register`;

      console.log('[Register] Calling:', url);

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          name: trimmedName,
          email: trimmedEmail,
          password,
          role: 'organizer',
        }),
      });

      console.log('[Register] Status:', response.status);

      let data = null;

      try {
        data = await response.json();
      } catch (error) {
        console.log('[Register] Response not JSON:', error);
      }

      console.log('[Register] Response:', data);

      if (!response.ok) {
        const message =
          data?.message ||
          data?.error ||
          `Registration failed (${response.status})`;

        Alert.alert('Registration failed', message);
        return;
      }

      Alert.alert(
        'Registration Successful',
        'Your account has been created.',
        [
          {
          
            onPress: () => navigation.replace('LoginScreen'),
          },
        ],
      );
    } catch (error) {
      console.error('[Register] Network error:', error);

      Alert.alert(
        'Network error',
        'Cannot reach server. Check your internet and try again.',
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}>
      
      <StatusBar
        barStyle="light-content"
        backgroundColor={COLORS.background}
      />

      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>

        <View style={styles.brandRow}>
          <View style={styles.brandMark}>
            <Text style={styles.brandMarkText}>U</Text>
          </View>

          <Text style={styles.brandName}>
            {CONFIG.APP_NAME}
          </Text>
        </View>

        <View style={styles.headingBlock}>
          <Text style={styles.eyebrow}>EVENT MANAGER</Text>

          <Text style={styles.title}>
            Create account.
          </Text>

          <Text style={styles.description}>
            Create your manager account to manage events.
          </Text>
        </View>

        <View style={styles.form}>

          {/* NAME */}

          <Text style={styles.label}>FULL NAME</Text>

          <TextInput
            autoCapitalize="words"
            placeholder="Enter your name"
            placeholderTextColor={COLORS.textMuted}
            value={name}
            onChangeText={value => {
              setName(value);
              if (nameError) setNameError('');
            }}
            style={[
              styles.input,
              nameError && styles.inputError,
            ]}
          />

          {nameError ? (
            <Text style={styles.errorText}>
              {nameError}
            </Text>
          ) : null}

          {/* EMAIL */}

          <Text style={[styles.label, styles.labelTop]}>
            EMAIL ADDRESS
          </Text>

          <TextInput
            autoCapitalize="none"
            autoComplete="email"
            keyboardType="email-address"
            placeholder="you@company.com"
            placeholderTextColor={COLORS.textMuted}
            value={email}
            onChangeText={value => {
              setEmail(value);
              if (emailError) setEmailError('');
            }}
            style={[
              styles.input,
              emailError && styles.inputError,
            ]}
          />

          {emailError ? (
            <Text style={styles.errorText}>
              {emailError}
            </Text>
          ) : null}

          {/* PASSWORD */}

          <Text style={[styles.label, styles.labelTop]}>
            PASSWORD
          </Text>

          <View
            style={[
              styles.passwordInputWrap,
              passwordError && styles.inputError,
            ]}>

            <TextInput
              autoCapitalize="none"
              autoComplete="password"
              secureTextEntry={!showPassword}
              placeholder="Enter your password"
              placeholderTextColor={COLORS.textMuted}
              value={password}
              onChangeText={value => {
                setPassword(value);
                if (passwordError) setPasswordError('');
              }}
              style={styles.passwordInput}
            />

            <Pressable
              onPress={() =>
                setShowPassword(current => !current)
              }
              style={styles.visibilityButton}>

              <Text style={styles.visibilityText}>
                {showPassword ? 'HIDE' : 'SHOW'}
              </Text>

            </Pressable>
          </View>

          {passwordError ? (
            <Text style={styles.errorText}>
              {passwordError}
            </Text>
          ) : null}

          {/* CONFIRM PASSWORD */}

          <Text style={[styles.label, styles.labelTop]}>
            CONFIRM PASSWORD
          </Text>

          <View
            style={[
              styles.passwordInputWrap,
              confirmPasswordError && styles.inputError,
            ]}>

            <TextInput
              autoCapitalize="none"
              autoComplete="password"
              secureTextEntry={!showConfirmPassword}
              placeholder="Confirm your password"
              placeholderTextColor={COLORS.textMuted}
              value={confirmPassword}
              onChangeText={value => {
                setConfirmPassword(value);
                if (confirmPasswordError) {
                  setConfirmPasswordError('');
                }
              }}
              style={styles.passwordInput}
            />

            <Pressable
              onPress={() =>
                setShowConfirmPassword(current => !current)
              }
              style={styles.visibilityButton}>

              <Text style={styles.visibilityText}>
                {showConfirmPassword ? 'HIDE' : 'SHOW'}
              </Text>

            </Pressable>
          </View>

          {confirmPasswordError ? (
            <Text style={styles.errorText}>
              {confirmPasswordError}
            </Text>
          ) : null}

          {/* REGISTER */}

          <Pressable
            disabled={submitting}
            onPress={handleRegister}
            style={[
              styles.submitButton,
              submitting && styles.submitButtonDisabled,
            ]}>

            <Text
              style={[
                styles.submitText,
                submitting && styles.submitTextDisabled,
              ]}>
              {submitting ? 'Creating account…' : 'Create account'}
            </Text>

          </Pressable>

          {/* LOGIN */}

          <View style={styles.footer}>

            <Text style={styles.footerText}>
              Already have an account?
            </Text>

            <Pressable
              onPress={() => navigation.replace('LoginScreen')}>

              <Text style={styles.link}>
                Log in
              </Text>

            </Pressable>

          </View>

        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  content: {
    flexGrow: 1,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.xl,
    paddingBottom: SPACING.xxxl,
  },

  brandRow: {
    alignItems: 'center',
    flexDirection: 'row',
  },

  brandMark: {
    alignItems: 'center',
    backgroundColor: COLORS.orange,
    borderRadius: SPACING.sm,
    height: 36,
    justifyContent: 'center',
    marginRight: SPACING.sm,
    width: 36,
  },

  brandMarkText: {
    color: COLORS.dark,
    fontFamily: FONTS.heading,
    fontSize: 22,
  },

  brandName: {
    color: COLORS.text,
    fontFamily: FONTS.heading,
    fontSize: 18,
    letterSpacing: 2,
  },

  headingBlock: {
    marginTop: 48,
  },

  eyebrow: {
    color: COLORS.orange,
    fontFamily: FONTS.bodyBold,
    fontSize: 11,
    letterSpacing: 2,
  },

  title: {
    color: COLORS.text,
    fontFamily: FONTS.heading,
    fontSize: 34,
    marginTop: SPACING.sm,
  },

  description: {
    color: COLORS.textMuted,
    fontFamily: FONTS.body,
    fontSize: 15,
    marginTop: SPACING.sm,
  },

  form: {
    marginTop: 32,
  },

  label: {
    color: COLORS.textMuted,
    fontFamily: FONTS.bodyBold,
    fontSize: 11,
    letterSpacing: 1.2,
    marginBottom: SPACING.sm,
  },

  labelTop: {
    marginTop: SPACING.xl,
  },

  input: {
    backgroundColor: COLORS.surface,
    borderColor: COLORS.border,
    borderRadius: SPACING.radius.md,
    borderWidth: 1,
    color: COLORS.text,
    fontFamily: FONTS.body,
    fontSize: 15,
    height: 56,
    paddingHorizontal: SPACING.lg,
  },

  inputError: {
    borderColor: COLORS.orange,
  },

  errorText: {
    color: COLORS.orange,
    fontFamily: FONTS.bodyMedium,
    fontSize: 11,
    marginTop: 6,
  },

  passwordInputWrap: {
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderColor: COLORS.border,
    borderRadius: SPACING.radius.md,
    borderWidth: 1,
    flexDirection: 'row',
    height: 56,
  },

  passwordInput: {
    color: COLORS.text,
    flex: 1,
    fontFamily: FONTS.body,
    fontSize: 15,
    paddingHorizontal: SPACING.lg,
  },

  visibilityButton: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
  },

  visibilityText: {
    color: COLORS.orange,
    fontFamily: FONTS.bodyBold,
    fontSize: 10,
    letterSpacing: 1,
  },

  submitButton: {
    alignItems: 'center',
    backgroundColor: COLORS.orange,
    borderRadius: SPACING.radius.md,
    height: 58,
    justifyContent: 'center',
    marginTop: 30,
  },

  submitButtonDisabled: {
    backgroundColor: COLORS.surface,
    borderColor: COLORS.border,
    borderWidth: 1,
  },

  submitText: {
    color: COLORS.dark,
    fontFamily: FONTS.bodyBold,
    fontSize: 16,
  },

  submitTextDisabled: {
    color: COLORS.textMuted,
  },

  footer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 30,
  },

  footerText: {
    color: COLORS.textMuted,
    fontFamily: FONTS.body,
    fontSize: 12,
    marginRight: SPACING.xs,
  },

  link: {
    color: COLORS.orange,
    fontFamily: FONTS.bodyMedium,
    fontSize: 12,
  },
});

export default RegisterScreen;
