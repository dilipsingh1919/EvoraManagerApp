import React, {useRef, useState} from 'react';
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

const OtpScreen = ({navigation}) => {
	const [otp, setOtp] = useState(['', '', '', '', '', '']);

	const inputRefs = useRef([]);

	const handleChange = (value, index) => {
		const cleanValue = value.replace(/[^0-9]/g, '');

		const newOtp = [...otp];
		newOtp[index] = cleanValue;
		setOtp(newOtp);

		if (cleanValue && index < 5) {
			inputRefs.current[index + 1]?.focus();
		}
	};

	const handleKeyPress = (event, index) => {
		if (
			event.nativeEvent.key === 'Backspace' &&
			!otp[index] &&
			index > 0
		) {
			inputRefs.current[index - 1]?.focus();
		}
	};

	const handleVerify = () => {
		const enteredOtp = otp.join('');

		if (enteredOtp.length === 6) {
			navigation.navigate('Dashboard');
		}
	};

	const handleResend = () => {
		setOtp(['', '', '', '', '', '']);
		inputRefs.current[0]?.focus();
	};

	return (
		<KeyboardAvoidingView
			style={styles.container}
			behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
			
			<StatusBar
				barStyle="light-content"
				backgroundColor={COLORS.background}
			/>

			{/* GLOW */}
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
						VERIFICATION
					</Text>

					<Text style={styles.title}>
						Verify your account.
					</Text>

					<Text style={styles.description}>
						Enter the 6-digit OTP sent to your registered
						email address.
					</Text>
				</View>

				{/* OTP */}
				<View style={styles.otpContainer}>
					{otp.map((digit, index) => (
						<TextInput
							key={index}
							ref={ref => {
								inputRefs.current[index] = ref;
							}}
							value={digit}
							onChangeText={value =>
								handleChange(value, index)
							}
							onKeyPress={event =>
								handleKeyPress(event, index)
							}
							keyboardType="number-pad"
							maxLength={1}
							textAlign="center"
							selectTextOnFocus
							style={[
								styles.otpInput,
								digit && styles.otpInputActive,
							]}
						/>
					))}
				</View>

				{/* VERIFY */}
				<Pressable
					style={[
						styles.verifyButton,
						otp.join('').length !== 6 &&
							styles.verifyButtonDisabled,
					]}
					onPress={handleVerify}
					disabled={otp.join('').length !== 6}>
					
					<Text style={styles.verifyText}>
						Verify OTP
					</Text>

					<Text style={styles.verifyArrow}>
						→
					</Text>
				</Pressable>

				{/* RESEND */}
				<View style={styles.resendRow}>
					<Text style={styles.resendText}>
						Didn't receive the code?
					</Text>

					<Pressable onPress={handleResend}>
						<Text style={styles.resendLink}>
							Resend OTP
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
		flex: 1,
		padding: SPACING.xxl,
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

	/* OTP */

	otpContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginTop: 42,
	},

	otpInput: {
		backgroundColor: COLORS.surface,
		borderColor: COLORS.border,
		borderRadius: SPACING.radius.md,
		borderWidth: 1,
		color: COLORS.text,
		fontFamily: FONTS.heading,
		fontSize: 22,
		height: 54,
		width: 46,
	},

	otpInputActive: {
		borderColor: COLORS.orange,
	},

	/* VERIFY */

	verifyButton: {
		alignItems: 'center',
		backgroundColor: COLORS.orange,
		borderRadius: SPACING.radius.md,
		flexDirection: 'row',
		height: 58,
		justifyContent: 'center',
		marginTop: 28,
	},

	verifyButtonDisabled: {
		opacity: 0.45,
	},

	verifyText: {
		color: COLORS.dark,
		fontFamily: FONTS.bodyBold,
		fontSize: 16,
	},

	verifyArrow: {
		color: COLORS.dark,
		fontFamily: FONTS.heading,
		fontSize: 22,
		marginLeft: SPACING.sm,
	},

	/* RESEND */

	resendRow: {
		alignItems: 'center',
		flexDirection: 'row',
		justifyContent: 'center',
		marginTop: 28,
	},

	resendText: {
		color: COLORS.textMuted,
		fontFamily: FONTS.body,
		fontSize: 12,
		marginRight: 5,
	},

	resendLink: {
		color: COLORS.orange,
		fontFamily: FONTS.bodyBold,
		fontSize: 12,
	},
});

export default OtpScreen;