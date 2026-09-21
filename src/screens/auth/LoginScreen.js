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

import AsyncStorage from '@react-native-async-storage/async-storage';

import {COLORS} from '../../constants/colors';
import {CONFIG} from '../../constants/config';
import {FONTS} from '../../constants/fonts';
import {SPACING} from '../../constants/spacing';

const LoginScreen = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // =========================
  // EMAIL VALIDATION
  // =========================

  const validateEmail = value => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  };

  // =========================
  // LOGIN
  // =========================

  const handleLogin = async () => {
    if (submitting) return;

    let valid = true;
    setEmailError('');
    setPasswordError('');

    const trimmedEmail = email.trim();

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

    if (!valid) return;

    setSubmitting(true);

    try {
      const url = `${CONFIG.API_BASE_URL}/auth/login`;
      console.log('[Login] Calling:', url);

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          email: trimmedEmail,
          password,
        }),
      });

      console.log('[Login] Status:', response.status);

      let data = null;
      try {
        data = await response.json();
      } catch (parseErr) {
        console.log('[Login] Response not JSON:', parseErr);
      }

      console.log('[Login] Response:', data);

      if (!response.ok) {
        const message =
          data?.message ||
          data?.error ||
          `Login failed (${response.status})`;

        setPasswordError(message);
        Alert.alert('Login failed', message);
        return;
      }

      // ========== EXTRACT TOKEN + USER ==========
      const token =
        data?.token ||
        data?.access_token ||
        data?.data?.token ||
        data?.data?.access_token;

      const user = data?.user || data?.data?.user;
      const role = user?.role;

      console.log('========== LOGIN DEBUG ==========');
      console.log('FULL RESPONSE:', data);
      console.log('USER:', user);
      console.log('ROLE:', role);
      console.log('TOKEN:', token);
      console.log('=================================');

      // ========== SAVE TOKEN ==========
      if (!token) {
        Alert.alert(
          'Login error',
          'Token not received from server. Please contact support.',
        );
        return;
      }

      await AsyncStorage.setItem('auth_token', token);
      console.log('✅ Token saved to AsyncStorage');

      // ========== ROLE CHECK + NAVIGATE ==========
      if (
        role === 'organizer' ||
        role === 'manager' ||
        role === 'admin'
      ) {
        console.log('MANAGER ROLE MATCHED → Dashboard');
        navigation.replace('Dashboard');
      } else {
        console.log('ROLE NOT MATCHED:', role);
        Alert.alert(
          'Access Denied',
          `Only manager accounts can login.\nCurrent role: ${role}`,
        );
      }
    } catch (error) {
      console.error('[Login] Network error:', error);

      const msg =
        'Cannot reach server. Check your internet and try again.';

      setPasswordError(msg);
      Alert.alert('Network error', msg);
    } finally {
      setSubmitting(false);
    }
  };

  // =========================
  // GOOGLE LOGIN
  // =========================

  const handleGoogleLogin = () => {
    navigation.replace('Dashboard');
  };

  // =========================
  // APPLE LOGIN
  // =========================

  const handleAppleLogin = () => {
    navigation.replace('OtpScreen');
  };

  // =========================
  // FORM STATE
  // =========================

  const isFormValid =
    email.trim().length > 0 &&
    validateEmail(email.trim()) &&
    password.length >= 8;

  // =========================
  // UI
  // =========================

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={COLORS.background}
      />

      <View style={styles.topGlow} />
      <View style={styles.sideGlow} />

      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        {/* BRAND */}

        <View style={styles.brandRow}>
          <View style={styles.brandMark}>
            <Text style={styles.brandMarkText}>U</Text>
          </View>

          <Text style={styles.brandName}>{CONFIG.APP_NAME}</Text>
        </View>

        {/* HEADING */}

        <View style={styles.headingBlock}>
          <Text style={styles.eyebrow}>EVENT MANAGER</Text>

          <Text style={styles.title}>Welcome back.</Text>

          <Text style={styles.description}>
            Sign in to keep your events moving.
          </Text>
        </View>

        {/* FORM */}

        <View style={styles.form}>
          {/* EMAIL */}

          <Text style={styles.label}>EMAIL ADDRESS</Text>

          <TextInput
            autoCapitalize="none"
            autoComplete="email"
            keyboardType="email-address"
            onChangeText={value => {
              setEmail(value);
              if (emailError) setEmailError('');
            }}
            onBlur={() => {
              if (!email.trim()) {
                setEmailError('Email address is required');
              } else if (!validateEmail(email.trim())) {
                setEmailError('Enter a valid email address');
              }
            }}
            placeholder="you@company.com"
            placeholderTextColor={COLORS.textMuted}
            style={[styles.input, emailError && styles.inputError]}
            value={email}
          />

          {emailError ? (
            <Text style={styles.errorText}>{emailError}</Text>
          ) : null}

          {/* PASSWORD LABEL */}

          <View style={styles.passwordLabelRow}>
            <Text style={styles.label}>PASSWORD</Text>

            <Pressable
              onPress={() =>
                navigation.navigate('ForgotPasswordScreen')
              }>
              <Text style={styles.link}>Forgot password?</Text>
            </Pressable>
          </View>

          {/* PASSWORD */}

          <View
            style={[
              styles.passwordInputWrap,
              passwordError && styles.inputError,
            ]}>
            <TextInput
              autoCapitalize="none"
              autoComplete="password"
              onChangeText={value => {
                setPassword(value);
                if (passwordError) setPasswordError('');
              }}
              onBlur={() => {
                if (!password) {
                  setPasswordError('Password is required');
                } else if (password.length < 8) {
                  setPasswordError(
                    'Password must be at least 8 characters',
                  );
                }
              }}
              placeholder="Enter your password"
              placeholderTextColor={COLORS.textMuted}
              secureTextEntry={!showPassword}
              style={styles.passwordInput}
              value={password}
            />

            <Pressable
              accessibilityLabel={
                showPassword ? 'Hide password' : 'Show password'
              }
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
            <Text style={styles.errorText}>{passwordError}</Text>
          ) : null}

          {/* SIGN IN */}

          <Pressable
            disabled={!isFormValid || submitting}
            onPress={handleLogin}
            style={[
              styles.submitButton,
              (!isFormValid || submitting) &&
                styles.submitButtonDisabled,
            ]}>
            <Text
              style={[
                styles.submitText,
                (!isFormValid || submitting) &&
                  styles.submitTextDisabled,
              ]}>
              {submitting ? 'Signing in…' : 'Sign in'}
            </Text>

            {!submitting && (
              <Text
                style={[
                  styles.submitArrow,
                  !isFormValid && styles.submitTextDisabled,
                ]}>
                →
              </Text>
            )}
          </Pressable>

          {/* DIVIDER */}

          <View style={styles.socialDivider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>
              OR CONTINUE WITH
            </Text>
            <View style={styles.dividerLine} />
          </View>

          {/* GOOGLE */}

          <Pressable
            onPress={handleGoogleLogin}
            style={styles.socialButton}>
            <View style={styles.googleIcon}>
              <Text style={styles.googleIconText}>G</Text>
            </View>
            <Text style={styles.socialButtonText}>
              Continue with Google
            </Text>
          </Pressable>

          {/* APPLE */}

          {Platform.OS === 'ios' && (
            <Pressable
              onPress={handleAppleLogin}
              style={styles.socialButton}>
              <Text style={styles.appleIcon}>●</Text>
              <Text style={styles.socialButtonText}>
                Continue with Apple
              </Text>
            </Pressable>
          )}
        </View>

        {/* FOOTER */}

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            New to {CONFIG.APP_NAME}?
          </Text>

          <Pressable
            onPress={() => navigation.navigate('RegisterScreen')}>
            <Text style={styles.link}>
              Register your account
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

// =========================
// STYLES
// =========================

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.background,
    flex: 1,
  },

  content: {
    flexGrow: 1,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.xl,
    paddingBottom: SPACING.xxxl,
  },

  topGlow: {
    backgroundColor: COLORS.orange,
    borderRadius: 180,
    height: 360,
    opacity: 0.08,
    position: 'absolute',
    right: -160,
    top: -180,
    width: 360,
  },

  sideGlow: {
    backgroundColor: COLORS.pink,
    borderRadius: 140,
    bottom: -140,
    height: 280,
    opacity: 0.06,
    position: 'absolute',
    left: -150,
    width: 280,
  },

  brandRow: {
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: SPACING.sm,
  },

  brandMark: {
    alignItems: 'center',
    backgroundColor: COLORS.orange,
    borderRadius: SPACING.sm,
    height: 36,
    justifyContent: 'center',
    marginRight: SPACING.sm,
    transform: [{rotate: '-8deg'}],
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
    marginTop: 58,
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
    fontSize: 36,
    marginTop: SPACING.sm,
  },

  description: {
    color: COLORS.textMuted,
    fontFamily: FONTS.body,
    fontSize: 15,
    marginTop: SPACING.sm,
  },

  form: {
    marginTop: 38,
  },

  label: {
    color: COLORS.textMuted,
    fontFamily: FONTS.bodyBold,
    fontSize: 11,
    letterSpacing: 1.2,
    marginBottom: SPACING.sm,
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

  passwordLabelRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: SPACING.xl,
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

  link: {
    color: COLORS.orange,
    fontFamily: FONTS.bodyMedium,
    fontSize: 12,
  },

  submitButton: {
    alignItems: 'center',
    backgroundColor: COLORS.orange,
    borderRadius: SPACING.radius.md,
    flexDirection: 'row',
    height: 58,
    justifyContent: 'center',
    marginTop: 28,
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

  submitArrow: {
    color: COLORS.dark,
    fontFamily: FONTS.heading,
    fontSize: 22,
    marginLeft: SPACING.sm,
  },

  socialDivider: {
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 18,
    marginTop: 28,
  },

  dividerLine: {
    backgroundColor: COLORS.border,
    flex: 1,
    height: 1,
  },

  dividerText: {
    color: COLORS.textMuted,
    fontFamily: FONTS.bodyBold,
    fontSize: 9,
    letterSpacing: 1,
    marginHorizontal: 12,
  },

  socialButton: {
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderColor: COLORS.border,
    borderRadius: SPACING.radius.md,
    borderWidth: 1,
    flexDirection: 'row',
    height: 56,
    justifyContent: 'center',
    marginBottom: 12,
  },

  socialButtonText: {
    color: COLORS.text,
    fontFamily: FONTS.bodyMedium,
    fontSize: 14,
  },

  googleIcon: {
    alignItems: 'center',
    height: 22,
    justifyContent: 'center',
    marginRight: 12,
    width: 22,
  },

  googleIconText: {
    color: COLORS.text,
    fontFamily: FONTS.bodyBold,
    fontSize: 18,
  },

  appleIcon: {
    color: COLORS.text,
    fontSize: 18,
    marginRight: 12,
  },

  footer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 'auto',
    paddingTop: 42,
  },

  footerText: {
    color: COLORS.textMuted,
    fontFamily: FONTS.body,
    fontSize: 12,
    marginRight: SPACING.xs,
  },
});

export default LoginScreen;