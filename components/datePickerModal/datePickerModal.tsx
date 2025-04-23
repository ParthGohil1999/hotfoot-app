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
  onSelectDates: (dates: { startDate: any; endDate: any | null; totalDays: number }) => void;
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
  const [startDate, setStartDate] = React.useState<Date>(
    initialDates?.startDate ? new Date(initialDates.startDate) : new Date()
  );
  const [endDate, setEndDate] = React.useState<Date | null>(
    initialDates?.endDate ? new Date(initialDates.endDate) : null
  );

  const isEndDateRequired = () => {
    if (activeTab === 'Flights') {
      return tripType !== 'One Way';
    }
    return activeTab === 'Hotels';
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

  // const minEndDate = addDays(startDate, 1);

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
                  allowRangeSelection={tripType === 'Round Trip' ? true : false}
                  minDate={new Date()}
                  maxRangeDuration={7}
                  selectedRangeStyle={{
                    backgroundColor: '#32B37D'
                  }}
                  selectedDayTextStyle={{ color: 'white' }}
                />
              </View>
              {/* <Pressable
                style={[
                  styles.dateField,
                  activeField === 'start' && styles.activeDateField,
                ]}
                onPress={() => {
                  setActiveField('start')
                  setShowDatePicker(true)
                }
                }
              >
                <Text style={styles.dateLabel}>Start Date</Text>
                <View style={styles.dateValueContainer}>
                  <Calendar size={20} color="#666" />
                  <Text style={styles.dateValue}>
                    {format(startDate, 'MMM dd, yyyy')}
                  </Text>
                </View>
              </Pressable> */}

              {/* {(isEndDateRequired() || activeTab !== 'Flights') && (
                <Pressable
                  style={[
                    styles.dateField,
                    activeField === 'end' && styles.activeDateField,
                  ]}
                  onPress={() => {
                    setActiveField('end')
                    setShowDatePicker(true)
                  }
                  }
                >
                  <Text style={styles.dateLabel}>End Date</Text>
                  <View style={styles.dateValueContainer}>
                    <Calendar size={20} color="#666" />
                    <Text style={styles.dateValue}>
                      {endDate ? format(endDate, 'MMM dd, yyyy') : 'Select date'}
                    </Text>
                  </View>
                </Pressable>
              )} */}
            </View>

            {/* {Platform.OS !== 'web' && (
              <DateTimePicker
                value={activeField === 'start' ? startDate : endDate || new Date()}
                onChange={handleDateChange}
                minimumDate={activeField === 'end' ? minEndDate : new Date()}
                mode="date"
              />
            )} */}

            {/* {Platform.OS === 'web' && (
              <input
                type="date"
                value={format(activeField === 'start' ? startDate : endDate || new Date(), 'yyyy-MM-dd')}
                onChange={(e) => {
                  const date = new Date(e.target.value);
                  handleDateChange(null, date);
                }}
                min={activeField === 'end'
                  ? format(minEndDate, 'yyyy-MM-dd')
                  : format(new Date(), 'yyyy-MM-dd')}
                style={styles.webDateInput}
              />
            )} */}

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
  dateField: {
    backgroundColor: '#f1f1f1',
    padding: 16,
    borderRadius: 12,
  },
  activeDateField: {
    backgroundColor: '#e0e0e0',
  },
  dateLabel: {
    color: '#666',
    fontSize: 12,
    marginBottom: 4,
  },
  dateValue: {
    color: 'black',
    fontSize: 16,
    fontWeight: '500',
  },
  dateValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
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
  webDateInput: {
    width: '100%',
    padding: 12,
    marginTop: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    fontSize: 16,
  },
});