import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { db } from '../../firebase';  // Import Firestore từ file cấu hình firebase.js
import { collection, getDocs, DocumentData, QueryDocumentSnapshot } from 'firebase/firestore';  // Import Firebase Firestore methods

interface ClassData {
  id: string;
  class_ID: string;
  class_ID_requirement: string;
  class_name: string;
}

const ClassList = () => {
  const [classes, setClasses] = useState<ClassData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const classCollection = collection(db, 'classes');
        const classSnapshot = await getDocs(classCollection);
        const classList = classSnapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => {
          const data = doc.data() as Omit<ClassData, 'id'>; // Không bao gồm id trong dữ liệu lấy từ doc.data()
          return {
            id: doc.id, // Sử dụng doc.id làm id
            ...data,    // Spread các trường còn lại từ doc.data()
          };
        });
        setClasses(classList);
      } catch (error) {
        console.error('Error fetching classes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchClasses();
  }, []);

  if (loading) {
    return <Text>Loading...</Text>;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={classes}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.classID}>Class ID: {item.class_ID}</Text>
            <Text style={styles.classIDRequirement}>Class ID Requirement: {item.class_ID_requirement}</Text>
            <Text style={styles.className}>Class Name: {item.class_name}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  item: {
    padding: 15,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  classID: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  classIDRequirement: {
    fontSize: 16,
    color: '#555',
  },
  className: {
    fontSize: 14,
    color: '#777',
  },
});

export default ClassList;
