# Botanical Garden Mobile App

Mobile application for the Grishko Botanical Garden, which is located in the city of Kyiv.

This development is part of a master's thesis, and is not an official resource of the M. M. Grishko National Botanical Garden of the NAS of Ukraine.

The author of the mobile application is Anna Dembytska.

The application was developed on the Snack Expo platform using React Native.

#
Мобильное приложение-путеводитель по ботаническому саду. Интерактивный гид с картой, и экскурсионными маршрутами.

An interactive mobile tour guide app for a botanical garden, featuring real-time map navigation, and curated guided tours.

---

## Стек технологий / Tech Stack

Приложение разработано на базе кроссплатформенного фреймворка React Native с использованием экосистемы Expo.

*   Core: React 18 / React Native (0.76) / Expo (v52)
*   Navigation: React Navigation (Native Stack)
*   Maps & GPS: react-native-maps & expo-location
*   UI & Animations: react-native-reanimated, react-native-gesture-handler, expo-linear-gradient

---

## Основной функционал / Features

- Интерактивная карта: Отображение территории ботанического сада, ключевых локаций и оранжерей.
- Режим экскурсий (Tours): Выбор и прохождение тематических маршрутов с гидом (управление через `TourContext`).
- Информационный хаб: Экраны с подробным описанием редких видов растений и локаций.

---

## Экраны приложения / App Structure

Приложение использует модульную навигацию и состоит из следующих ключевых экранов (`SCREENS`):
1.  HomeScreen — Главный экран приложения: выбор туров и приветствие.
2.  TourScreen — Экран активной экскурсии: список точек, прогресс и подсказки.
3.  MapScreen — Интерактивная карта сада.
4.  InfoScreen — Детальная информация о растениях, правила сада и карточки объектов.
