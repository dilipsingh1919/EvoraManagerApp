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
  ImageBackground,
  Image,
} from 'react-native';

const EVENTS = [
  {
    id: '1',
    title: 'Navratri Utsav 2026',
    date: 'Thu, Sep 17, 2026',
    time: '8:00 PM – 2:00 AM',
    location: 'NawalGarh Grounds',

    price: '300.00',
    currency: 'IND',
    status: 'Today',
    categories: ['MUSIC', 'FOOD', 'DRINKS', 'VIBES'],
    image:
      'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1200&q=90',
  },
  {
    id: '2',
    title: 'le halo Festival 2026',
    date: 'Sat, Oct 17, 2026',
    time: '6:00 PM – 2:00 AM',
    location: 'NawalGarh ',
   
    price: '500.00',
    currency: 'IND',
    status: 'Next Event',
    categories: ['MUSIC', 'FOOD', 'DRINKS', 'VIBES'],
    image:
      'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=1200&q=90',
  },
];

/* =====================================================
   EVENT CARD
===================================================== */

const EventCard = ({event, onPress}) => {
  const priceValue = event.price.replace('$', '');

  return (
    <Pressable
      onPress={onPress}
      style={({pressed}) => [
        styles.eventCard,
        pressed && styles.pressed,
      ]}>
      <ImageBackground
        source={{uri: event.image}}
        style={styles.eventImage}
        imageStyle={styles.eventImageRadius}>
        <View style={styles.imageDark} />

        {/* EVENT TAG */}
        <View style={styles.eventTag}>
          <View style={styles.tagDot} />
          <Text style={styles.eventTagText}>{event.status}</Text>
        </View>

        {/* PRICE */}
        <View style={styles.priceBox}>
          <Text style={styles.currency}>{event.currency}</Text>
          <Text style={styles.price}>{priceValue}</Text>
        </View>

        {/* TITLE */}
        <View style={styles.imageBottom}>
          <Text style={styles.eventImageTitle} numberOfLines={1}>
            {event.title}
          </Text>

          <View style={styles.categoryRow}>
            {event.categories.map((cat, idx) => (
              <React.Fragment key={cat}>
                <Text style={styles.category}>{cat}</Text>
                {idx < event.categories.length - 1 && (
                  <Text style={styles.categoryDot}>•</Text>
                )}
              </React.Fragment>
            ))}
          </View>
        </View>
      </ImageBackground>

      {/* EVENT DETAILS */}
      <View style={styles.eventDetails}>
        <View style={styles.detailBlock}>
          <View style={styles.detailIconBox}>
            <Text style={styles.detailIcon}>📅</Text>
          </View>

          <View style={styles.detailTextBox}>
            <Text style={styles.detailMain} numberOfLines={1}>
              {event.date}
            </Text>
            <Text style={styles.detailSub} numberOfLines={1}>
              {event.time}
            </Text>
          </View>
        </View>

        <View style={styles.detailDivider} />

        <View style={styles.detailBlock}>
          <View style={styles.detailIconBox}>
            <Text style={styles.detailIcon}>📍</Text>
          </View>

          <View style={styles.detailTextBox}>
            <Text style={styles.detailMain} numberOfLines={1}>
              {event.location}
            </Text>
            <Text style={styles.detailSub} numberOfLines={1}>
              {event.city}
            </Text>
          </View>
        </View>

        <Pressable style={styles.bookButton} onPress={onPress}>
          <Text style={styles.bookText}>Book Now</Text>
          <Text style={styles.bookArrow}>→</Text>
        </Pressable>
      </View>
    </Pressable>
  );
};

/* =====================================================
   STAT CARD
===================================================== */

