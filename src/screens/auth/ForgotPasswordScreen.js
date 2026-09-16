import React, {useState} from 'react';
import {
	KeyboardAvoidingView,
	Platform,
	Pressable,
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

const ForgotPasswordScreen = ({navigation}) => {
	const [email, setEmail] = useState('');

	const handleSendOtp = () => {
		if (!email.trim()) {
			return;
		}

		navigation.navigate('OtpScreen', {email});
	};

	return (
		<KeyboardAvoidingView
			style={styles.container}
			behavior={Platform.OS === 'ios' ? 'padding' : undefined}>

			<StatusBar
				barStyle="light-content"
				backgroundColor={COLORS.background}
			/>

			{/* BACKGROUND GLOW */}
			<View style={styles.topGlow} />
			<View style={styles.bottomGlow} />

			<View style={styles.content}>

				{/* BACK */}
				<Pressable
					style={styles.backButton}
					onPress={() => navigation.goBack()}>
					<Text style={styles.backArrow}>←</Text>
					<Text style={styles.backText}>Back</Text>
				</Pressable>

				{/* BRAND */}
				<View style={styles.brandRow}>
					<View style={styles.brandMark}>
						<Text style={styles.brandMarkText}>U</Text>
					</View>

					<Text style={styles.brandName}>
						{CONFIG.APP_NAME}
					</Text>
				</View>

				{/* HEADING */}
				<View style={styles.headingBlock}>
					<Text style={styles.eyebrow}>
						ACCOUNT RECOVERY
					</Text>

					<Text style={styles.title}>
						Forgot password?
					</Text>

					<Text style={styles.description}>
						Enter your registered email address and
						we'll send you a verification code.
					</Text>
				</View>

				{/* FORM */}
				<View style={styles.form}>

					<Text style={styles.label}>
						EMAIL ADDRESS
					</Text>

					<TextInput
						autoCapitalize="none"
						autoComplete="email"
						keyboardType="email-address"
						onChangeText={setEmail}
						placeholder="you@company.com"
						placeholderTextColor={COLORS.textMuted}
						style={styles.input}
						value={email}
					/>

					{/* SEND OTP */}
					<Pressable
						style={[
							styles.submitButton,
							!email.trim() && styles.disabledButton,
						]}
						onPress={handleSendOtp}
						disabled={!email.trim()}>

						<Text style={styles.submitText}>
							Send OTP
						</Text>

						<Text style={styles.submitArrow}>
							→
						</Text>
					</Pressable>
				</View>

				{/* FOOTER */}
				<View style={styles.footer}>
					<Text style={styles.footerText}>
						Remember your password?
					</Text>

					<Pressable
						onPress={() => navigation.navigate('Login')}>
						<Text style={styles.link}>
							Back to login
						</Text>
					</Pressable>
				</View>

			</View>
		</KeyboardAvoidingView>
	);
};

const styles = StyleSheet.create({
	container: {
		backgroundColor: COLORS.background,
		flex: 1,
	},

content: {
  flexGrow: 1,
  paddingHorizontal: SPACING.lg,
  paddingTop: SPACING.xxxl,
  paddingBottom: SPACING.xxxl,
},

	/* GLOW */

	topGlow: {
		backgroundColor: COLORS.orange,
		borderRadius: 180,
		height: 360,
		opacity: 0.07,
		position: 'absolute',
		right: -180,
		top: -170,
		width: 360,
	},

	bottomGlow: {
		backgroundColor: COLORS.pink,
		borderRadius: 180,
		bottom: -180,
		height: 360,
		left: -180,
		opacity: 0.05,
		position: 'absolute',
		width: 360,
	},

	/* BACK */

	backButton: {
		alignItems: 'center',
		alignSelf: 'flex-start',
		flexDirection: 'row',
		marginBottom: 28,
		paddingVertical: 6,
	},

	backArrow: {
		color: COLORS.text,
		fontFamily: FONTS.heading,
		fontSize: 22,
		marginRight: 8,
	},

	backText: {
		color: COLORS.textMuted,
		fontFamily: FONTS.bodyMedium,
		fontSize: 13,
	},

	/* BRAND */

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

	/* HEADING */

	headingBlock: {
		marginTop: 72,
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
		fontSize: 32,
		marginTop: SPACING.sm,
	},

	description: {
		color: COLORS.textMuted,
		fontFamily: FONTS.body,
		fontSize: 14,
		lineHeight: 21,
		marginTop: SPACING.sm,
		maxWidth: 330,
	},

	/* FORM */

	form: {
		marginTop: 42,
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

	/* BUTTON */

	submitButton: {
		alignItems: 'center',
		backgroundColor: COLORS.orange,
		borderRadius: SPACING.radius.md,
		flexDirection: 'row',
		height: 58,
		justifyContent: 'center',
		marginTop: 28,
	},

	disabledButton: {
		opacity: 0.45,
	},

	submitText: {
		color: COLORS.dark,
		fontFamily: FONTS.bodyBold,
		fontSize: 16,
	},

	submitArrow: {
		color: COLORS.dark,
		fontFamily: FONTS.heading,
		fontSize: 22,
		marginLeft: SPACING.sm,
	},

	/* FOOTER */

	footer: {
		alignItems: 'center',
		flexDirection: 'row',
		justifyContent: 'center',
		marginTop: 'auto',
		paddingBottom: 20,
		paddingTop: 48,
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

export default ForgotPasswordScreen;