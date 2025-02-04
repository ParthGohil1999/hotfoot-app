import { View, Text, SafeAreaView, StyleSheet, Image } from 'react-native'
import React from 'react'
import { useNavigation } from 'expo-router';
import BottomBarContinueBtn from '../../components/buttons/bottomBarContinueBtn';
import TopBar from '../../components/topBar';

const AllSet = () => {

    const navigation = useNavigation()
    const handleDone = () => {
        navigation.navigate('(tabs)', { screen: 'home' });
        // navigation.navigate('preferences/travelPreferences')
    }


    return (
        <SafeAreaView style={{ backgroundColor: 'white', flex: 1, }} >
            <TopBar backarrow progress={1} />
            <View style={styles.container}>
                <View style={styles.imageContainer}>
                    <View>
                        <Image style={styles.image} source={require('../../assets/images/allset-icon.png')} />
                    </View>
                </View>
                <Text style={styles.title}>You're all set!</Text>
                <Text style={styles.subtitle}>
                    Congratulations! You are now part of Hotfoot community. Your personalized travel experience awaits.
                </Text>
            </View>
            <BottomBarContinueBtn handleDone={handleDone} />

        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center', // Centers vertically
        alignItems: 'center',
        backgroundColor: 'white',
        padding: 35
    },

    subtitle: {
        fontSize: 15,
        color: 'black',
        fontWeight: 350,
        lineHeight: 20,
        marginVertical: 25,
        textAlign: "center"
    },

    title: {
        fontSize: 30,
        color: 'black',
        fontWeight: 700,
        marginTop: 20,
    },

    image: {
        height: 150,
        width: 150,
        marginBottom: 15,
        borderRadius: 100,
        // borderWidth:2,
        borderColor: '#f1f1f1',
        // padding:20
    },
})

export default AllSet