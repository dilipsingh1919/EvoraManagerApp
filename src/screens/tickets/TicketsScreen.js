import React, {useRef} from 'react';
import {
  Animated,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';

/* =====================================================
   COLORS
===================================================== */

const C = {
  bg: '#05050D',
  card: '#11121C',
  cardLite: '#191A26',
  borderLite: '#2A2C3A',
  coral: '#E82BA7',
  coralSoft: 'rgba(232,43,167,0.14)',
  text: '#FFFFFF',
  textMuted: '#8B8E9E',
  textDim: '#5F6275',
  yellow: '#FFE600',
};

/* =====================================================
   HELPERS
===================================================== */

const money = value => {
  const n = Number(value ?? 0);
  if (Number.isNaN(n)) return '₹0';
  return `₹${n.toLocaleString('en-IN')}`;
};

const formatTicketPrice = ticket => {
  const price = Number(ticket.price ?? 0);
  const type = String(ticket.ticketType || ticket.type || '').toLowerCase();
  if (type === 'complimentary' || price === 0) return 'Free';
  return money(price);
};

const formatQty = qty => {
  const n = Number(qty ?? 0);
  if (!n || n <= 0) return '∞ seats';
  return `${n} seats`;
};

const isSystemComplimentary = ticket => {
  const type = String(ticket.type || '').toLowerCase();
  const isSystem = ticket.is_system || ticket.system;
  return type === 'complimentary' && isSystem;
};

const isEditableTicket = ticket => {
  if (!ticket) return false;
  if (isSystemComplimentary(ticket)) return false;
  return true;
};

/* =====================================================
   TAP SCALE
===================================================== */

const TapScale = ({children, onPress, style, disabled, ...rest}) => {
  const scale = useRef(new Animated.Value(1)).current;

  const pressIn = () => {
    Animated.spring(scale, {
      toValue: 0.97,
      useNativeDriver: true,
      speed: 50,
      bounciness: 4,
    }).start();
  };

  const pressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 40,
      bounciness: 6,
    }).start();
  };

  return (
    <Animated.View style={[style, {transform: [{scale}]}]}>
      <Pressable
        onPress={onPress}
        onPressIn={pressIn}
        onPressOut={pressOut}
        disabled={disabled}
        {...rest}>
        {children}
      </Pressable>
    </Animated.View>
  );
};

/* =====================================================
   MAIN SCREEN
===================================================== */

export default function TicketsScreen({
  tickets = [],
  eventTitle = 'Event',
  onBack,
  onAdd,
  onEdit,
  onDelete,
  busy = false,
}) {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={C.bg} />

      <View style={styles.glowTop} />
      <View style={styles.glowBottom} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        {/* HEADER */}
        <View style={styles.header}>
          <View style={{flex: 1}}>
            <Pressable onPress={onBack} hitSlop={8} style={styles.backBtn}>
              <Text style={styles.backText}>← Event type</Text>
            </Pressable>

            <Text style={styles.kicker}>TICKETS</Text>

            <Text style={styles.title} numberOfLines={2}>
              {eventTitle}
            </Text>

            <Text style={styles.subtitle}>
              Add paid or free tiers. Door price unlocks gate sell later.
            </Text>
          </View>

          <TapScale
            onPress={onAdd}
            disabled={busy}
            style={[styles.addBtn, busy && {opacity: 0.6}]}>
            <Text style={styles.addBtnText}>+ Add</Text>
          </TapScale>
        </View>

        {/* TICKET LIST */}
        {tickets.length ? (
          <View style={styles.list}>
            {tickets.map((ticket, index) => {
              const locked = !isEditableTicket(ticket);
              const doorPrice = Number(
                ticket.doorPrice || ticket.door_price || 0,
              );
              const key = ticket._id || ticket.id || `${ticket.name}-${index}`;

              return (
                <View key={key} style={styles.listRow}>
                  <View style={{flex: 1, minWidth: 0}}>
                    <Text style={styles.ticketName} numberOfLines={1}>
                      {ticket.name}
                    </Text>

                    <View style={styles.metaRow}>
                      <Text style={styles.ticketMeta}>
                        {formatTicketPrice(ticket)}
                      </Text>
                      <Text style={styles.metaDot}>·</Text>
                      <Text style={styles.ticketMeta}>
                        {formatQty(ticket.quantity)}
                      </Text>

                      {doorPrice > 0 ? (
                        <>
                          <Text style={styles.metaDot}>·</Text>
                          <Text style={styles.ticketMeta}>
                            door {money(doorPrice)}
                          </Text>
                        </>
                      ) : null}

                      {isSystemComplimentary(ticket) ? (
                        <>
                          <Text style={styles.metaDot}>·</Text>
                          <Text style={styles.ticketMetaSystem}>system</Text>
                        </>
                      ) : null}
                    </View>
                  </View>

                  {locked ? (
                    <View style={styles.lockedBadge}>
                      <Text style={styles.lockedText}>LOCKED</Text>
                    </View>
                  ) : (
                    <View style={styles.actionGroup}>
                      <TapScale
                        onPress={() => onEdit(ticket)}
                        style={styles.iconBtn}
                        accessibilityLabel="Edit ticket">
                        <Text style={styles.iconBtnText}>✎</Text>
                      </TapScale>

                      <TapScale
                        onPress={() => onDelete(ticket)}
                        style={styles.iconBtn}
                        accessibilityLabel="Delete ticket">
                        <Text style={[styles.iconBtnText, {color: C.coral}]}>
                          🗑
                        </Text>
                      </TapScale>
                    </View>
                  )}
                </View>
              );
            })}
          </View>
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>🎟</Text>
            <Text style={styles.emptyTitle}>No tickets yet</Text>
            <Text style={styles.emptySub}>
              Tap "+ Add" to create your first tier.
            </Text>
          </View>
        )}

        <View style={{height: 40}} />
      </ScrollView>
    </View>
  );
}