const StatCard = ({icon, value, label}) => {
  return (
    <View style={styles.statCard}>
      <View style={styles.statTop}>
        <View style={styles.statIcon}>
          <Text style={styles.statIconText}>{icon}</Text>
        </View>
        <View style={styles.statDot} />
      </View>

      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
};

/* =====================================================
   NAV ITEM
===================================================== */

const NavItem = ({icon, label, active, onPress}) => {
  return (
    <Pressable style={styles.navItem} onPress={onPress}>
      <Text style={[styles.navIcon, active && styles.navIconActive]}>
        {icon}
      </Text>
      <Text style={[styles.navLabel, active && styles.navLabelActive]}>
        {label}
      </Text>
      {active && <View style={styles.activeLine} />}
    </Pressable>
  );
};

/* =====================================================
   DASHBOARD SCREEN
===================================================== */

const DashboardScreen = ({navigation}) => {
  const [search, setSearch] = useState('');

  const filteredEvents = EVENTS.filter(event => {
    const q = search.toLowerCase();
    return (
      event.title.toLowerCase().includes(q) ||
      event.city.toLowerCase().includes(q) ||
      event.location.toLowerCase().includes(q)
    );
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#05050D" />

      {/* BACKGROUND GLOW */}
      <View style={styles.glowPink} />
      <View style={styles.glowOrange} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        {/* ================= HEADER ================= */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <Pressable style={styles.iconButton}>
              <Text style={styles.menuIcon}>☰</Text>
            </Pressable>

            <View style={styles.logoContainer}>
              <Image
                source={require('../../assets/icons/icon.png')}
                style={styles.logoImage}
                resizeMode="contain"
              />
              <Text style={styles.logoSub}>EVENTS • PEOPLE • MEMORIES</Text>
            </View>

            <View style={styles.headerRight}>
              <Pressable style={styles.iconButton}>
                <Text style={styles.bell}>🔔</Text>
                <View style={styles.notificationDot} />
              </Pressable>

            
            </View>
          </View>

          <Text style={styles.tagline}>Har Pal, Ek Naya Utsav</Text>
        </View>

        {/* ================= SEARCH ================= */}
        <View style={styles.searchBox}>
          <Text style={styles.searchIcon}>🔍</Text>

          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search events..."
            placeholderTextColor="#858899"
            style={styles.searchInput}
            returnKeyType="search"
          />

          <Pressable style={styles.filterButton}>
            <Text style={styles.filterIcon}>⚙</Text>
          </Pressable>
        </View>

        {/* ================= UPCOMING HEADER ================= */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Upcoming Events</Text>

          <Pressable onPress={() => navigation.navigate('Events')}>
            <Text style={styles.viewAll}>View All →</Text>
          </Pressable>
        </View>

        {/* ================= EVENTS ================= */}
        {filteredEvents.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>🔍</Text>
            <Text style={styles.emptyTitle}>No events found</Text>
            <Text style={styles.emptySub}>Try a different search</Text>
          </View>
        ) : (
          filteredEvents.map(event => (
            <EventCard
              key={event.id}
              event={event}
              onPress={() =>
                navigation.navigate('EventDetails', {event})
              }
            />
          ))
        )}

        {/* ================= CREATE EVENT ================= */}
        <Pressable
          onPress={() => navigation.navigate('CreateEvent')}
          style={({pressed}) => [
            styles.createCard,
            pressed && styles.pressed,
          ]}>
          <View style={styles.createTextWrap}>
            <Text style={styles.createSmall}>PLAN SOMETHING GREAT</Text>
            <Text style={styles.createTitle}>Create a new event</Text>
            <Text style={styles.createSub}>
              Bring your next event to life
            </Text>
          </View>

          <View style={styles.createButton}>
            <Text style={styles.createPlus}>+</Text>
          </View>
        </Pressable>

        {/* ================= OVERVIEW ================= */}
        <View style={styles.sectionHeaderSimple}>
          <View>
            <Text style={styles.sectionTitle}>Overview</Text>
            <Text style={styles.sectionSubtitle}>Your event activity</Text>
          </View>
        </View>

        <View style={styles.statsRow}>
          <StatCard icon="📅" value="12" label="Total Events" />
          <StatCard icon="⏰" value="04" label="Upcoming" />
        </View>

        <View style={styles.statsRow}>
          <StatCard icon="👥" value="486" label="Attendees" />
          <StatCard icon="✅" value="08" label="Completed" />
        </View>

        {/* ================= QUICK ACTIONS ================= */}
        <View style={styles.sectionHeaderSimple}>
          <View>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            <Text style={styles.sectionSubtitle}>
              Manage your events faster
            </Text>
          </View>
        </View>

        <View style={styles.quickRow}>
          <Pressable
            style={styles.quickCard}
            onPress={() => navigation.navigate('Events')}>
            <View style={styles.quickIcon}>
              <Text style={styles.quickIconText}>📅</Text>
            </View>

            <View style={styles.quickContent}>
              <Text style={styles.quickTitle}>My Events</Text>
              <Text style={styles.quickSub}>View all events</Text>
            </View>

            <Text style={styles.quickArrow}>→</Text>
          </Pressable>

          <Pressable
            style={styles.quickCard}
            onPress={() => navigation.navigate('Calendar')}>
            <View style={styles.quickIcon}>
              <Text style={styles.quickIconText}>🗓</Text>
            </View>

            <View style={styles.quickContent}>
              <Text style={styles.quickTitle}>Calendar</Text>
              <Text style={styles.quickSub}>Check schedule</Text>
            </View>

            <Text style={styles.quickArrow}>→</Text>
          </Pressable>
        </View>
      </ScrollView>

      {/* ================= BOTTOM NAV ================= */}
      <View style={styles.bottomNav}>
        <NavItem icon="" label="Live" active />
        <NavItem
          icon="📅"
          label="Events"
          onPress={() => navigation.navigate('Past')}
        />
        <NavItem
          icon="✎"
          label="Draft"
          onPress={() => navigation.navigate('Draft')}
        />
       
      </View>
    </View>
  );
};

export default DashboardScreen;

/* =====================================================
   STYLES
===================================================== */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#05050D',
  },

  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: (StatusBar.currentHeight ?? 0) + 12,
    paddingBottom: 130,
  },

  /* BACKGROUND GLOW */

  glowPink: {
    position: 'absolute',
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: '#E927A9',
    opacity: 0.05,
    top: -130,
    right: -100,
  },

  glowOrange: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: '#FF721F',
    opacity: 0.04,
    top: 300,
    left: -130,
  },

  /* HEADER */

  header: {
    marginBottom: 22,
  },

  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  iconButton: {
    width: 42,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
  },

  menuIcon: {
    color: '#FFFFFF',
    fontSize: 22,
    lineHeight: 24,
  },

  logoContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  logoImage: {
    width: 120,
    height: 40,
  },

  logoSub: {
    color: '#9A9DAC',
    fontSize: 7,
    letterSpacing: 1.7,
    marginTop: 2,
  },

  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  bell: {
    color: '#FFFFFF',
    fontSize: 20,
    lineHeight: 22,
  },

  notificationDot: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF277E',
    borderWidth: 1.5,
    borderColor: '#05050D',
  },

  profileCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#FF6D27',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 4,
  },

  profileIcon: {
    fontSize: 18,
  },

  tagline: {
    color: '#FF6E28',
    fontSize: 14,
    fontStyle: 'italic',
    marginTop: 10,
    marginLeft: 4,
  },

  /* SEARCH */

  searchBox: {
    height: 56,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#444759',
    backgroundColor: '#171823',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    marginBottom: 26,
  },

  searchIcon: {
    fontSize: 16,
    marginRight: 10,
  },

  searchInput: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 15,
    paddingVertical: 0,
  },

  filterButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },

  filterIcon: {
    fontSize: 18,
  },

  /* SECTION HEADERS */

  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },

  sectionHeaderSimple: {
    marginTop: 28,
    marginBottom: 14,
  },

  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 21,
    fontWeight: '800',
  },

  sectionSubtitle: {
    color: '#858899',
    fontSize: 11,
    marginTop: 3,
  },

  viewAll: {
    color: '#FF7620',
    fontSize: 13,
    fontWeight: '800',
  },

  /* EVENT CARD */

  eventCard: {
    backgroundColor: '#11121C',
    borderWidth: 1,
    borderColor: '#383B4B',
    borderRadius: 23,
    overflow: 'hidden',
    marginBottom: 20,
  },

  eventImage: {
    height: 200,
    justifyContent: 'space-between',
  },

  eventImageRadius: {
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
  },

  imageDark: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },

  eventTag: {
    alignSelf: 'flex-start',
    margin: 14,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#8521F3',
    flexDirection: 'row',
    alignItems: 'center',
  },

  tagDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#FFD229',
    marginRight: 7,
  },

  eventTagText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },

  priceBox: {
    position: 'absolute',
    right: 14,
    top: 12,
    alignItems: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.45)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },

  currency: {
    color: '#D1D2DA',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },

  price: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '900',
  },

  imageBottom: {
    paddingHorizontal: 16,
    paddingBottom: 14,
  },

  eventImageTitle: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '900',
    textTransform: 'uppercase',
    marginBottom: 6,
  },

  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },

  category: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },

  categoryDot: {
    color: '#FF4F82',
    marginHorizontal: 6,
    fontSize: 11,
  },

  /* EVENT DETAILS */

  eventDetails: {
    minHeight: 84,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 12,
    gap: 6,
  },

  detailBlock: {
    flex: 1,
    minWidth: 0,
    flexDirection: 'row',
    alignItems: 'center',
  },

  detailIconBox: {
    width: 22,
    alignItems: 'center',
    marginRight: 4,
  },

  detailIcon: {
    fontSize: 14,
  },

  detailTextBox: {
    flex: 1,
    minWidth: 0,
  },

  detailMain: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
  },

  detailSub: {
    color: '#858899',
    fontSize: 9,
    marginTop: 3,
  },

  detailDivider: {
    width: 1,
    height: 36,
    backgroundColor: '#3B3D4B',
    marginHorizontal: 2,
  },

  bookButton: {
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E82BA7',
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    marginLeft: 2,
  },

  bookText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '900',
  },

  bookArrow: {
    color: '#FFFFFF',
    fontSize: 15,
    marginLeft: 4,
  },

  /* CREATE CARD */

  createCard: {
    minHeight: 110,
    borderRadius: 21,
    backgroundColor: '#171823',
    borderWidth: 1,
    borderColor: '#383B4B',
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },

  createTextWrap: {
    flex: 1,
    paddingRight: 12,
  },

  createSmall: {
    color: '#FF7025',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1.2,
    marginBottom: 7,
  },

  createTitle: {
    color: '#FFFFFF',
    fontSize: 19,
    fontWeight: '900',
  },

  createSub: {
    color: '#858899',
    fontSize: 11,
    marginTop: 5,
  },

  createButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#E82BA7',
    alignItems: 'center',
    justifyContent: 'center',
  },

  createPlus: {
    color: '#FFFFFF',
    fontSize: 28,
    lineHeight: 30,
    includeFontPadding: false,
    textAlignVertical: 'center',
  },

  /* STATS */

  statsRow: {
    flexDirection: 'row',
    marginBottom: 12,
    gap: 10,
  },

  statCard: {
    flex: 1,
    minHeight: 112,
    backgroundColor: '#11121C',
    borderRadius: 17,
    borderWidth: 1,
    borderColor: '#363948',
    padding: 14,
  },

  statTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },

  statIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#191A26',
    borderWidth: 1,
    borderColor: '#363948',
    alignItems: 'center',
    justifyContent: 'center',
  },

  statIconText: {
    fontSize: 15,
  },

  statDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#E82BA7',
  },

  statValue: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '900',
  },

  statLabel: {
    color: '#858899',
    fontSize: 10,
    marginTop: 2,
  },

  /* QUICK ACTIONS */

  quickRow: {
    flexDirection: 'row',
    gap: 10,
  },

  quickCard: {
    flex: 1,
    minHeight: 88,
    backgroundColor: '#11121C',
    borderRadius: 17,
    borderWidth: 1,
    borderColor: '#363948',
    padding: 11,
    flexDirection: 'row',
    alignItems: 'center',
  },

  quickIcon: {
    width: 38,
    height: 38,
    borderRadius: 13,
    backgroundColor: '#191A26',
    alignItems: 'center',
    justifyContent: 'center',
  },

  quickIconText: {
    fontSize: 15,
  },

  quickContent: {
    flex: 1,
    marginLeft: 8,
    minWidth: 0,
  },

  quickTitle: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },

  quickSub: {
    color: '#858899',
    fontSize: 8,
    marginTop: 3,
  },

  quickArrow: {
    color: '#858899',
    fontSize: 17,
  },

  /* EMPTY STATE */

  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    backgroundColor: '#11121C',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#383B4B',
    marginBottom: 20,
  },

  emptyIcon: {
    fontSize: 32,
    marginBottom: 10,
  },

  emptyTitle: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },

  emptySub: {
    color: '#858899',
    fontSize: 12,
    marginTop: 4,
  },

  /* BOTTOM NAV */

  bottomNav: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: Platform.OS === 'ios' ? 88 : 72,
    paddingBottom: Platform.OS === 'ios' ? 20 : 8,
    paddingTop: 8,
    backgroundColor: '#10111B',
    borderTopWidth: 1,
    borderTopColor: '#303341',
    flexDirection: 'row',
  },

  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },

  navIcon: {
    fontSize: 18,
    marginBottom: 3,
  },

  navIconActive: {
    // emoji tint not possible; keep size bump
  },

  navLabel: {
    color: '#858899',
    fontSize: 9,
    fontWeight: '600',
  },

  navLabelActive: {
    color: '#FF7025',
    fontWeight: '900',
  },

  activeLine: {
    position: 'absolute',
    top: 0,
    width: '55%',
    height: 3,
    borderBottomLeftRadius: 3,
    borderBottomRightRadius: 3,
    backgroundColor: '#E82BA7',
  },

  pressed: {
    opacity: 0.75,
    transform: [{scale: 0.99}],
  },
});