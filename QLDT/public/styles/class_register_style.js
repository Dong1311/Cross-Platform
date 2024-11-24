import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container1: {
    flex: 1,
    backgroundColor: '#fff',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333', // Màu chữ
  },
  
  container2: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  headerContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    marginBottom: 20,
    backgroundColor: '#b71c1c',
  },
  headerText: {
    fontSize: 24,
    color: '#ffff',
    textAlign: 'center',
    marginBottom: 10,
    marginTop: 50,
    fontWeight: 'bold',
  },
  subHeaderText: {
    fontSize: 16,
    color: '#ffff',
    textAlign: 'center',
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  input: {
    flex: 0.7,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 4,
    padding: 10,
  },
  registerButton: {
    backgroundColor: '#b30000',
    padding: 10,
    borderRadius: 4,
    // justifyContent: 'center',
    justifyContent: 'space-between',

    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
  },
  tableHeader: {
    flexDirection: 'row',
    // justifyContent: 'space-between',
    backgroundColor: '#b30000',
    padding: 10,
    borderRadius: 4,
  },
  tableHeaderText: {
    flex: 1,  // Đảm bảo các cột có chiều rộng linh hoạt
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#fff',
  },
  classRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
  },
  classRowText: {
    flex: 1,
    textAlign: 'center',
  },
  deleteButton: {
    color: '#ff4d4d',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  submitButton: {
    flex: 0.48,
    backgroundColor: '#b30000',
    paddingVertical: 10,
    borderRadius: 4,
    alignItems: 'center',
  },
  deleteButtonContainer: {
    flex: 0.48,
    backgroundColor: '#b30000',
    paddingVertical: 10,
    borderRadius: 4,
    alignItems: 'center',
  },
  linkText: {
    color: '#b30000',
    textAlign: 'center',
    marginTop: 20,
    textDecorationLine: 'underline',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '90%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
  },
  modalHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },

  selectedRow: {
    backgroundColor: '#e0e0e0', // Màu nền cho hàng đã chọn
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  paginationButton: {
    backgroundColor: '#b30000',
    padding: 10,
    borderRadius: 4,
    marginBottom:15,
  },
  paginationText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  backButton: {
    position: 'absolute',
    left: 10,
    top: 20,
    padding: 15, // Tăng padding để nút lớn hơn
    zIndex: 1,
  },
  backButtonText: {
    fontSize: 30, // Tăng kích thước chữ
    fontWeight: 'bold',
    color: '#fff',
  },
  modalTableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#b71c1c',
    paddingVertical: 10,
    paddingHorizontal: 5,
  },
  modalTableHeaderText: {
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    flex: 1,
    minWidth: 80, // Chiều rộng tối thiểu
  },

  // Hàng trong bảng Modal
  modalTableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  modalTableCell: {
    textAlign: 'center',
    flex: 1,
    minWidth: 80, // Cột có chiều rộng tối thiểu
  },

  modalColumn1: { flex: 1},
  modalColumn2: { flex: 1 }, 
  modalColumn3: { flex: 2}, 
  modalColumn4: { flex: 1}, 
  picker: {
    height: 50,
    width: 150,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginVertical: 10,
  },
  
});

export default styles;
