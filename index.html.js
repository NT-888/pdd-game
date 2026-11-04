import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';

const questionsDB = [
  {
    id: 1,
    text: "Какое максимальное ограничение скорости установлено в РБ для лиц, передвигающихся на средствах персональной мобильности (СПМ)?",
    visualIcon: "⚡🛴",
    options: ["Не более 20 км/ч", "Не более 25 км/ч", "Не более 30 км/ч"],
    correctIndex: 1,
    explanation: "Согласно ПДД РБ, движение на средствах персональной мобильности (электросамокаты, гироскутеры, моноколеса) разрешено со скоростью не более 25 км/ч."
  },
  {
    id: 2,
    text: "Регулировщик обращен к вам лицом, его руки вытянуты в стороны или опущены. Какое движение вам разрешено?",
    visualIcon: "👮‍♂️",
    options: ["Движение запрещено строго", "Разрешено движение только прямо", "Разрешен поворот направо"],
    correctIndex: 0,
    explanation: "Если регулировщик расположен к вам грудью или спиной — это жест 'Стена', движение запрещено во всех направлениях (п. 35.1 ПДД РБ)."
  },
  {
    id: 3,
    text: "Включен красный сигнал светофора и дополнительная зеленая стрелка направо. Обязаны ли вы уступать дорогу ТС с других направлений?",
    visualIcon: "🚦➡️",
    options: ["Не обязаны, у нас горит зеленая стрелка", "Обязаны уступить дорогу ТС, движущимся с других направлений", "Преимущество определяется по помехе справа"],
    correctIndex: 1,
    explanation: "При движении в направлении стрелки, включенной одновременно с красным сигналом, водитель ОБЯЗАН уступить дорогу ТС, движущимся с других направлений (п. 39 ПДД РБ)."
  },
  {
    id: 4,
    text: "Вы въезжаете на нерегулируемый перекресток с круговым движением. Знаков приоритета нет. Кто имеет преимущество?",
    visualIcon: "🔄🚗",
    options: ["Водители, которые уже находятся на кольце", "Вы, так как являетесь помехой справа", "Тот, кто едет быстрее"],
    correctIndex: 0,
    explanation: "В РБ по умолчанию перекресток с круговым движением является главным. Въезжающий на кольцо обязан уступить дорогу (п. 109.2 ПДД РБ)."
  },
  {
    id: 5,
    text: "При какой неисправности тормозной системы водителю ЗАПРЕЩАЕТСЯ продолжать движение даже до места ремонта?",
    visualIcon: "🛑⚠️",
    options: ["Если рабочая тормозная система не позволяет остановить ТС при движении на минимальной скорости", "Если горит индикатор износа колодок", "Если увеличен ход педали"],
    correctIndex: 0,
    explanation: "Если тормоза полностью не работают и не могут остановить авто, дальнейшее движение строго запрещено (Приложение 4 ПДД РБ)."
  }
];

export default function App() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedIdx, setSelectedIdx] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [coins, setCoins] = useState(0);

  const currentQ = questionsDB[currentIdx];

  const handleAnswer = (index) => {
    if (isAnswered) return;
    setSelectedIdx(index);
    setIsAnswered(true);
    if (index === currentQ.correctIndex) {
      setCoins(prev => prev + 15);
    }
  };

  const handleNext = () => {
    if (currentIdx < questionsDB.length - 1) {
      setCurrentIdx(prev => prev + 1);
      setSelectedIdx(null);
      setIsAnswered(false);
    } else {
      alert("🏆 Сессия завершена!\nВы отлично потренировались.\nЗаработано: " + coins + " монет 🪙");
      setCurrentIdx(0);
      setSelectedIdx(null);
      setIsAnswered(false);
      setCoins(0);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🚦 ПДД Игра РБ 2026</Text>
        <Text style={styles.wallet}>🪙 {coins}</Text>
      </View>

      <Text style={styles.questionText}>{currentQ.text}</Text>

      {currentQ.visualIcon ? (
        <View style={styles.imageWrapper}>
          <Text style={styles.visualIconText}>{currentQ.visualIcon}</Text>
        </View>
      ) : null}

      {currentQ.options.map((opt, idx) => {
        let btnStyle = [styles.optionBtn];
        if (isAnswered) {
          if (idx === currentQ.correctIndex) btnStyle.push(styles.correct);
          else if (idx === selectedIdx) btnStyle.push(styles.wrong);
        }

        return (
          <TouchableOpacity key={idx} style={btnStyle} onPress={() => handleAnswer(idx)} disabled={isAnswered}>
            <Text style={styles.optionText}>{opt}</Text>
          </TouchableOpacity>
        );
      })}

      {isAnswered && (
        <View style={styles.explBox}>
          <Text style={styles.explText}>📖 {currentQ.explanation}</Text>
          <TouchableOpacity style={styles.nextBtn} onPress={handleNext}>
            <Text style={styles.nextBtnText}>Дальше ➡️</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F172A', padding: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 40, marginBottom: 20 },
  title: { color: '#FFF', fontSize: 20, fontWeight: 'bold' },
  wallet: { color: '#F59E0B', fontSize: 18, fontWeight: 'bold', backgroundColor: '#1E293B', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 15 },
  questionText: { color: '#F8FAFC', fontSize: 17, fontWeight: 'bold', marginBottom: 20, textAlign: 'center', lineHeight: 24 },
  imageWrapper: { backgroundColor: '#1E293B', padding: 10, borderRadius: 12, marginBottom: 20, alignItems: 'center', justifyContent: 'center', height: 100, width: 100, alignSelf: 'center', borderWidth: 1, borderColor: '#334155' },
  visualIconText: { fontSize: 45 },
  optionBtn: { backgroundColor: '#1E293B', padding: 16, borderRadius: 12, marginBottom: 12, borderWidth: 1, borderColor: '#334155' },
  optionText: { color: '#E2E8F0', fontSize: 15 },
  correct: { backgroundColor: '#16A34A', borderColor: '#22C55E' },
  wrong: { backgroundColor: '#DC2626', borderColor: '#EF4444' },
  explBox: { backgroundColor: '#1E293B', padding: 15, borderRadius: 12, marginTop: 10, marginBottom: 40, borderWidth: 1, borderColor: '#F59E0B' },
  explText: { color: '#CBD5E1', fontSize: 14, lineHeight: 20 },
  nextBtn: { backgroundColor: '#38BDF8', padding: 12, borderRadius: 10, marginTop: 15, alignItems: 'center' },
  nextBtnText: { color: '#0F172A', fontWeight: 'bold', fontSize: 16 }
});
