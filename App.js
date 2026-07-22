import React, { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  FlatList,
  Pressable,
  SafeAreaView,
  ScrollView,
  SectionList,
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

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then(value => {
        if (value) {
          const saved = JSON.parse(value);
          setStatuses(saved.statuses || {});
          setFavorites(saved.favorites || {});
          setHistory(saved.history || []);
        }
      })
      .finally(() => setLoaded(true));
  }, []);

  useEffect(() => {
    if (loaded) AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({ statuses, favorites, history }));
  }, [statuses, favorites, history, loaded]);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return players.filter(player =>
      (position === 'ALL' || player.position === position) &&
      (!query || player.name.toLowerCase().includes(query) || player.team.toLowerCase().includes(query))
    );
  }, [position, search]);

  const myPlayers = useMemo(() => players.filter(player => statuses[player.rank] === 'mine'), [statuses]);
  const favoritePlayers = useMemo(() => players.filter(player => favorites[player.rank]), [favorites]);
  const rosterSections = useMemo(() =>
    POSITIONS.slice(1).map(pos => ({
      title: pos,
      data: myPlayers.filter(player => player.position === pos),
    })).filter(section => section.data.length), [myPlayers]);

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
          <Text style={[styles.title, { color: theme.text }]}>{tab === 'board' ? 'Draft Board' : tab === 'roster' ? 'My Team' : 'Favorites'}</Text>
          <Text style={[styles.subtitle, { color: theme.secondary }]}>ESPN 2026 PPR Top 300</Text>
        </View>
        <View style={styles.headerActions}>
          <SmallButton label='↶' disabled={!history.length} onPress={undo} theme={theme} accessibilityLabel='Undo' />
          <SmallButton label='Reset' disabled={!Object.keys(statuses).length} onPress={reset} theme={theme} danger />
        </View>
      </View>

      {tab === 'board' ? (
        <>
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
          <SectionList
            sections={rosterSections}
            renderItem={row}
            keyExtractor={item => String(item.rank)}
            contentContainerStyle={styles.list}
            renderSectionHeader={({ section }) => (
              <View style={[styles.sectionHeader, { backgroundColor: theme.background }]}>
                <Text style={[styles.sectionTitle, { color: theme.text }]}>{section.title === 'DST' ? 'D/ST' : section.title}</Text>
                <Text style={{ color: theme.secondary }}>{section.data.length}</Text>
              </View>
            )}
          />
        </>
      ) : tab === 'favorites' && favoritePlayers.length ? (
        <FlatList data={favoritePlayers} renderItem={row} keyExtractor={item => String(item.rank)} contentContainerStyle={styles.list} />
      ) : (
        <View style={styles.empty}>
          <Text style={styles.emptyIcon}>{tab === 'favorites' ? '☆' : '🏈'}</Text>
          <Text style={[styles.emptyTitle, { color: theme.text }]}>{tab === 'favorites' ? 'No favorites yet' : 'Your team is empty'}</Text>
          <Text style={[styles.emptyText, { color: theme.secondary }]}>{tab === 'favorites' ? 'Tap the star beside any player to add them here.' : 'Go to Draft Board and tap “My Team” on a player.'}</Text>
        </View>
      )}

      <View style={[styles.tabs, { backgroundColor: theme.card, borderTopColor: theme.border }]}>
        <TabButton active={tab === 'board'} label='☷  Draft Board' onPress={() => setTab('board')} />
        <TabButton active={tab === 'roster'} label={`♟  My Team (${myPlayers.length})`} onPress={() => setTab('roster')} />
        <TabButton active={tab === 'favorites'} label={`★  Favorites (${favoritePlayers.length})`} onPress={() => setTab('favorites')} />
      </View>
    </SafeAreaView>
  );
}

