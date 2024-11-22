import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const AssignmentCard = ({item}) => {

  const days = ['Chủ nhật', 'Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ sáu', 'Thứ bảy'];
  const date = new Date(item.deadline)
  const vietnamOffset = 7 * 60 * 60 * 1000;
  const vietnamTime = new Date(date.getTime() + vietnamOffset);

  return (
    <View style={styles.container}>
      {/* Header with Date and Day */}
      <View style={styles.header}>
        <Text style={styles.dateText}>{`${date.getDate()} thg ${date.getMonth() + 1}`}</Text>
        <Text style={styles.dayText}>{days[date.getDay()] }</Text>
      </View>

      {/* Task Card */}
      <TouchableOpacity style={styles.card}>
        <View style={styles.iconContainer}>
          <Text style={styles.iconText}>{date.getDate()}</Text>
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.subText}>{`Đến hạn lúc ${vietnamTime.toLocaleTimeString().slice(0,5)}`}</Text>
          <Text style={styles.subText}>{`Lớp ${item.class_id}`}</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  header: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 10,
  },
  dateText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  dayText: {
    fontSize: 16,
    color: '#555',
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  iconContainer: {
    backgroundColor: '#D32F2F',
    borderRadius: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    justifyContent: 'center',
    alignItems: 'center',
    height: 40,
    width: 40,
    marginRight: 10,
  },
  iconText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 6,
  },
  subText: {
    fontSize: 14,
    color: '#555',
  },
});

export default AssignmentCard;
