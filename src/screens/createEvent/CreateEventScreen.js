import React, {useState} from 'react';
import {
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
  Image,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

const CATEGORIES = [
  'Music',
  'Food & Drink',
  'Sports',
  'Arts',
  'Tech',
  'Business',
  'Nightlife',
  'Comedy',
];

const CreateEventScreen = ({navigation}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [venueName, setVenueName] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [coverImage] = useState(null);
  const [errors, setErrors] = useState({});

  const handleContinue = () => {
    const newErrors = {};
    if (!title.trim()) newErrors.title = 'Event title is required';
    if (!date.trim()) newErrors.date = 'Date is required';
    if (!venueName.trim()) newErrors.venueName = 'Venue is required';

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      navigation.navigate('Dashboard', {
        draftEventTitle: title.trim(),
      });
    }
  };

  const handleBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
      return;
    }

    navigation.navigate('Dashboard');
  };

  const pickCoverImage = () => {
    // TODO: open image picker
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <StatusBar barStyle="light-content" backgroundColor="#05050D" />

      {/* ================= HEADER ================= */}
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={handleBack}>
          <Text style={styles.backIcon}>←</Text>
        </Pressable>

        <Text style={styles.headerTitle}>Create Event</Text>

        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>

        <View style={styles.progressRow}>
          <View style={styles.stepPill}><Text style={styles.stepText}>STEP 1</Text></View>
          <View style={styles.progressTrack}><View style={styles.progressFill} /></View>
          <Text style={styles.progressLabel}>Details</Text>
        </View>

        {/* ================= HERO ================= */}
        <Text style={styles.heading}>Let's set up your event</Text>
        <Text style={styles.subheading}>
          Fill in the basics. You can add tickets and guests later.
        </Text>

        {/* ================= COVER IMAGE ================= */}
        <Text style={styles.label}>Cover Image</Text>
        <Pressable style={styles.coverBox} onPress={pickCoverImage}>
          {coverImage ? (
            <Image source={{uri: coverImage}} style={styles.coverImage} />
          ) : (
            <View style={styles.coverPlaceholder}>
              <Text style={styles.coverIcon}>🖼</Text>
              <Text style={styles.coverText}>Tap to upload cover image</Text>
              <Text style={styles.coverHint}>
                Recommended 1200×630 • JPG or PNG
              </Text>
            </View>
          )}
        </Pressable>

        {/* ================= TITLE ================= */}
        <Text style={styles.label}>Event Title *</Text>
        <TextInput
          value={title}
          onChangeText={(t) => {
            setTitle(t);
            if (errors.title) setErrors({...errors, title: null});
          }}
          placeholder="Enter a short distinct name"
          placeholderTextColor="#5C5F70"
          style={[styles.input, errors.title && styles.inputError]}
          maxLength={80}
        />
        {errors.title ? (
          <Text style={styles.errorText}>{errors.title}</Text>
        ) : (
          <Text style={styles.hint}>{title.length}/80 characters</Text>
        )}

        {/* ================= DESCRIPTION ================= */}
        <Text style={styles.label}>Description</Text>
        <TextInput
          value={description}
          onChangeText={setDescription}
          placeholder="Tell people what your event is about..."
          placeholderTextColor="#5C5F70"
          style={[styles.input, styles.multiline]}
          multiline
          numberOfLines={4}
          maxLength={500}
        />

        {/* ================= CATEGORY ================= */}
        <Text style={styles.label}>Category</Text>
        <View style={styles.chipRow}>
          {CATEGORIES.map((cat) => {
            const active = category === cat;
            return (
              <Pressable
                key={cat}
                onPress={() => setCategory(cat)}
                style={[styles.chip, active && styles.chipActive]}>
                <Text
                  style={[
                    styles.chipText,
                    active && styles.chipTextActive,
                  ]}>
                  {cat}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {/* ================= DATE & TIME ================= */}
        <View style={styles.row}>
          <View style={styles.half}>
            <Text style={styles.label}>Date *</Text>
            <TextInput
              value={date}
              onChangeText={(t) => {
                setDate(t);
                if (errors.date) setErrors({...errors, date: null});
              }}
              placeholder="YYYY-MM-DD"
              placeholderTextColor="#5C5F70"
              style={[styles.input, errors.date && styles.inputError]}
            />
            {errors.date && (
              <Text style={styles.errorText}>{errors.date}</Text>
            )}
          </View>

          <View style={styles.half}>
            <Text style={styles.label}>Time</Text>
            <TextInput
              value={time}
              onChangeText={setTime}
              placeholder="HH:MM"
              placeholderTextColor="#5C5F70"
              style={styles.input}
            />
          </View>
        </View>

        {/* ================= VENUE ================= */}
        <Text style={styles.label}>Venue Name *</Text>
        <TextInput
          value={venueName}
          onChangeText={(t) => {
            setVenueName(t);
            if (errors.venueName) setErrors({...errors, venueName: null});
          }}
          placeholder="e.g. The Beach Club"
          placeholderTextColor="#5C5F70"
          style={[styles.input, errors.venueName && styles.inputError]}
        />
        {errors.venueName && (
          <Text style={styles.errorText}>{errors.venueName}</Text>
        )}

        <View style={styles.row}>
          <View style={styles.half}>
            <Text style={styles.label}>City</Text>
            <TextInput
              value={city}
              onChangeText={setCity}
              placeholder="City"
              placeholderTextColor="#5C5F70"
              style={styles.input}
            />
          </View>

          <View style={styles.half}>
            <Text style={styles.label}>Country</Text>
            <TextInput
              value={country}
              onChangeText={setCountry}
              placeholder="Country"
              placeholderTextColor="#5C5F70"
              style={styles.input}
            />
          </View>
        </View>

        {/* ================= NEXT STEPS HINT ================= */}
        <View style={styles.nextBox}>
          <Text style={styles.nextTitle}>Up next</Text>
          <Text style={styles.nextItem}>📅  Set start & end date</Text>
          <Text style={styles.nextItem}>🎫  Add tickets</Text>
          <Text style={styles.nextItem}>👥  Add special guests</Text>
          <Text style={styles.nextItem}>📍  Pick venue location on map</Text>
        </View>

        <View style={styles.footerSpacer} />
      </ScrollView>

      {/* ================= CONTINUE BUTTON ================= */}
      <View style={styles.footer}>
        <Pressable
          onPress={handleContinue}
          style={({pressed}) => [
            styles.continueButton,
            pressed && styles.pressed,
          ]}>
          <Text style={styles.continueText}>Continue</Text>
          <Text style={styles.continueArrow}>→</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

export default CreateEventScreen;

/* =====================================================
   STYLES
===================================================== */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#05050D',
  },

  /* HEADER */
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    height: 68,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1F2130',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#171823',
    borderWidth: 1,
    borderColor: '#383B4B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: {
    color: '#FFFFFF',
    fontSize: 20,
    lineHeight: 22,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  headerSpacer: {width: 40},

  /* SCROLL */
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 140,
  },

  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  stepPill: {
    backgroundColor: '#FF8A00',
    borderRadius: 8,
    paddingHorizontal: 9,
    paddingVertical: 5,
  },
  stepText: {
    color: '#160F08',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.7,
  },
  progressTrack: {
    flex: 1,
    height: 4,
    borderRadius: 3,
    backgroundColor: '#2D2F40',
    marginHorizontal: 10,
    overflow: 'hidden',
  },
  progressFill: {
    width: '25%',
    height: '100%',
    borderRadius: 3,
    backgroundColor: '#FF8A00',
  },
  progressLabel: {
    color: '#9A9DAC',
    fontSize: 11,
    fontWeight: '700',
  },

  /* HEADING */
  heading: {
    color: '#FFFFFF',
    fontSize: 26,
    fontWeight: '900',
    letterSpacing: -0.4,
    marginBottom: 6,
  },
  subheading: {
    color: '#858899',
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 24,
  },

  /* LABEL */
  label: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.3,
    marginBottom: 8,
    marginTop: 16,
  },

  /* COVER */
  coverBox: {
    height: 170,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: '#4A4D60',
    borderStyle: 'dashed',
    backgroundColor: '#171823',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  coverPlaceholder: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  coverIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  coverText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 4,
  },
  coverHint: {
    color: '#5C5F70',
    fontSize: 10,
  },
  coverImage: {
    width: '100%',
    height: '100%',
  },

  /* INPUT */
  input: {
    backgroundColor: '#171823',
    borderWidth: 1,
    borderColor: '#3B3E51',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: Platform.OS === 'ios' ? 14 : 10,
    color: '#FFFFFF',
    fontSize: 15,
  },
  inputError: {
    borderColor: '#FF4F82',
  },
  multiline: {
    minHeight: 100,
    textAlignVertical: 'top',
    paddingTop: 14,
  },
  errorText: {
    color: '#FF4F82',
    fontSize: 11,
    fontWeight: '700',
    marginTop: 6,
  },
  hint: {
    color: '#5C5F70',
    fontSize: 10,
    marginTop: 6,
    alignSelf: 'flex-end',
  },

  /* CHIPS */
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 4,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#383B4B',
    backgroundColor: '#171823',
    marginRight: 8,
    marginBottom: 8,
  },
  chipActive: {
    backgroundColor: '#FF8A00',
    borderColor: '#FF8A00',
  },
  chipText: {
    color: '#858899',
    fontSize: 12,
    fontWeight: '700',
  },
  chipTextActive: {
    color: '#FFFFFF',
  },

  /* ROW */
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  half: {
    width: '48%',
  },

  /* NEXT BOX */
  nextBox: {
    marginTop: 28,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#2A2D3E',
    backgroundColor: '#0F1018',
  },
  nextTitle: {
    color: '#FF7025',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1,
    marginBottom: 10,
  },
  nextItem: {
    color: '#B4B6C3',
    fontSize: 12,
    lineHeight: 22,
  },

  /* FOOTER */
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 16,
    backgroundColor: '#0B0B1A',
    borderTopWidth: 1,
    borderTopColor: '#1F2130',
  },
  footerSpacer: {
    height: 104,
  },
  continueButton: {
    height: 56,
    borderRadius: 18,
    backgroundColor: '#FF8A00',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  continueText: {
    color: '#171009',
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: 0.3,
  },
  continueArrow: {
    color: '#171009',
    fontSize: 18,
    marginLeft: 8,
  },
  pressed: {
    opacity: 0.85,
    transform: [{scale: 0.99}],
  },
});
