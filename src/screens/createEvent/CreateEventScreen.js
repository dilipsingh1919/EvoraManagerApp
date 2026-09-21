import React, {useEffect, useMemo, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

/* =====================================================
   BASE URL — apna actual URL daalo
===================================================== */

const BASE_URL = 'http://10.0.2.2:5050/api/v1';

/* =====================================================
   API HELPER — har request me token laga do
===================================================== */

const apiRequest = async (endpoint, {method = 'GET', body} = {}) => {
  const token = await AsyncStorage.getItem('auth_token');
  const url = `${BASE_URL}${endpoint}`;

  console.log(`[API] ${method} ${url}`);

  const response = await fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: token ? `Bearer ${token}` : '',
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const text = await response.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch (e) {
    console.log('[API] Non-JSON response:', text);
  }

  console.log(`[API] ${response.status}`, data);

  if (!response.ok) {
    const error = new Error(data?.message || `Request failed (${response.status})`);
    error.response = {status: response.status, data};
    throw error;
  }

  return data;
};

const unwrap = (res, fallback = null) => {
  if (!res) return fallback;
  return res?.data?.result ?? res?.data ?? res ?? fallback;
};

const unwrapList = res => {
  if (!res) return [];
  const data = res?.data?.result ?? res?.data?.events ?? res?.data?.list ?? res?.data;
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.result)) return data.result;
  if (Array.isArray(data?.events)) return data.events;
  if (Array.isArray(data?.list)) return data.list;
  return [];
};

/* =====================================================
   API ENDPOINTS (jo tumhare apiClient me hain)
===================================================== */

const apiClient = {
  managerEvent: eventId =>
    apiRequest(`/manager/events/${eventId}`, {method: 'GET'}),

  managerTickets: (eventId, type = 'all') =>
    apiRequest(`/manager/event-tickets/get-by-event/${eventId}/${type}`, {
      method: 'GET',
    }),

  managerCreateEvent: payload =>
    apiRequest('/manager/events/create-or-update', {
      method: 'POST',
      body: payload,
    }),

  managerCreateTicket: payload =>
    apiRequest('/manager/event-tickets/create', {
      method: 'POST',
      body: payload,
    }),

  managerCreateImage: payload =>
    apiRequest('/manager/event-images/create', {
      method: 'POST',
      body: payload,
    }),

  managerCreateGuest: payload =>
    apiRequest('/manager/event-guests/create', {
      method: 'POST',
      body: payload,
    }),

  managerAddHandler: payload =>
    apiRequest('/manager/event-handlers/add', {
      method: 'POST',
      body: payload,
    }),

  managerCreateCoupon: payload =>
    apiRequest('/manager/coupons/create', {
      method: 'POST',
      body: payload,
    }),
};

/* =====================================================
   CONSTANTS
===================================================== */

const STEPS = [
  {id: 'basics', label: 'Basics', hint: 'Name, when, where'},
  {id: 'media', label: 'Look', hint: 'Cover & gallery'},
  {id: 'tickets', label: 'Event type', hint: 'Tickets & capacity'},
  {id: 'people', label: 'People', hint: 'Guests & team'},
  {id: 'coupons', label: 'Offers', hint: 'Promo codes'},
  {id: 'review', label: 'Submit', hint: 'Admin approval'},
];

const CATEGORIES = [
  'Music',
  'Food & Drink',
  'Workshop',
  'Wellness',
  'Conference',
];

const emptyBasics = {
  title: '',
  description: '',
  category: 'Music',
  startsAt: '',
  endsAt: '',
  venue: {name: '', address: '', city: '', country: 'India'},
  featured: false,
};

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=1200&q=80';

/* =====================================================
   HELPERS
===================================================== */

const money = value => {
  const n = Number(value ?? 0);
  if (Number.isNaN(n)) return '₹0';
  return `₹${n.toLocaleString('en-IN')}`;
};

const toLocalDateTime = value => {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  const pad = n => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
    date.getDate(),
  )}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

const formatWhen = value => {
  if (!value) return 'Date TBA';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return 'Date TBA';
  return d.toLocaleString();
};

const ticketFromApi = row => ({
  _id: row._id || row.id,
  name: row.name || '',
  description: row.description || '',
  price: row.price ?? 0,
  quantity: row.quantity ?? 0,
  currency: row.currency || 'INR',
  type: row.type || 'gate',
});

const isNonComplimentary = ticket =>
  String(ticket.type || '').toLowerCase() !== 'complimentary';

/* =====================================================
   STEP INDICATOR
===================================================== */

const StepRow = ({step, onStep}) => (
  <ScrollView
    horizontal
    showsHorizontalScrollIndicator={false}
    contentContainerStyle={styles.stepRowContent}>
    {STEPS.map((item, index) => {
      const active = index === step;
      const done = index < step;
      return (
        <Pressable
          key={item.id}
          onPress={() => index <= step && onStep(index)}
          style={[
            styles.stepItem,
            active && styles.stepItemActive,
            done && styles.stepItemDone,
          ]}>
          <View style={styles.stepHeader}>
            <View
              style={[
                styles.stepNum,
                active && styles.stepNumActive,
                done && styles.stepNumDone,
              ]}>
              <Text style={styles.stepNumText}>
                {done ? '✓' : index + 1}
              </Text>
            </View>
            <Text
              style={[
                styles.stepLabel,
                active && styles.stepLabelActive,
              ]}>
              {item.label}
            </Text>
          </View>
          <Text
            style={[
              styles.stepHint,
              active && styles.stepHintActive,
            ]}>
            {item.hint}
          </Text>
        </Pressable>
      );
    })}
  </ScrollView>
);