function PlayerRow({ player, status, favorite, theme, onMine, onTaken, onRestore, onToggleFavorite }) {
  return (
    <View style={[styles.row, { backgroundColor: theme.card, borderColor: status === 'mine' ? '#22c55e' : theme.border, opacity: status === 'taken' ? 0.58 : 1 }]}>
      <Text style={[styles.rank, { color: theme.secondary }]}>{player.rank}</Text>
      <Pressable onPress={onToggleFavorite} hitSlop={8} style={styles.starButton} accessibilityLabel={favorite ? 'Remove favorite' : 'Add favorite'}>
        <Text style={[styles.star, { color: favorite ? '#f59e0b' : theme.secondary }]}>{favorite ? '★' : '☆'}</Text>
      </Pressable>
      <View style={styles.playerInfo}>
        <Text numberOfLines={1} style={[styles.name, { color: status ? theme.secondary : theme.text, textDecorationLine: status ? 'line-through' : 'none' }]}>{player.name}</Text>
        <View style={styles.metaRow}>
          <Text style={[styles.badge, { backgroundColor: POSITION_COLORS[player.position] }]}>{player.position === 'DST' ? 'D/ST' : player.position}</Text>
          <Text style={[styles.meta, { color: theme.secondary }]}>{player.team}  •  Bye {player.bye}  •  ${player.value}</Text>
        </View>
      </View>
      <View style={styles.rowActions}>
        {status ? (
          <Pressable onPress={onRestore} style={[styles.action, { backgroundColor: '#e0e7ff' }]}><Text style={{ color: '#4338ca', fontWeight: '800' }}>Undo</Text></Pressable>
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

function TabButton({ active, label, onPress }) {
  return <Pressable onPress={onPress} style={styles.tabButton}><Text style={{ color: active ? '#4f46e5' : '#64748b', fontWeight: '800' }}>{label}</Text></Pressable>;
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
  filterArea: { paddingTop: 10, paddingBottom: 8 },
  filterLabel: { paddingHorizontal: 16, marginBottom: 7, fontSize: 11, fontWeight: '900', letterSpacing: 0.8 },
  filters: { paddingHorizontal: 16, gap: 9 },
  filter: { minWidth: 52, minHeight: 40, paddingHorizontal: 15, borderRadius: 12, borderWidth: 1.5, alignItems: 'center', justifyContent: 'center' },
  filterText: { fontSize: 14, fontWeight: '900', letterSpacing: 0.3 },
  list: { paddingHorizontal: 12, paddingBottom: 16 },
  row: { minHeight: 72, borderRadius: 14, marginBottom: 8, padding: 10, borderWidth: 1, flexDirection: 'row', alignItems: 'center', gap: 9 },
  rank: { width: 28, textAlign: 'right', fontWeight: '800', fontVariant: ['tabular-nums'] },
  starButton: { width: 30, height: 40, alignItems: 'center', justifyContent: 'center' },
  star: { fontSize: 27, lineHeight: 31 },
  playerInfo: { flex: 1, minWidth: 0 },
  name: { fontWeight: '800', fontSize: 15 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 5 },
  badge: { color: 'white', fontWeight: '900', fontSize: 10, overflow: 'hidden', borderRadius: 8, paddingHorizontal: 6, paddingVertical: 3 },
  meta: { fontSize: 11, fontWeight: '600' },
  rowActions: { gap: 5 },
  action: { minWidth: 49, alignItems: 'center', paddingHorizontal: 8, paddingVertical: 7, borderRadius: 9 },
  summary: { marginHorizontal: 16, marginBottom: 8, padding: 14, borderRadius: 14, flexDirection: 'row', justifyContent: 'space-between' },
  sectionHeader: { paddingHorizontal: 5, paddingVertical: 8, flexDirection: 'row', justifyContent: 'space-between' },
  sectionTitle: { fontWeight: '900', fontSize: 17 },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 36 },
  emptyIcon: { fontSize: 50, marginBottom: 10 },
  emptyTitle: { fontWeight: '900', fontSize: 22 },
  emptyText: { textAlign: 'center', marginTop: 8, lineHeight: 20 },
  tabs: { minHeight: 61, flexDirection: 'row', borderTopWidth: StyleSheet.hairlineWidth },
  tabButton: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 3 },
});
