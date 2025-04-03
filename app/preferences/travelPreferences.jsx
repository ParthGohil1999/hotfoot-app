import { Text, SafeAreaView, StyleSheet, ScrollView } from 'react-native'
import React, { useState } from 'react'
import ButtonMultiselect, {
    ButtonLayout,
} from 'react-native-button-multiselect';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { SelectActivityPreferencesReactNative } from '../../constants/options';
import TopBar from '../../components/topBar';
import BottomBarContinueBtn from '../../components/buttons/bottomBarContinueBtn';
import TitleSubtitle from '../../components/titleSubtitle';

const TravelPreferences = () => {
    const { navigateTo } = useLocalSearchParams()
    const navigation = useNavigation()
    const handleDone = () => {
        navigation.navigate(navigateTo)
    }

    // Set up state and handlers for selected buttons
    const [selectedButtons, setSelectedButtons] = useState([]);

    const handleButtonSelected = (selectedValues) => {
        setSelectedButtons(selectedValues);
    };


    return (
        <SafeAreaView style={{ backgroundColor: 'white', flex: 1, }} >
            <TopBar backarrow={false} progress={0.3} />
            <ScrollView style={{ paddingLeft: 25, paddingRight: 25 }}>
                <TitleSubtitle title={'Travel Preferences'} subtitle={"Tell us your travel preferences, and we'll tailor recommendations to your style. Don't worry, you can always change it later in the settings."} />
                <ButtonMultiselect
                    buttons={SelectActivityPreferencesReactNative}
                    layout={ButtonLayout.GRID}
                    onButtonSelected={handleButtonSelected}
                    selectedButtons={selectedButtons}
                    multiselect={true}
                />
            </ScrollView>
            <BottomBarContinueBtn handleDone={handleDone} />

        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center', // Centers vertically
        alignItems: 'center',
        backgroundColor: 'white'
    }
})

export default TravelPreferences