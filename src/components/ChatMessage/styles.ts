import { StyleSheet } from 'react-native';

 export const styles = StyleSheet.create({
  messageContainer: {
    maxWidth: '80%', 
    padding: 10,
    borderRadius: 18,
    marginVertical: 4,
    marginHorizontal: 10,
    elevation: 1, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1.5,
  },
  userContainer: {
    backgroundColor: '#DCF8C6',
    borderBottomRightRadius: 2, 
  },
  botContainer: {
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 2,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  userText: {
    color: '#000',
    fontSize: 15,
  },
  botText: {
    color: '#000',
    fontSize: 15,
  },
  typingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    marginVertical: 4,
    marginHorizontal: 10,
    alignSelf: 'flex-start',
    backgroundColor: '#e0e0e0',
    borderRadius: 18,
    maxWidth: '50%',
  },
  typingText: {
    marginLeft: 8,
    color: '#444',
    fontStyle: 'italic',
    fontSize: 14,
  },
});