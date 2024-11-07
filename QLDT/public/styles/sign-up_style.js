import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#b71c1c',
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 20,
    },
    logo: {
      width: 170,
      height: 170,
      marginBottom: 20,
      resizeMode: 'contain',
    },
    title: {
      fontSize: 24,
      color: 'white',
      marginBottom: 20,
    },
    form: {
      width: '100%',
    },
    input: {
      backgroundColor: 'white',
      padding: 12,
      borderRadius: 5,
      marginBottom: 10,
      fontSize: 16,
    },
    nameContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    halfInput: {
      width: '48%',
    },
    button: {
      backgroundColor: '#fff',
      padding: 15,
      borderRadius: 30,
      alignItems: 'center',
      marginVertical: 10,
    },
    buttonText: {
      color: '#b71c1c',
      fontSize: 18,
      fontWeight: 'bold',
    },
    loginText: {
      color: 'white',
      fontSize: 14,
      textAlign: 'center',
      marginTop: 10,
      textDecorationLine: 'underline',
    },
    errorText: {
      color: 'red',
      fontSize: 12,
      marginBottom: 10,
    },
    errorInput: {
      borderColor: 'red',
      borderWidth: 1,
    },
    centeredLinksContainer: {
      alignItems: 'center',
      marginTop: 10, 
    },
    linkSpacing: {
      marginVertical: 10, 
    },
    label: {
      fontSize: 16,
      marginBottom: 5,
      color: '#333', // Màu chữ nhãn nếu cần
    },
    largeInput: {
      height: 50, // Tăng chiều cao của ô nhập
      paddingHorizontal: 10,
      fontSize: 16,
    },
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
      width: 300,
      padding: 20,
      backgroundColor: 'white',
      borderRadius: 10,
      alignItems: 'center',
    },
    closeButton: {
      marginTop: 10,
      paddingVertical: 10,
      paddingHorizontal: 20,
      backgroundColor: 'green',
      borderRadius: 5,
    },
    input2: {
      width: '100%',
      paddingVertical: 12,
      paddingHorizontal: 15,
      marginVertical: 10,
      borderRadius: 5,
      borderWidth: 1,
      borderColor: '#ccc',
      backgroundColor: '#fff',
    },
    
    
  });
  
  export default styles;
