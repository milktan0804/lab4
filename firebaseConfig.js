import React, { useState, useEffect } from 'react';
import { View, Button, Text, FlatList } from 'react-native';
import { TextInput } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Appbar, List } from 'react-native-paper'; // Thêm import List từ react-native-paper
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getFirestore, collection, addDoc, onSnapshot } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyA9g8Lw6V0pM1uhOpx1A5ssmscEcPcUwCc",
    authDomain: "lab2-49723.firebaseapp.com",
    projectId: "lab2-49723",
    storageBucket: "lab2-49723.appspot.com",
    messagingSenderId: "177016461788",
    appId: "1:177016461788:web:401ac9cf8a7ba530e8d719",
    measurementId: "G-1JRX3M0P0E"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const firestore = getFirestore(app);

const App = () => {
  const [text, setText] = useState('');
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const todoCollection = collection(firestore, 'todos');
      const unsubscribe = onSnapshot(todoCollection, (querySnapshot) => {
        const dataArray = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data(); // Lấy dữ liệu của mục từ Firestore
          dataArray.push({ id: doc.id, ...data }); // Đưa vào mảng dữ liệu
        });
        setData(dataArray);
      });

      return unsubscribe;
    };

    const unsubscribe = fetchData();

    return () => {
      unsubscribe();
    };
  }, []);

  const handleAddData = async () => {
    if (text) {
      const todoCollection = collection(firestore, 'todos');
      await addDoc(todoCollection, { text, complete: false }); // Thêm thuộc tính complete với giá trị mặc định là false
      setText('');
    }
  };

  return (
    <SafeAreaProvider>
      <View style={{ flex: 1 }}>
        <Appbar.Header style={{ backgroundColor: '#444444' }}>
          <Appbar.Content title={'TODOs List'} color='FloralWhite' />
        </Appbar.Header>
        <FlatList
          style={{ flex: 1 }}
          data={data}
          renderItem={({ item }) => (
            <List.Item
              title={item.text}
              left={(props) => (
                <List.Icon
                  {...props}
                  icon={item.complete ? 'check' : 'cancel'}
                />
              )}
            />
          )}
          keyExtractor={(item, index) => index.toString()}
        />

        <TextInput
          placeholder={'New Todo'}
          value={text}
          onChangeText={(text) => setText(text)}
        />
        <Button title="Add TODO" onPress={handleAddData} />
      </View>
    </SafeAreaProvider>
  );
};

export default App;
