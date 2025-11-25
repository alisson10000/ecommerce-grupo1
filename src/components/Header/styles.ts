import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    paddingTop: 50,
    elevation: 2,
  },
  backButton: {
    marginRight: 10,
  },
  backText: {
    fontSize: 16,
    fontWeight: '600',
  },
  title: {
    flex: 1,
    fontSize: 20,
    fontWeight: 'bold',
  },
  themeButton: {
    padding: 8,
  },
  themeIcon: {
    fontSize: 20,
  },
});