/* =====================================================
   LIVE PREVIEW
===================================================== */

const LivePreview = ({
  basics,
  imageUrl,
  tickets,
  capacity,
  minPrice,
  guests,
  handlers,
  coupons,
}) => {
  const cover = imageUrl || FALLBACK_IMAGE;
  const place =
    [basics.venue.name, basics.venue.city].filter(Boolean).join(' · ') ||
    'Venue TBA';

  return (
    <View style={styles.preview}>
      <View style={styles.previewImageWrap}>
        <Image source={{uri: cover}} style={styles.previewImage} />
        <View style={styles.previewOverlay} />
        <View style={styles.previewBottom}>
          <Text style={styles.previewCategory}>
            {basics.category || 'Event'}
            {basics.featured ? ' · Featured' : ''}
          </Text>
          <Text style={styles.previewTitle} numberOfLines={2}>
            {basics.title.trim() || 'Untitled event'}
          </Text>
        </View>
      </View>

      <View style={styles.previewBody}>
        <Text style={styles.previewDescription} numberOfLines={3}>
          {basics.description.trim() ||
            'Your description will preview here as you type.'}
        </Text>

        <View style={styles.previewMeta}>
          <Text style={styles.previewMetaItem}>
            📅 {formatWhen(basics.startsAt)}
          </Text>
          <Text style={styles.previewMetaItem}>📍 {place}</Text>
          <Text style={styles.previewMetaItem}>
            🎟 {tickets.length} tier{tickets.length === 1 ? '' : 's'} ·{' '}
            {capacity || '∞'} seats · from {money(minPrice)}
          </Text>
        </View>

        <View style={styles.previewCounts}>
          <Text style={styles.previewCount}>{guests.length} guests</Text>
          <Text style={styles.previewCountDot}>·</Text>
          <Text style={styles.previewCount}>{handlers.length} team</Text>
          <Text style={styles.previewCountDot}>·</Text>
          <Text style={styles.previewCount}>{coupons.length} offers</Text>
        </View>
      </View>
    </View>
  );
};

/* =====================================================
   MAIN SCREEN
===================================================== */

