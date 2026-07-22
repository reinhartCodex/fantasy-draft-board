import React, { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  FlatList,
  Modal,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  useColorScheme,
  View,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import players from './Players.json';

const STORAGE_KEY = 'fantasy-draft-board-v1';
const POSITIONS = ['ALL', 'QB', 'RB', 'WR', 'TE', 'K', 'DST'];
const POSITION_COLORS = { QB: '#2563eb', RB: '#ea580c', WR: '#7c3aed', TE: '#0f766e', K: '#db2777', DST: '#64748b' };

export default function App() {
  const dark = useColorScheme() === 'dark';
  const theme = dark ? darkTheme : lightTheme;
  const [tab, setTab] = useState('board');
  const [position, setPosition] = useState('ALL');
  const [search, setSearch] = useState('');
  const [statuses, setStatuses] = useState({});
  const [favorites, setFavorites] = useState({});
  const [history, setHistory] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [draftSlot, setDraftSlot] = useState(1);
  const [showPickSelector, setShowPickSelector] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then(value => {
        if (value) {
          const saved = JSON.parse(value);
          setStatuses(saved.statuses || {});
          setFavorites(saved.favorites || {});
          setHistory(saved.history || []);
          setDraftSlot(saved.draftSlot || 1);
        }
      })
      .finally(() => setLoaded(true));
  }, []);

  useEffect(() => {
    if (loaded) AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({ statuses, favorites, history, draftSlot }));
  }, [statuses, favorites, history, draftSlot, loaded]);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return players.filter(player =>
      !statuses[player.rank] &&
      (position === 'ALL' || player.position === position) &&
      (!query || player.name.toLowerCase().includes(query) || player.team.toLowerCase().includes(query))
    );
  }, [position, search, statuses]);

  const myPlayers = useMemo(() => players.filter(player => statuses[player.rank] === 'mine'), [statuses]);
  const favoritePlayers = useMemo(() => players.filter(player => favorites[player.rank]), [favorites]);
  const selectedPlayers = useMemo(() => players.filter(player => statuses[player.rank]), [statuses]);
  const draftedCount = selectedPlayers.length;
  const currentOverallPick = draftedCount + 1;
  const nextDraftPick = getNextSnakePick(currentOverallPick, draftSlot);
  const picksAway = nextDraftPick.overall - currentOverallPick;
  const lineup = useMemo(() => buildLineup(myPlayers), [myPlayers]);

  function setPlayerStatus(player, next) {
    const previous = statuses[player.rank] || null;
    if (previous === next) return;
    setHistory(items => [...items, { rank: player.rank, previous }]);
    setStatuses(current => {
      const updated = { ...current };
      if (next) updated[player.rank] = next;
      else delete updated[player.rank];
      return updated;
    });
  }

  function undo() {
    const action = history[history.length - 1];
    if (!action) return;
    setStatuses(current => {
      const updated = { ...current };
      if (action.previous) updated[action.rank] = action.previous;
      else delete updated[action.rank];
      return updated;
    });
    setHistory(items => items.slice(0, -1));
  }

  function toggleFavorite(player) {
    setFavorites(current => {
      const updated = { ...current };
      if (updated[player.rank]) delete updated[player.rank];
      else updated[player.rank] = true;
      return updated;
    });
  }

  function autoPickToMyTurn() {
    if (picksAway <= 0) return;
    const autoSelected = players.filter(player => !statuses[player.rank]).slice(0, picksAway);
    setStatuses(current => {
      const updated = { ...current };
      autoSelected.forEach(player => { updated[player.rank] = 'taken'; });
      return updated;
    });
    setHistory(items => [
      ...items,
      ...autoSelected.map(player => ({ rank: player.rank, previous: null })),
    ]);
  }

  function reset() {
    Alert.alert('Reset the entire draft?', 'All selections will be cleared.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Reset Draft', style: 'destructive', onPress: () => { setStatuses({}); setHistory([]); } },
    ]);
  }

  const row = ({ item }) => (
    <PlayerRow
      player={item}
      status={statuses[item.rank]}
      favorite={Boolean(favorites[item.rank])}
      theme={theme}
      onMine={() => setPlayerStatus(item, 'mine')}
      onTaken={() => setPlayerStatus(item, 'taken')}
      onRestore={() => setPlayerStatus(item, null)}
      onToggleFavorite={() => toggleFavorite(item)}
    />
  );

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
      <StatusBar barStyle={dark ? 'light-content' : 'dark-content'} />
      <View style={styles.header}>
        <View>
          <Text style={[styles.title, { color: theme.text }]}>{tab === 'board' ? 'Draft Board' : tab === 'roster' ? 'My Team' : tab === 'favorites' ? 'Favorites' : 'Selected'}</Text>
          <Text style={[styles.subtitle, { color: theme.secondary }]}>ESPN 2026 PPR Top 300</Text>
        </View>
        <View style={styles.headerActions}>
          <SmallButton label='↶' disabled={!history.length} onPress={undo} theme={theme} accessibilityLabel='Undo' />
          <SmallButton label='Reset' disabled={!Object.keys(statuses).length} onPress={reset} theme={theme} danger />
        </View>
      </View>

      {tab === 'board' ? (
        <>
          <View style={[styles.draftTracker, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <View style={styles.draftTrackerTop}>
              <View>
                <Text style={[styles.trackerLabel, { color: theme.secondary }]}>12-TEAM SNAKE DRAFT</Text>
                <Text style={[styles.trackerTitle, { color: theme.text }]}>Next pick #{nextDraftPick.overall}</Text>
                <Text style={[styles.trackerDetail, { color: theme.secondary }]}>Round {nextDraftPick.round} · Pick {nextDraftPick.roundPick}</Text>
              </View>
              <Pressable onPress={() => setShowPickSelector(true)} style={[styles.pickDropdown, { backgroundColor: theme.background, borderColor: theme.border }]}>
                <Text style={[styles.pickDropdownLabel, { color: theme.secondary }]}>YOUR SLOT</Text>
                <Text style={[styles.pickDropdownValue, { color: theme.text }]}>Pick {draftSlot} ▾</Text>
              </Pressable>
            </View>
            <View style={[styles.clockBanner, { backgroundColor: picksAway === 0 ? '#dcfce7' : '#e0e7ff' }]}>
              <Text style={{ color: picksAway === 0 ? '#15803d' : '#4338ca', fontWeight: '900' }}>
                {picksAway === 0 ? 'You are on the clock!' : `${picksAway} pick${picksAway === 1 ? '' : 's'} until your turn`}
              </Text>
              <Text style={{ color: picksAway === 0 ? '#15803d' : '#4338ca', fontWeight: '700' }}>{draftedCount} selected</Text>
            </View>
            <Pressable
              disabled={picksAway === 0}
              onPress={autoPickToMyTurn}
              style={[styles.autoPickButton, { backgroundColor: picksAway === 0 ? theme.background : '#4f46e5', borderColor: picksAway === 0 ? theme.border : '#4f46e5' }]}
            >
              <Text style={{ color: picksAway === 0 ? theme.secondary : '#ffffff', fontWeight: '900' }}>
                {picksAway === 0 ? 'Make your pick to continue' : `Auto-pick ${picksAway} player${picksAway === 1 ? '' : 's'} to my turn`}
              </Text>
            </Pressable>
          </View>
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder='Search player or team'
            placeholderTextColor={theme.secondary}
            style={[styles.search, { color: theme.text, backgroundColor: theme.card }]}
          />
          <View style={styles.filterArea}>
            <Text style={[styles.filterLabel, { color: theme.secondary }]}>FILTER BY POSITION</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filters}>
              {POSITIONS.map(pos => (
                <Pressable
                  key={pos}
                  onPress={() => setPosition(pos)}
                  style={[styles.filter, { backgroundColor: position === pos ? '#4f46e5' : theme.card, borderColor: position === pos ? '#4f46e5' : theme.border }]}
                >
                  <Text style={[styles.filterText, { color: position === pos ? '#ffffff' : theme.text }]}>{pos === 'DST' ? 'D/ST' : pos === 'ALL' ? 'ALL' : pos}</Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>
          <FlatList data={filtered} renderItem={row} keyExtractor={item => String(item.rank)} contentContainerStyle={styles.list} />
        </>
      ) : tab === 'roster' && myPlayers.length ? (
        <>
          <View style={[styles.summary, { backgroundColor: theme.card }]}>
            <Text style={{ color: theme.secondary, fontWeight: '700' }}>{myPlayers.length} players</Text>
            <Text style={{ color: theme.secondary, fontWeight: '700' }}>${myPlayers.reduce((sum, p) => sum + p.value, 0)} value</Text>
          </View>
          <FlatList
            data={lineup}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.list}
            renderItem={({ item }) => item.header ? (
              <Text style={[styles.lineupHeader, { color: theme.secondary }]}>{item.header}</Text>
            ) : item.player ? (
              <PlayerRow
                player={item.player}
                status='mine'
                favorite={Boolean(favorites[item.player.rank])}
                theme={theme}
                slotLabel={item.label}
                showCrossout={false}
                onMine={() => setPlayerStatus(item.player, 'mine')}
                onTaken={() => setPlayerStatus(item.player, 'taken')}
                onRestore={() => setPlayerStatus(item.player, null)}
                onToggleFavorite={() => toggleFavorite(item.player)}
              />
            ) : (
              <EmptyLineupSlot label={item.label} theme={theme} />
            )}
          />
        </>
      ) : tab === 'favorites' && favoritePlayers.length ? (
        <FlatList data={favoritePlayers} renderItem={row} keyExtractor={item => String(item.rank)} contentContainerStyle={styles.list} />
      ) : tab === 'selected' && selectedPlayers.length ? (
        <FlatList data={selectedPlayers} renderItem={row} keyExtractor={item => String(item.rank)} contentContainerStyle={styles.list} />
      ) : (
        <View style={styles.empty}>
          <Text style={styles.emptyIcon}>{tab === 'favorites' ? '☆' : tab === 'selected' ? '✓' : '🏈'}</Text>
          <Text style={[styles.emptyTitle, { color: theme.text }]}>{tab === 'favorites' ? 'No favorites yet' : tab === 'selected' ? 'No selections yet' : 'Your team is empty'}</Text>
          <Text style={[styles.emptyText, { color: theme.secondary }]}>{tab === 'favorites' ? 'Tap the star beside any player to add them here.' : tab === 'selected' ? 'Drafted players will appear here.' : 'Go to Draft Board and tap “My Team” on a player.'}</Text>
        </View>
      )}

      <View style={[styles.tabs, { backgroundColor: theme.card, borderTopColor: theme.border }]}>
        <TabButton active={tab === 'board'} icon='☷' label='Draft' onPress={() => setTab('board')} />
        <TabButton active={tab === 'roster'} icon='♟' label={`Team ${myPlayers.length}`} onPress={() => setTab('roster')} />
        <TabButton active={tab === 'favorites'} icon='★' label={`Stars ${favoritePlayers.length}`} onPress={() => setTab('favorites')} />
        <TabButton active={tab === 'selected'} icon='✓' label={`Selected ${selectedPlayers.length}`} onPress={() => setTab('selected')} />
      </View>

      <Modal visible={showPickSelector} transparent animationType='fade' onRequestClose={() => setShowPickSelector(false)}>
        <Pressable style={styles.modalBackdrop} onPress={() => setShowPickSelector(false)}>
          <Pressable style={[styles.pickModal, { backgroundColor: theme.card }]} onPress={() => {}}>
            <Text style={[styles.pickModalTitle, { color: theme.text }]}>Choose your draft position</Text>
            <Text style={[styles.pickModalSubtitle, { color: theme.secondary }]}>12-team snake draft</Text>
            <View style={styles.pickGrid}>
              {Array.from({ length: 12 }, (_, index) => index + 1).map(slot => (
                <Pressable
                  key={slot}
                  onPress={() => { setDraftSlot(slot); setShowPickSelector(false); }}
                  style={[styles.pickOption, { backgroundColor: draftSlot === slot ? '#4f46e5' : theme.background, borderColor: draftSlot === slot ? '#4f46e5' : theme.border }]}
                >
                  <Text style={{ color: draftSlot === slot ? '#ffffff' : theme.text, fontWeight: '900', fontSize: 17 }}>{slot}</Text>
                </Pressable>
              ))}
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

function buildLineup(selectedPlayers) {
  const pool = [...selectedPlayers];
  const take = eligible => {
    const index = pool.findIndex(player => eligible.includes(player.position));
    return index < 0 ? null : pool.splice(index, 1)[0];
  };
  const starters = [
    ['QB', ['QB']],
    ['RB', ['RB']],
    ['RB', ['RB']],
    ['WR', ['WR']],
    ['WR', ['WR']],
    ['WR', ['WR']],
    ['TE', ['TE']],
    ['FLEX', ['RB', 'WR', 'TE']],
    ['K', ['K']],
    ['D/ST', ['DST']],
  ].map(([label, eligible], index) => ({ id: `starter-${index}`, label, player: take(eligible) }));

  const bench = Array.from({ length: 6 }, (_, index) => ({
    id: `bench-${index}`,
    label: `BN ${index + 1}`,
    player: pool[index] || null,
  }));
  const overflow = pool.slice(6).map((player, index) => ({ id: `over-${player.rank}`, label: 'OVER', player }));

  return [
    { id: 'starters-header', header: 'STARTING LINEUP' },
    ...starters,
    { id: 'bench-header', header: 'BENCH · 6 SPOTS' },
    ...bench,
    ...(overflow.length ? [{ id: 'overflow-header', header: 'OVER ROSTER LIMIT' }, ...overflow] : []),
  ];
}

function getNextSnakePick(currentOverallPick, draftSlot) {
  let round = Math.floor((currentOverallPick - 1) / 12) + 1;
  while (true) {
    const overall = (round - 1) * 12 + (round % 2 === 1 ? draftSlot : 13 - draftSlot);
    if (overall >= currentOverallPick) {
      return { overall, round, roundPick: round % 2 === 1 ? draftSlot : 13 - draftSlot };
    }
    round += 1;
  }
}

function EmptyLineupSlot({ label, theme }) {
  return (
    <View style={[styles.emptySlot, { borderColor: theme.border, backgroundColor: theme.card }]}>
      <Text style={[styles.slotLabel, { color: theme.secondary }]}>{label}</Text>
      <Text style={[styles.emptySlotText, { color: theme.secondary }]}>Empty</Text>
    </View>
  );
}

function PlayerRow({ player, status, favorite, theme, slotLabel, showCrossout = true, onMine, onTaken, onRestore, onToggleFavorite }) {
  return (
    <View style={[styles.row, { backgroundColor: theme.card, borderColor: status === 'mine' ? '#22c55e' : theme.border, opacity: status === 'taken' ? 0.58 : 1 }]}>
      <Text style={[slotLabel ? styles.slotLabel : styles.rank, { color: theme.secondary }]}>{slotLabel || player.rank}</Text>
      <Pressable onPress={onToggleFavorite} hitSlop={8} style={styles.starButton} accessibilityLabel={favorite ? 'Remove favorite' : 'Add favorite'}>
        <Text style={[styles.star, { color: favorite ? '#f59e0b' : theme.secondary }]}>{favorite ? '★' : '☆'}</Text>
      </Pressable>
      <View style={styles.playerInfo}>
        <Text numberOfLines={1} style={[styles.name, { color: status && showCrossout ? theme.secondary : theme.text, textDecorationLine: status && showCrossout ? 'line-through' : 'none' }]}>{player.name}</Text>
        <View style={styles.metaRow}>
          <Text style={[styles.badge, { backgroundColor: POSITION_COLORS[player.position] }]}>{player.position === 'DST' ? 'D/ST' : player.position}</Text>
          <Text style={[styles.meta, { color: theme.secondary }]}>{player.team}  •  Bye {player.bye}  •  ${player.value}</Text>
        </View>
      </View>
      <View style={styles.rowActions}>
        {status ? (
          <>
            <Text style={[styles.selectionTag, { color: status === 'mine' ? '#15803d' : '#b91c1c' }]}>{status === 'mine' ? 'MY TEAM' : 'OTHER'}</Text>
            <Pressable onPress={onRestore} style={[styles.action, { backgroundColor: '#e0e7ff' }]}><Text style={{ color: '#4338ca', fontWeight: '800' }}>Undo</Text></Pressable>
          </>
        ) : (
          <>
            <Pressable onPress={onMine} style={[styles.action, { backgroundColor: '#dcfce7' }]}><Text style={{ color: '#15803d', fontWeight: '800' }}>Mine</Text></Pressable>
            <Pressable onPress={onTaken} style={[styles.action, { backgroundColor: '#fee2e2' }]}><Text style={{ color: '#b91c1c', fontWeight: '800' }}>Other</Text></Pressable>
          </>
        )}
      </View>
    </View>
  );
}

function SmallButton({ label, onPress, disabled, theme, danger }) {
  return <Pressable disabled={disabled} onPress={onPress} style={[styles.smallButton, { backgroundColor: theme.card, opacity: disabled ? 0.35 : 1 }]}><Text style={{ color: danger ? '#dc2626' : theme.text, fontWeight: '800' }}>{label}</Text></Pressable>;
}

function TabButton({ active, icon, label, onPress }) {
  return <Pressable onPress={onPress} style={styles.tabButton}><Text style={[styles.tabIcon, { color: active ? '#4f46e5' : '#64748b' }]}>{icon}</Text><Text numberOfLines={1} style={[styles.tabLabel, { color: active ? '#4f46e5' : '#64748b' }]}>{label}</Text></Pressable>;
}

const lightTheme = { background: '#f8fafc', card: '#ffffff', text: '#0f172a', secondary: '#64748b', border: '#e2e8f0' };
const darkTheme = { background: '#0f172a', card: '#1e293b', text: '#f8fafc', secondary: '#94a3b8', border: '#334155' };

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: { paddingHorizontal: 16, paddingTop: 10, paddingBottom: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  title: { fontSize: 29, fontWeight: '900', letterSpacing: -0.7 },
  subtitle: { fontSize: 12, marginTop: 2, fontWeight: '600' },
  headerActions: { flexDirection: 'row', gap: 7 },
  smallButton: { minHeight: 38, paddingHorizontal: 12, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
  search: { marginHorizontal: 16, paddingHorizontal: 14, height: 44, borderRadius: 13, fontSize: 16 },
  draftTracker: { marginHorizontal: 16, marginBottom: 10, borderWidth: 1, borderRadius: 16, padding: 13 },
  draftTrackerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  trackerLabel: { fontSize: 10, fontWeight: '900', letterSpacing: 0.8 },
  trackerTitle: { fontSize: 21, fontWeight: '900', marginTop: 3 },
  trackerDetail: { fontSize: 12, fontWeight: '700', marginTop: 2 },
  pickDropdown: { minWidth: 91, borderWidth: 1, borderRadius: 11, paddingHorizontal: 11, paddingVertical: 8 },
  pickDropdownLabel: { fontSize: 9, fontWeight: '900', letterSpacing: 0.5 },
  pickDropdownValue: { fontSize: 15, fontWeight: '900', marginTop: 2 },
  clockBanner: { marginTop: 11, borderRadius: 10, paddingHorizontal: 11, paddingVertical: 8, flexDirection: 'row', justifyContent: 'space-between' },
  autoPickButton: { marginTop: 8, minHeight: 42, borderWidth: 1, borderRadius: 11, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 10 },
  filterArea: { paddingTop: 10, paddingBottom: 8 },
  filterLabel: { paddingHorizontal: 16, marginBottom: 7, fontSize: 11, fontWeight: '900', letterSpacing: 0.8 },
  filters: { paddingHorizontal: 16, gap: 9 },
  filter: { minWidth: 52, minHeight: 40, paddingHorizontal: 15, borderRadius: 12, borderWidth: 1.5, alignItems: 'center', justifyContent: 'center' },
  filterText: { fontSize: 14, fontWeight: '900', letterSpacing: 0.3 },
  list: { paddingHorizontal: 12, paddingBottom: 16 },
  row: { minHeight: 72, borderRadius: 14, marginBottom: 8, padding: 10, borderWidth: 1, flexDirection: 'row', alignItems: 'center', gap: 9 },
  rank: { width: 38, textAlign: 'right', fontSize: 12, fontWeight: '800', fontVariant: ['tabular-nums'] },
  starButton: { width: 30, height: 40, alignItems: 'center', justifyContent: 'center' },
  star: { fontSize: 27, lineHeight: 31 },
  playerInfo: { flex: 1, minWidth: 0 },
  name: { fontWeight: '800', fontSize: 15 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 5 },
  badge: { color: 'white', fontWeight: '900', fontSize: 10, overflow: 'hidden', borderRadius: 8, paddingHorizontal: 6, paddingVertical: 3 },
  meta: { fontSize: 11, fontWeight: '600' },
  rowActions: { gap: 5 },
  selectionTag: { fontSize: 9, fontWeight: '900', textAlign: 'center' },
  action: { minWidth: 49, alignItems: 'center', paddingHorizontal: 8, paddingVertical: 7, borderRadius: 9 },
  summary: { marginHorizontal: 16, marginBottom: 8, padding: 14, borderRadius: 14, flexDirection: 'row', justifyContent: 'space-between' },
  sectionHeader: { paddingHorizontal: 5, paddingVertical: 8, flexDirection: 'row', justifyContent: 'space-between' },
  sectionTitle: { fontWeight: '900', fontSize: 17 },
  lineupHeader: { fontSize: 11, fontWeight: '900', letterSpacing: 0.9, marginTop: 8, marginBottom: 7, marginHorizontal: 4 },
  slotLabel: { width: 44, textAlign: 'center', fontSize: 11, fontWeight: '900' },
  emptySlot: { minHeight: 58, borderRadius: 14, marginBottom: 8, paddingHorizontal: 10, borderWidth: 1, borderStyle: 'dashed', flexDirection: 'row', alignItems: 'center', gap: 15 },
  emptySlotText: { fontSize: 14, fontWeight: '700' },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 36 },
  emptyIcon: { fontSize: 50, marginBottom: 10 },
  emptyTitle: { fontWeight: '900', fontSize: 22 },
  emptyText: { textAlign: 'center', marginTop: 8, lineHeight: 20 },
  tabs: { minHeight: 61, flexDirection: 'row', borderTopWidth: StyleSheet.hairlineWidth },
  tabButton: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 2 },
  tabIcon: { fontSize: 17, fontWeight: '900', lineHeight: 20 },
  tabLabel: { fontSize: 10, fontWeight: '900', marginTop: 2 },
  modalBackdrop: { flex: 1, backgroundColor: 'rgba(15,23,42,0.55)', alignItems: 'center', justifyContent: 'center', padding: 24 },
  pickModal: { width: '100%', maxWidth: 360, borderRadius: 20, padding: 20 },
  pickModalTitle: { fontSize: 21, fontWeight: '900', textAlign: 'center' },
  pickModalSubtitle: { fontSize: 13, fontWeight: '700', textAlign: 'center', marginTop: 4, marginBottom: 18 },
  pickGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, justifyContent: 'center' },
  pickOption: { width: 64, height: 48, borderWidth: 1.5, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
});
