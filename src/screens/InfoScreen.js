import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView, Dimensions, TouchableOpacity, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Header from '../components/layout/Header';

const { width } = Dimensions.get('window');

const InfoSection = ({ number, icon, image, title, description }) => (
  <View style={styles.sectionContainer}>
    <View style={styles.numberBadge}>
      <Text style={styles.numberText}>{number}</Text>
    </View>
    <View style={styles.dottedLine} />
    <View style={styles.iconContainer}>
      <Ionicons name={icon} size={40} color="#2B594D" />
    </View>
    <Image
      source={image}
      style={styles.sectionImage}
      resizeMode="cover"
    />
    <Text style={styles.sectionTitle}>{title}</Text>
    <Text style={styles.sectionDescription}>{description}</Text>
  </View>
);

const InfoScreen = ({ navigation }) => {
  const handleLinkPress = async (url) => {
    try {
      await Linking.openURL(url);
    } catch (error) {
      console.error('Помилка при відкритті посилання:', error);
    }
  };

  const sections = [
    {
      icon: 'time-outline',
      image: require('../assets/images/greenhouse-info.jpg'),
      title: 'Графік роботи',
      description: 'У травні – серпні: 8:30 - 21:00\nУ вересні – квітні: 8:30 - до сутінок\nОранжерейний комплекс: 11:00 - 17:00'
    },
    {
      icon: 'cash-outline',
      image: require('../assets/images/usd-info.jpg'),
      title: 'Вартість квитків',
      description: 'Дорослі та студенти: 100 грн\nДіти шкільного віку: 50 грн\nДіти до 6 років та пільгові категорії: безкоштовно'
    },
    {
      icon: 'location-outline',
      image: require('../assets/images/leaves-info.jpg'),
      title: 'Як дістатися',
      description: 'Адреса: вул. Садово-Ботанічна, 1\nВід метро "Печерська" автобусом №62 та тролейбусом №14 до кінцевої зупинки "Ботанічний сад"'
    }
  ];

  return (
    <View style={styles.container}>
      <Header 
        title="Інформація" 
        onBack={() => navigation.goBack()} 
      />
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.mainTitle}>
          Умови та графік роботи Ботанічного саду ім. М.М. Гришка
        </Text>
        {sections.map((section, index) => (
          <InfoSection
            key={index}
            number={index + 1}
            {...section}
          />
        ))}
        <TouchableOpacity 
          style={styles.linkContainer}
          onPress={() => handleLinkPress('http://www.nbg.kiev.ua')}
        >
          <Ionicons name="globe-outline" size={24} color="#2196F3" />
          <Text style={styles.linkText}>Відвідати наш сайт</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 20,
    paddingBottom: 40,
  },
  mainTitle: {
    fontSize: 28,
    fontWeight: 'bold', 
    textAlign: 'center',
    color: '#2B594D',
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 30,
  },
  sectionContainer: {
    padding: 20,
    marginBottom: 20,
    alignItems: 'center',
  },
  numberBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#2B594D',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  numberText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  dottedLine: {
    height: 40,
    width: 2,
    backgroundColor: '#2B594D',
    marginVertical: 10,
  },
  iconContainer: {
    marginBottom: 20,
  },
  sectionImage: {
    width: width - 40,
    height: 200,
    borderRadius: 12,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    lineHeight: 24,
  },
  linkContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    marginTop: 8,
    marginBottom: 8,
  },
  linkText: {
    fontSize: 18,
    color: '#2196F3',
    marginLeft: 8,
    textDecorationLine: 'underline',
  },
});

export default InfoScreen;