export default function CreateEventScreen({navigation, route}) {
  const seedEventId = route?.params?.eventId;

  const [step, setStep] = useState(0);
  const [busy, setBusy] = useState(false);
  const [eventId, setEventId] = useState(seedEventId || null);
  const [basics, setBasics] = useState(emptyBasics);
  const [imageUrl, setImageUrl] = useState('');
  const [extraImages, setExtraImages] = useState([]);
  const [extraImageDraft, setExtraImageDraft] = useState('');
  const [tickets, setTickets] = useState([]);
  const [guests, setGuests] = useState([]);
  const [handlers, setHandlers] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [guestDraft, setGuestDraft] = useState({name: '', email: ''});
  const [handlerDraft, setHandlerDraft] = useState({
    email: '',
    type: 'staff',
  });
  const [couponDraft, setCouponDraft] = useState({
    code: '',
    discount_type: 'percentage',
    discount_value: '10',
  });
  const [hydrating, setHydrating] = useState(Boolean(seedEventId));

  /* ---------- Calculated ---------- */

  const capacity = useMemo(
    () =>
      tickets.reduce(
        (sum, t) => sum + Math.max(0, Number(t.quantity || 0)),
        0,
      ),
    [tickets],
  );

  const minPrice = useMemo(() => {
    const prices = tickets
      .filter(isNonComplimentary)
      .map(t => Number(t.price))
      .filter(p => !Number.isNaN(p));
    return prices.length ? Math.min(...prices) : 0;
  }, [tickets]);

  /* ---------- Hydrate (edit mode) ---------- */

  useEffect(() => {
    if (!seedEventId) return;
    let cancelled = false;

    (async () => {
      setHydrating(true);
      try {
        const [detail, ticketRows] = await Promise.all([
          apiClient.managerEvent(seedEventId),
          apiClient.managerTickets(seedEventId),
        ]);

        if (cancelled) return;

        const event = unwrap(detail, null);
        if (!event) throw new Error('Event not found');

        setEventId(event._id || seedEventId);
        setBasics({
          title: event.title || '',
          description: event.description || '',
          category: event.category || 'Music',
          startsAt: toLocalDateTime(event.startsAt),
          endsAt: toLocalDateTime(event.endsAt),
          venue: {
            name: event.venue?.name || '',
            address: event.venue?.address || '',
            city: event.venue?.city || '',
            country: event.venue?.country || 'India',
          },
          featured: Boolean(event.featured),
        });
        setImageUrl(event.imageUrl || '');

        const rows = unwrapList(ticketRows);
        setTickets(
          (rows.length ? rows : event.ticketTypes || []).map(ticketFromApi),
        );
      } catch (failure) {
        Alert.alert(
          'Error',
          failure?.response?.data?.message || 'Could not load event.',
        );
      } finally {
        if (!cancelled) setHydrating(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [seedEventId]);

  /* ---------- Validation ---------- */

  const validateStep = () => {
    if (step === 0) {
      if (!basics.title.trim()) return 'Event title is required.';
      if (!basics.description.trim()) return 'Description is required.';
      if (!basics.startsAt) return 'Start date and time are required.';
      if (!basics.venue.city.trim()) return 'City is required.';
      if (
        basics.endsAt &&
        new Date(basics.endsAt) < new Date(basics.startsAt)
      ) {
        return 'End time must be after start time.';
      }
    }
    if (step === 2) {
      const sellable = tickets.filter(isNonComplimentary);
      if (!sellable.length) {
        return 'Add at least one non-complimentary ticket before continuing.';
      }
      for (const t of sellable) {
        if (!String(t.name || '').trim()) return 'Every ticket needs a name.';
      }
    }
    return '';
  };

  /* ---------- Draft event (API) ---------- */

  const ensureDraftEvent = async () => {
    if (eventId) return eventId;

    if (!basics.title.trim()) {
      setStep(0);
      throw new Error('Event title is required.');
    }
    if (!basics.description.trim()) {
      setStep(0);
      throw new Error('Description is required.');
    }
    if (!basics.startsAt) {
      setStep(0);
      throw new Error('Start date and time are required.');
    }
    if (!basics.venue.city.trim()) {
      setStep(0);
      throw new Error('City is required.');
    }

    const payload = {
      title: basics.title.trim(),
      description: basics.description.trim(),
      category: basics.category,
      startsAt: new Date(basics.startsAt).toISOString(),
      endsAt: basics.endsAt
        ? new Date(basics.endsAt).toISOString()
        : undefined,
      venue: {
        name: basics.venue.name.trim() || basics.venue.city.trim(),
        address: basics.venue.address.trim() || undefined,
        city: basics.venue.city.trim(),
        country: basics.venue.country.trim() || 'India',
      },
      imageUrl: imageUrl.trim() || undefined,
      featured: Boolean(basics.featured),
      status: 'draft',
      ticketTypes: [],
    };

    // ✅ API CALL
    const response = await apiClient.managerCreateEvent(payload);
    const event = unwrap(response);
    const id = event?._id || event?.id;

    if (!id) throw new Error('Event creation failed — no ID returned');

    setEventId(id);
    console.log('✅ Draft event created:', id);
    return id;
  };

  /* ---------- Steps ---------- */

  const next = () => {
    const err = validateStep();
    if (err) return Alert.alert('Validation', err);
    setStep(s => Math.min(s + 1, STEPS.length - 1));
  };

  const back = () => setStep(s => Math.max(s - 1, 0));

  /* ---------- Open ticket manager ---------- */

  const openTicketFlow = async () => {
    try {
      setBusy(true);
      const id = await ensureDraftEvent();
      navigation.navigate('TicketManager', {
        eventId: id,
        eventTitle: basics.title || 'Event',
      });
    } catch (failure) {
      if (failure?.message && !failure?.response) {
        Alert.alert('Error', failure.message);
        return;
      }
      Alert.alert(
        'Error',
        failure?.response?.data?.message || 'Could not open ticket editor.',
      );
    } finally {
      setBusy(false);
    }
  };

  /* ---------- Publish (API) ---------- */

  const publish = async status => {
    const err = validateStep();
    if (err) return Alert.alert('Validation', err);

    setBusy(true);
    try {
      const id = eventId || (await ensureDraftEvent());

      const payload = {
        id,
        title: basics.title.trim(),
        description: basics.description.trim(),
        category: basics.category,
        startsAt: new Date(basics.startsAt).toISOString(),
        endsAt: basics.endsAt
          ? new Date(basics.endsAt).toISOString()
          : undefined,
        venue: {
          name: basics.venue.name.trim() || basics.venue.city.trim(),
          address: basics.venue.address.trim() || undefined,
          city: basics.venue.city.trim(),
          country: basics.venue.country.trim() || 'India',
        },
        imageUrl: imageUrl.trim() || undefined,
        featured: Boolean(basics.featured),
        status,
      };

      // ✅ 1. Update event
      const updated = await apiClient.managerCreateEvent(payload);
      const event = unwrap(updated);
      const finalId = event?._id || id;

      console.log('✅ Event updated:', finalId, 'status:', status);

      // ✅ 2. Extra images
      for (const url of extraImages) {
        try {
          await apiClient.managerCreateImage({
            eventId: finalId,
            url,
            type: 'flyer',
            sortOrder: 0,
          });
          console.log('✅ Image added:', url);
        } catch (e) {
          console.log('⚠️ Image failed:', e.message);
        }
      }

      // ✅ 3. Cover image
      if (imageUrl.trim()) {
        try {
          await apiClient.managerCreateImage({
            eventId: finalId,
            url: imageUrl.trim(),
            type: 'cover',
            sortOrder: 0,
          });
          console.log('✅ Cover image added');
        } catch (e) {
          console.log('⚠️ Cover image failed:', e.message);
        }
      }

      // ✅ 4. Guests
      for (const g of guests) {
        try {
          await apiClient.managerCreateGuest({
            eventId: finalId,
            name: g.name,
            email: g.email,
          });
          console.log('✅ Guest added:', g.email);
        } catch (e) {
          console.log('⚠️ Guest failed:', e.message);
        }
      }

      // ✅ 5. Handlers
      for (const h of handlers) {
        try {
          await apiClient.managerAddHandler({
            eventId: finalId,
            email: h.email,
            type: h.type,
          });
          console.log('✅ Handler added:', h.email);
        } catch (e) {
          console.log('⚠️ Handler failed:', e.message);
        }
      }

      // ✅ 6. Coupons
      for (const c of coupons) {
        try {
          await apiClient.managerCreateCoupon({
            event_id: finalId,
            code: c.code,
            discount_type: c.discount_type,
            discount_value: Number(c.discount_value),
          });
          console.log('✅ Coupon added:', c.code);
        } catch (e) {
          console.log('⚠️ Coupon failed:', e.message);
        }
      }

      const message =
        status === 'review_pending'
          ? `"${event?.title}" submitted for admin approval.`
          : status === 'published'
          ? `"${event?.title}" is live and ready to sell.`
          : `"${event?.title}" saved as draft.`;

      Alert.alert('Success', message, [
        {text: 'OK', onPress: () => navigation.goBack()},
      ]);
    } catch (failure) {
      console.log('❌ Publish failed:', failure);
      Alert.alert(
        'Error',
        failure?.response?.data?.message || 'Event could not be saved.',
      );
    } finally {
      setBusy(false);
    }
  };

  /* ---------- Render ---------- */

  if (hydrating) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#05050D" />
        <View style={styles.center}>
          <ActivityIndicator color="#E82BA7" size="large" />
          <Text style={styles.centerText}>Loading event…</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#05050D" />

      <KeyboardAvoidingView
        style={{flex: 1}}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}>
          {/* HEADER */}
          <View style={styles.header}>
            <Pressable
              onPress={() => navigation.goBack()}
              style={styles.backBtn}>
              <Text style={styles.backText}>← All events</Text>
            </Pressable>

            <Text style={styles.kicker}>
              {seedEventId ? 'EDIT EVENT' : 'NEW EVENT'}
            </Text>
            <Text style={styles.title}>
              {seedEventId ? 'Update the night.' : 'Build the night.'}
            </Text>
            <Text style={styles.subtitle}>
              Fill the form. Watch the preview update below.
            </Text>

            <View style={styles.stepBadge}>
              <Text style={styles.stepBadgeText}>
                Step {step + 1} / {STEPS.length}
              </Text>
            </View>
          </View>

          <StepRow step={step} onStep={setStep} />

          <LivePreview
            basics={basics}
            imageUrl={imageUrl}
            tickets={tickets}
            capacity={capacity}
            minPrice={minPrice}
            guests={guests}
            handlers={handlers}
            coupons={coupons}
          />

          <View style={styles.content}>
            {step === 0 && (
              <BasicsStep basics={basics} setBasics={setBasics} />
            )}

            {step === 1 && (
              <MediaStep
                imageUrl={imageUrl}
                setImageUrl={setImageUrl}
                extraImages={extraImages}
                setExtraImages={setExtraImages}
                extraImageDraft={extraImageDraft}
                setExtraImageDraft={setExtraImageDraft}
              />
            )}

            {step === 2 && (
              <TicketsStep
                tickets={tickets}
                capacity={capacity}
                minPrice={minPrice}
                busy={busy}
                onOpenTicketFlow={openTicketFlow}
              />
            )}

            {step === 3 && (
              <PeopleStep
                guests={guests}
                setGuests={setGuests}
                guestDraft={guestDraft}
                setGuestDraft={setGuestDraft}
                handlers={handlers}
                setHandlers={setHandlers}
                handlerDraft={handlerDraft}
                setHandlerDraft={setHandlerDraft}
              />
            )}

            {step === 4 && (
              <CouponsStep
                coupons={coupons}
                setCoupons={setCoupons}
                couponDraft={couponDraft}
                setCouponDraft={setCouponDraft}
              />
            )}

            {step === 5 && (
              <ReviewStep
                basics={basics}
                tickets={tickets}
                capacity={capacity}
                minPrice={minPrice}
                busy={busy}
                onPublish={publish}
              />
            )}
          </View>

          <View style={styles.navRow}>
            <Pressable
              disabled={step === 0 || busy}
              onPress={back}
              style={[
                styles.navBack,
                (step === 0 || busy) && {opacity: 0.3},
              ]}>
              <Text style={styles.navBackText}>← Back</Text>
            </Pressable>

            {step < STEPS.length - 1 ? (
              <Pressable
                disabled={busy}
                onPress={next}
                style={[styles.navNext, busy && {opacity: 0.6}]}>
                <Text style={styles.navNextText}>
                  {busy ? 'Saving…' : 'Continue →'}
                </Text>
              </Pressable>
            ) : (
              <Text style={styles.navHint}>Choose draft or publish</Text>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

/* =====================================================
   STEP COMPONENTS
===================================================== */

const Input = ({label, ...props}) => (
  <View style={styles.field}>
    <Text style={styles.label}>{label}</Text>
    <TextInput
      placeholderTextColor="#7A7A85"
      style={styles.input}
      {...props}
    />
  </View>
);

const BasicsStep = ({basics, setBasics}) => (
  <View style={{gap: 18}}>
    <Input
      label="EVENT TITLE"
      placeholder="Midnight Market"
      value={basics.title}
      onChangeText={v => setBasics({...basics, title: v})}
    />

    <Input
      label="DESCRIPTION"
      placeholder="Tell people what this night feels like…"
      value={basics.description}
      onChangeText={v => setBasics({...basics, description: v})}
      multiline
      numberOfLines={4}
      style={[styles.input, styles.inputMultiline]}
    />

    <View style={styles.row2}>
      <View style={{flex: 1}}>
        <Input
          label="STARTS"
          placeholder="2026-09-17T20:00"
          value={basics.startsAt}
          onChangeText={v => setBasics({...basics, startsAt: v})}
        />
      </View>
      <View style={{flex: 1}}>
        <Input
          label="ENDS (OPTIONAL)"
          placeholder="2026-09-18T02:00"
          value={basics.endsAt}
          onChangeText={v => setBasics({...basics, endsAt: v})}
        />
      </View>
    </View>

    <View style={styles.field}>
      <Text style={styles.label}>CATEGORY</Text>
      <View style={styles.chipsRow}>
        {CATEGORIES.map(c => (
          <Pressable
            key={c}
            onPress={() => setBasics({...basics, category: c})}
            style={[
              styles.chip,
              basics.category === c && styles.chipActive,
            ]}>
            <Text
              style={[
                styles.chipText,
                basics.category === c && styles.chipTextActive,
              ]}>
              {c}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>

    <Input
      label="VENUE"
      placeholder="Venue name"
      value={basics.venue.name}
      onChangeText={v =>
        setBasics({...basics, venue: {...basics.venue, name: v}})
      }
    />

    <View style={styles.row2}>
      <View style={{flex: 1}}>
        <Input
          label="CITY"
          placeholder="Mumbai"
          value={basics.venue.city}
          onChangeText={v =>
            setBasics({...basics, venue: {...basics.venue, city: v}})
          }
        />
      </View>
      <View style={{flex: 1}}>
        <Input
          label="COUNTRY"
          placeholder="India"
          value={basics.venue.country}
          onChangeText={v =>
            setBasics({...basics, venue: {...basics.venue, country: v}})
          }
        />
      </View>
    </View>

    <Input
      label="ADDRESS"
      placeholder="Street address"
      value={basics.venue.address}
      onChangeText={v =>
        setBasics({...basics, venue: {...basics.venue, address: v}})
      }
    />

    <View style={styles.switchRow}>
      <Text style={styles.switchLabel}>
        Feature on the public home page when published
      </Text>
      <Switch
        value={basics.featured}
        onValueChange={v => setBasics({...basics, featured: v})}
        trackColor={{false: '#333', true: '#E82BA7'}}
        thumbColor="#FFFFFF"
      />
    </View>
  </View>
);

const MediaStep = ({
  imageUrl,
  setImageUrl,
  extraImages,
  setExtraImages,
  extraImageDraft,
  setExtraImageDraft,
}) => (
  <View style={{gap: 18}}>
    <Input
      label="COVER IMAGE URL"
      placeholder="https://…"
      value={imageUrl}
      onChangeText={setImageUrl}
      autoCapitalize="none"
    />
    <Text style={styles.helper}>
      Paste a hosted image URL. Direct upload is not enabled in this build.
    </Text>

    {imageUrl ? (
      <Image source={{uri: imageUrl}} style={styles.coverPreview} />
    ) : null}

    <Text style={styles.label}>GALLERY IMAGES</Text>

    <View style={styles.row2}>
      <TextInput
        placeholder="Extra image URL"
        placeholderTextColor="#7A7A85"
        value={extraImageDraft}
        onChangeText={setExtraImageDraft}
        style={[styles.input, {flex: 1}]}
        autoCapitalize="none"
      />
      <Pressable
        onPress={() => {
          if (!extraImageDraft.trim()) return;
          setExtraImages([...extraImages, extraImageDraft.trim()]);
          setExtraImageDraft('');
        }}
        style={styles.addBtn}>
        <Text style={styles.addBtnText}>+</Text>
      </Pressable>
    </View>

    <View style={styles.galleryGrid}>
      {extraImages.map((url, i) => (
        <View key={`${url}-${i}`} style={styles.galleryItem}>
          <Image source={{uri: url}} style={styles.galleryImage} />
          <Pressable
            onPress={() =>
              setExtraImages(extraImages.filter((_, idx) => idx !== i))
            }
            style={styles.galleryDelete}>
            <Text style={styles.galleryDeleteText}>✕</Text>
          </Pressable>
        </View>
      ))}
    </View>
  </View>
);

const TicketsStep = ({tickets, capacity, minPrice, busy, onOpenTicketFlow}) => (
  <View style={{gap: 18}}>
    <Text style={styles.label}>EVENT TYPE</Text>
    <Text style={styles.sectionTitle}>Tickets</Text>
    <Text style={styles.helper}>
      Submit for review needs at least one non-complimentary ticket.
    </Text>

    <View style={styles.ticketBox}>
      <View style={styles.ticketBoxHeader}>
        <View style={{flex: 1}}>
          <Text style={styles.ticketBoxTitle}>
            {tickets.length
              ? `${tickets.length} ticket tier${
                  tickets.length === 1 ? '' : 's'
                }`
              : 'No tickets yet'}
          </Text>
          <Text style={styles.ticketBoxSub}>
            {capacity ? `${capacity} seats` : 'Unlimited / unset'} · from{' '}
            {money(minPrice)}
          </Text>
        </View>

        <Pressable
          disabled={busy}
          onPress={onOpenTicketFlow}
          style={[styles.primaryBtn, busy && {opacity: 0.6}]}>
          <Text style={styles.primaryBtnText}>
            + {tickets.length ? 'Manage' : 'Add tickets'}
          </Text>
        </Pressable>
      </View>

      {tickets.length ? (
        <View style={styles.ticketList}>
          {tickets.map((t, i) => (
            <View
              key={t._id || `${t.name}-${i}`}
              style={styles.ticketRow}>
              <Text style={styles.ticketName}>{t.name}</Text>
              <Text style={styles.ticketPrice}>
                {money(t.price)} · {t.quantity || '∞'}
              </Text>
            </View>
          ))}
        </View>
      ) : null}
    </View>
  </View>
);

const PeopleStep = ({
  guests,
  setGuests,
  guestDraft,
  setGuestDraft,
  handlers,
  setHandlers,
  handlerDraft,
  setHandlerDraft,
}) => (
  <View style={{gap: 28}}>
    <View>
      <Text style={styles.label}>FEATURED GUESTS</Text>

      <View style={styles.row2}>
        <TextInput
          placeholder="Name"
          placeholderTextColor="#7A7A85"
          value={guestDraft.name}
          onChangeText={v => setGuestDraft({...guestDraft, name: v})}
          style={[styles.input, {flex: 1}]}
        />
        <TextInput
          placeholder="Email"
          placeholderTextColor="#7A7A85"
          value={guestDraft.email}
          onChangeText={v => setGuestDraft({...guestDraft, email: v})}
          style={[styles.input, {flex: 1}]}
          autoCapitalize="none"
          keyboardType="email-address"
        />
      </View>

      <Pressable
        onPress={() => {
          if (!guestDraft.name.trim() || !guestDraft.email.trim()) {
            return Alert.alert('Validation', 'Guest name and email required.');
          }
          setGuests([...guests, {...guestDraft}]);
          setGuestDraft({name: '', email: ''});
        }}
        style={styles.smallBtn}>
        <Text style={styles.smallBtnText}>Add Guest</Text>
      </Pressable>

      <View style={styles.list}>
        {guests.map((g, i) => (
          <View key={`${g.email}-${i}`} style={styles.listRow}>
            <Text style={styles.listText}>
              {g.name} <Text style={styles.listMuted}>· {g.email}</Text>
            </Text>
            <Pressable
              onPress={() =>
                setGuests(guests.filter((_, idx) => idx !== i))
              }>
              <Text style={styles.deleteText}>✕</Text>
            </Pressable>
          </View>
        ))}
        {!guests.length ? (
          <Text style={styles.emptyText}>No guests yet — optional.</Text>
        ) : null}
      </View>
    </View>

    <View>
      <Text style={styles.label}>TEAM INVITES</Text>

      <View style={styles.row2}>
        <TextInput
          placeholder="Email"
          placeholderTextColor="#7A7A85"
          value={handlerDraft.email}
          onChangeText={v => setHandlerDraft({...handlerDraft, email: v})}
          style={[styles.input, {flex: 1}]}
          autoCapitalize="none"
          keyboardType="email-address"
        />
      </View>

      <View style={styles.chipsRow}>
        {['staff', 'ambassador', 'outlet'].map(t => (
          <Pressable
            key={t}
            onPress={() => setHandlerDraft({...handlerDraft, type: t})}
            style={[
              styles.chip,
              handlerDraft.type === t && styles.chipActive,
            ]}>
            <Text
              style={[
                styles.chipText,
                handlerDraft.type === t && styles.chipTextActive,
              ]}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </Text>
          </Pressable>
        ))}
      </View>

      <Pressable
        onPress={() => {
          if (!handlerDraft.email.trim()) {
            return Alert.alert('Validation', 'Team email required.');
          }
          setHandlers([...handlers, {...handlerDraft}]);
          setHandlerDraft({email: '', type: 'staff'});
        }}
        style={styles.smallBtn}>
        <Text style={styles.smallBtnText}>Invite</Text>
      </Pressable>

      <View style={styles.list}>
        {handlers.map((h, i) => (
          <View key={`${h.email}-${i}`} style={styles.listRow}>
            <Text style={styles.listText}>
              {h.email} <Text style={styles.listMuted}>· {h.type}</Text>
            </Text>
            <Pressable
              onPress={() =>
                setHandlers(handlers.filter((_, idx) => idx !== i))
              }>
              <Text style={styles.deleteText}>✕</Text>
            </Pressable>
          </View>
        ))}
        {!handlers.length ? (
          <Text style={styles.emptyText}>No team invites yet.</Text>
        ) : null}
      </View>
    </View>
  </View>
);

const CouponsStep = ({
  coupons,
  setCoupons,
  couponDraft,
  setCouponDraft,
}) => (
  <View style={{gap: 16}}>
    <Text style={styles.helper}>Optional promo codes for this event.</Text>

    <View style={styles.row2}>
      <TextInput
        placeholder="CODE"
        placeholderTextColor="#7A7A85"
        value={couponDraft.code}
        onChangeText={v =>
          setCouponDraft({...couponDraft, code: v.toUpperCase()})
        }
        style={[styles.input, {flex: 1}]}
        autoCapitalize="characters"
      />
      <TextInput
        placeholder="10"
        placeholderTextColor="#7A7A85"
        value={couponDraft.discount_value}
        onChangeText={v =>
          setCouponDraft({...couponDraft, discount_value: v})
        }
        keyboardType="numeric"
        style={[styles.input, {width: 70}]}
      />
    </View>

    <View style={styles.chipsRow}>
      {['percentage', 'fixed'].map(t => (
        <Pressable
          key={t}
          onPress={() =>
            setCouponDraft({...couponDraft, discount_type: t})
          }
          style={[
            styles.chip,
            couponDraft.discount_type === t && styles.chipActive,
          ]}>
          <Text
            style={[
              styles.chipText,
              couponDraft.discount_type === t && styles.chipTextActive,
            ]}>
            {t === 'percentage' ? 'Percent' : 'Fixed'}
          </Text>
        </Pressable>
      ))}
    </View>

    <Pressable
      onPress={() => {
        if (!couponDraft.code.trim()) {
          return Alert.alert('Validation', 'Coupon code required.');
        }
        if (
          couponDraft.discount_type === 'percentage' &&
          Number(couponDraft.discount_value) > 100
        ) {
          return Alert.alert('Validation', 'Percentage cannot exceed 100.');
        }
        setCoupons([...coupons, {...couponDraft}]);
        setCouponDraft({
          code: '',
          discount_type: 'percentage',
          discount_value: '10',
        });
      }}
      style={styles.smallBtn}>
      <Text style={styles.smallBtnText}>Add Coupon</Text>
    </Pressable>

    <View style={styles.list}>
      {coupons.map((c, i) => (
        <View key={`${c.code}-${i}`} style={styles.listRow}>
          <Text style={styles.listText}>
            <Text style={{fontWeight: '900'}}>{c.code}</Text>{' '}
            <Text style={styles.listMuted}>
              ·{' '}
              {c.discount_type === 'percentage'
                ? `${c.discount_value}%`
                : money(c.discount_value)}
            </Text>
          </Text>
          <Pressable
            onPress={() => setCoupons(coupons.filter((_, idx) => idx !== i))}>
            <Text style={styles.deleteText}>✕</Text>
          </Pressable>
        </View>
      ))}
      {!coupons.length ? (
        <Text style={styles.emptyText}>No coupons — skip if you want.</Text>
      ) : null}
    </View>
  </View>
);

const ReviewStep = ({
  basics,
  tickets,
  capacity,
  minPrice,
  busy,
  onPublish,
}) => (
  <View style={{gap: 20}}>
    <View style={styles.reviewCard}>
      <Text style={styles.reviewKicker}>READY TO LAUNCH</Text>
      <Text style={styles.reviewTitle}>
        {basics.title || 'Untitled event'}
      </Text>
      <Text style={styles.reviewDescription}>
        {basics.description || 'No description yet.'}
      </Text>

      <View style={styles.reviewGrid}>
        <View>
          <Text style={styles.reviewLabel}>When</Text>
          <Text style={styles.reviewValue}>
            {formatWhen(basics.startsAt)}
          </Text>
        </View>
        <View>
          <Text style={styles.reviewLabel}>Where</Text>
          <Text style={styles.reviewValue}>
            {[basics.venue.name, basics.venue.city, basics.venue.country]
              .filter(Boolean)
              .join(', ') || '—'}
          </Text>
        </View>
        <View>
          <Text style={styles.reviewLabel}>Tickets</Text>
          <Text style={styles.reviewValue}>
            {tickets.length} tiers · {capacity || '∞'} capacity
          </Text>
        </View>
        <View>
          <Text style={styles.reviewLabel}>From</Text>
          <Text style={styles.reviewValue}>{money(minPrice)}</Text>
        </View>
      </View>
    </View>

    <View style={styles.row2}>
      <Pressable
        disabled={busy}
        onPress={() => onPublish('draft')}
        style={[styles.outlineBtn, busy && {opacity: 0.6}]}>
        <Text style={styles.outlineBtnText}>
          {busy ? 'Saving…' : 'Save Draft'}
        </Text>
      </Pressable>

      <Pressable
        disabled={busy}
        onPress={() => onPublish('review_pending')}
        style={[styles.primaryBtn, busy && {opacity: 0.6}]}>
        <Text style={styles.primaryBtnText}>
          {busy ? 'Submitting…' : 'Submit for Approval'}
        </Text>
      </Pressable>
    </View>
  </View>
);

/* =====================================================
   STYLES
===================================================== */

const INK = '#05050D';
const CARD = '#11121C';
const BORDER = '#363948';
const CORAL = '#E82BA7';
const TEXT = '#FFFFFF';
const MUTED = '#858899';

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: INK},
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: (StatusBar.currentHeight ?? 0) + 16,
    paddingBottom: 60,
  },
  center: {flex: 1, alignItems: 'center', justifyContent: 'center'},
  centerText: {color: MUTED, marginTop: 12},

  header: {marginBottom: 20},
  backBtn: {paddingVertical: 6, marginBottom: 12},
  backText: {color: MUTED, fontSize: 12, fontWeight: '800'},
  kicker: {color: CORAL, fontSize: 11, fontWeight: '900', letterSpacing: 2},
  title: {
    color: TEXT,
    fontSize: 30,
    fontWeight: '900',
    marginTop: 8,
    letterSpacing: -0.5,
  },
  subtitle: {color: MUTED, fontSize: 13, marginTop: 6, lineHeight: 19},
  stepBadge: {
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: BORDER,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    marginTop: 12,
  },
  stepBadgeText: {
    color: MUTED,
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1,
  },

  stepRowContent: {gap: 8, paddingVertical: 4, paddingRight: 20},
  stepItem: {
    minWidth: 130,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 14,
    padding: 12,
    backgroundColor: 'transparent',
  },
  stepItemActive: {backgroundColor: CORAL, borderColor: CORAL},
  stepItemDone: {backgroundColor: CARD},
  stepHeader: {flexDirection: 'row', alignItems: 'center', gap: 8},
  stepNum: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: BORDER,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumActive: {backgroundColor: '#FFFFFF'},
  stepNumDone: {backgroundColor: '#4ADE80'},
  stepNumText: {color: '#000', fontSize: 11, fontWeight: '900'},
  stepLabel: {
    color: MUTED,
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  stepLabelActive: {color: '#FFFFFF'},
  stepHint: {color: MUTED, fontSize: 10, marginTop: 6},
  stepHintActive: {color: 'rgba(255,255,255,0.8)'},

  preview: {
    marginTop: 20,
    backgroundColor: '#000',
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 20,
    overflow: 'hidden',
  },
  previewImageWrap: {aspectRatio: 4 / 3, position: 'relative'},
  previewImage: {width: '100%', height: '100%'},
  previewOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  previewBottom: {position: 'absolute', bottom: 0, left: 0, right: 0, padding: 16},
  previewCategory: {
    color: '#FFE600',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 2,
  },
  previewTitle: {
    color: '#FFFFFF',
    fontSize: 26,
    fontWeight: '900',
    marginTop: 6,
    letterSpacing: -0.5,
  },
  previewBody: {padding: 16},
  previewDescription: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 13,
    lineHeight: 19,
  },
  previewMeta: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    paddingVertical: 14,
    marginTop: 14,
    gap: 8,
  },
  previewMetaItem: {color: '#FFFFFF', fontSize: 13},
  previewCounts: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 12,
  },
  previewCount: {
    color: 'rgba(255,255,255,0.55)',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.6,
  },
  previewCountDot: {color: 'rgba(255,255,255,0.3)'},

  content: {marginTop: 24, gap: 18},

  field: {gap: 8},
  label: {
    color: MUTED,
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1.2,
  },
  input: {
    backgroundColor: CARD,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 52,
    color: TEXT,
    fontSize: 14,
  },
  inputMultiline: {
    height: 110,
    paddingTop: 14,
    textAlignVertical: 'top',
  },
  helper: {color: MUTED, fontSize: 11, lineHeight: 17},
  row2: {flexDirection: 'row', gap: 10},

  chipsRow: {flexDirection: 'row', flexWrap: 'wrap', gap: 8},
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: CARD,
  },
  chipActive: {backgroundColor: CORAL, borderColor: CORAL},
  chipText: {color: MUTED, fontSize: 12, fontWeight: '800'},
  chipTextActive: {color: '#FFFFFF'},

  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    backgroundColor: CARD,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: BORDER,
  },
  switchLabel: {color: TEXT, fontSize: 13, flex: 1},

  coverPreview: {
    width: '100%',
    aspectRatio: 16 / 9,
    borderRadius: 12,
    backgroundColor: CARD,
  },
  addBtn: {
    width: 52,
    height: 52,
    borderRadius: 12,
    backgroundColor: CORAL,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addBtnText: {color: '#FFFFFF', fontSize: 24, fontWeight: '900'},
  galleryGrid: {flexDirection: 'row', flexWrap: 'wrap', gap: 10},
  galleryItem: {
    width: '31%',
    aspectRatio: 1,
    position: 'relative',
    borderRadius: 10,
    overflow: 'hidden',
  },
  galleryImage: {width: '100%', height: '100%'},
  galleryDelete: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: 'rgba(0,0,0,0.7)',
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  galleryDeleteText: {color: '#FFFFFF', fontWeight: '900'},

  sectionTitle: {color: TEXT, fontSize: 24, fontWeight: '900'},
  ticketBox: {
    backgroundColor: CARD,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 14,
    padding: 14,
  },
  ticketBoxHeader: {flexDirection: 'row', alignItems: 'center', gap: 10},
  ticketBoxTitle: {color: TEXT, fontSize: 14, fontWeight: '900'},
  ticketBoxSub: {color: MUTED, fontSize: 11, marginTop: 3},
  ticketList: {marginTop: 14, gap: 8},
  ticketRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: BORDER,
  },
  ticketName: {color: TEXT, fontSize: 13, fontWeight: '700'},
  ticketPrice: {color: MUTED, fontSize: 12},

  primaryBtn: {
    backgroundColor: CORAL,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  primaryBtnText: {color: '#FFFFFF', fontSize: 12, fontWeight: '900', letterSpacing: 0.6},

  outlineBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: BORDER,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  outlineBtnText: {color: TEXT, fontSize: 12, fontWeight: '900', letterSpacing: 0.6},

  smallBtn: {
    backgroundColor: CARD,
    borderWidth: 1,
    borderColor: BORDER,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 8,
  },
  smallBtnText: {color: TEXT, fontSize: 12, fontWeight: '900', letterSpacing: 0.6},

  list: {
    marginTop: 12,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: BORDER,
  },
  listRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
  },
  listText: {color: TEXT, fontSize: 13, flex: 1},
  listMuted: {color: MUTED, fontSize: 12},
  deleteText: {color: CORAL, fontSize: 16, fontWeight: '900', paddingHorizontal: 8},
  emptyText: {color: MUTED, fontSize: 12, paddingVertical: 16, textAlign: 'center'},

  reviewCard: {
    backgroundColor: CARD,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 14,
    padding: 20,
  },
  reviewKicker: {
    color: CORAL,
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 2,
  },
  reviewTitle: {color: TEXT, fontSize: 26, fontWeight: '900', marginTop: 8},
  reviewDescription: {color: 'rgba(255,255,255,0.7)', fontSize: 13, marginTop: 12, lineHeight: 20},
  reviewGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 20,
    marginTop: 20,
  },
  reviewLabel: {color: MUTED, fontSize: 11, letterSpacing: 1},
  reviewValue: {color: TEXT, fontSize: 13, fontWeight: '800', marginTop: 4},

  navRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 30,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: BORDER,
  },
  navBack: {paddingVertical: 12},
  navBackText: {color: TEXT, fontSize: 13, fontWeight: '900'},
  navNext: {
    backgroundColor: CARD,
    borderWidth: 1,
    borderColor: BORDER,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
  },
  navNextText: {color: TEXT, fontSize: 12, fontWeight: '900', letterSpacing: 0.6},
  navHint: {color: MUTED, fontSize: 11, letterSpacing: 1},
});