/* =====================================================
   STYLES
===================================================== */

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: C.bg},

  glowTop: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: C.coral,
    opacity: 0.06,
    top: -150,
    right: -120,
  },
  glowBottom: {
    position: 'absolute',
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: '#8521F3',
    opacity: 0.05,
    bottom: -130,
    left: -100,
  },

  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: (StatusBar.currentHeight ?? 0) + 20,
    paddingBottom: 40,
  },

  /* HEADER */
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 14,
    marginBottom: 28,
  },
  backBtn: {
    alignSelf: 'flex-start',
    paddingVertical: 4,
    marginBottom: 18,
  },
  backText: {
    color: C.textMuted,
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  kicker: {
    color: C.coral,
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 2.4,
    marginBottom: 6,
  },
  title: {
    color: C.text,
    fontSize: 32,
    fontWeight: '900',
    letterSpacing: -0.6,
    lineHeight: 38,
  },
  subtitle: {
    color: C.textMuted,
    fontSize: 13,
    marginTop: 10,
    lineHeight: 19,
    paddingRight: 6,
  },
  addBtn: {
    backgroundColor: C.coral,
    paddingHorizontal: 18,
    paddingVertical: 13,
    borderRadius: 14,
    marginTop: 32,
    shadowColor: C.coral,
    shadowOpacity: 0.4,
    shadowRadius: 12,
    shadowOffset: {width: 0, height: 5},
    elevation: 5,
  },
  addBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 0.6,
  },

  /* LIST */
  list: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: C.borderLite,
  },
  listRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: C.borderLite,
  },
  ticketName: {
    color: C.text,
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 6,
  },
  ticketMeta: {color: C.textMuted, fontSize: 12},
  metaDot: {color: C.textDim, fontSize: 12},
  ticketMetaSystem: {
    color: C.yellow,
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 0.6,
  },

  /* ACTIONS */
  actionGroup: {flexDirection: 'row', gap: 8},
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: C.borderLite,
    backgroundColor: C.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBtnText: {color: C.text, fontSize: 15, fontWeight: '700'},

  lockedBadge: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: C.card,
    borderWidth: 1,
    borderColor: C.borderLite,
  },
  lockedText: {
    color: C.textDim,
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.2,
  },

  /* EMPTY STATE */
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: C.borderLite,
    borderRadius: 20,
  },
  emptyIcon: {fontSize: 40, marginBottom: 12},
  emptyTitle: {
    color: C.text,
    fontSize: 16,
    fontWeight: '900',
    marginBottom: 6,
  },
  emptySub: {
    color: C.textMuted,
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 19,
  },
});