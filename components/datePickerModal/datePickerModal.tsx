import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
} from 'react-native';
import { X } from 'lucide-react-native';
import { addDays, format, differenceInDays } from 'date-fns';
import CalendarPicker from 'react-native-calendar-picker';

interface DatePickerModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectDates: (dates: { startDate: string; endDate: string | null; totalDays: number }) => void;
  activeTab: string;
  tripType: string;
  initialDates: {
    startDate: string | null;
    endDate: string | null;
  };
}

export default function DatePickerModal({
  visible,
  onClose,
  onSelectDates,
  activeTab,
  tripType,
  initialDates,
}: DatePickerModalProps) {
  const today = new Date();
  const tomorrow = addDays(today, 1);

  const [startDate, setStartDate] = React.useState<Date>(
    initialDates?.startDate ? new Date(initialDates.startDate) : tomorrow
  );
  const [endDate, setEndDate] = React.useState<Date | null>(
    initialDates?.endDate ? new Date(initialDates.endDate) : null
  );

  const isEndDateRequired = () => {
    if (activeTab === 'Hotels' || activeTab === 'Places') {
      return true;
    }
    if (activeTab === 'Flights') {
      return tripType !== 'One Way';
    }
    return true;
  };

  const handleConfirm = () => {
    const formattedStartDate = format(startDate, 'MMM dd, yyyy');
    const formattedEndDate = endDate ? format(endDate, 'MMM dd, yyyy') : null;
    const totalDays = endDate ? differenceInDays(endDate, startDate) + 1 : 1;

    onSelectDates({
      startDate: formattedStartDate,
      endDate: formattedEndDate,
      totalDays,
    });
    onClose();
  };

  const handleDateChange = (date: Date, type?: 'START_DATE' | 'END_DATE') => {
    if (type === 'START_DATE') {
      setStartDate(date);
    } else if (type === 'END_DATE') {
      setEndDate(date);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.title}>When will your adventure begin and end? 🗓️</Text>
            <Pressable onPress={onClose} style={styles.closeButton}>
              <X size={24} color="#000" />
            </Pressable>
          </View>

          <ScrollView style={styles.scrollView}>
            <View style={styles.dateSelectionContainer}>
              <Text className="text-neutral-500 text-lg">Choose the dates for your trip. This helps us plan the perfect itinerary for your travel period.</Text>
              <View className='pb-6'>
                <CalendarPicker
                  selectedStartDate={startDate}
                  selectedEndDate={endDate || undefined}
                  restrictMonthNavigation={true}
                  onDateChange={(date, type) => handleDateChange(date, type)}
                  allowRangeSelection={activeTab !== 'Flights' || tripType === 'Round Trip'}
                  minDate={tomorrow}
                  maxRangeDuration={(activeTab === 'Flights' ? 9 : undefined) || (activeTab === 'Places' ? 13 : undefined)}
                  selectedRangeStyle={{
                    backgroundColor: 'black'
                  }}
                  selectedDayTextStyle={{ color: 'white' }}
                />
              </View>
            </View>

            <Pressable
              style={[
                styles.confirmButton,
                (!endDate && isEndDateRequired()) && styles.confirmButtonDisabled,
              ]}
              onPress={handleConfirm}
              disabled={!endDate && isEndDateRequired()}
            >
              <Text style={styles.confirmButtonText}>Confirm Dates</Text>
            </Pressable>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    minHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    width: '80%',
    fontSize: 20,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 8,
  },
  scrollView: {
    padding: 20,
  },
  dateSelectionContainer: {
    gap: 16,
    marginBottom: 20,
  },
  confirmButton: {
    backgroundColor: 'black',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  confirmButtonDisabled: {
    backgroundColor: '#ccc',
  },
  confirmButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});