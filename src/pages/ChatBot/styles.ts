import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  fullScreen: {
    flex: 1, 
    backgroundColor: '#f5f5f5', 
  },
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  messageList: {
    paddingVertical: 10,
  },
  inputArea: {
    flexDirection: 'row',
    alignItems: 'flex-end', 
    padding: 8,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  input: {
    flex: 1,
    maxHeight: 120, 
    fontSize: 16,
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 25,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#eee',
    textAlignVertical: 'center', 
  },
  sendButton: {
    backgroundColor: '#1a237e',
    borderRadius: 25,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#b0b0b0',
    opacity: 0.6,
  },
  sendButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  }
});