import { View, Text, SafeAreaView, StyleSheet, TouchableOpacity, ScrollView, Button, TextInput, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useNavigation } from 'expo-router';
import { useForm, Controller } from "react-hook-form";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import CountryPickerComponent from '../../components/countryPicker';
import TopBar from '../../components/topBar';
import BottomBarContinueBtn from '../../components/buttons/bottomBarContinueBtn';
import TitleSubtitle from '../../components/titleSubtitle';



const PersonalTouch = () => {

    const [countryCode, setCountryCode] = useState('');
    const [country, setCountry] = useState(null);



    const handleCountrySelect = (selectedCountry) => {
        setCountryCode(selectedCountry?.cca2);
        setCountry(selectedCountry);


    };

    const navigation = useNavigation()
    const handleDone = () => {
        navigation.navigate('preferences/allSet')
    }

    const { control, handleSubmit, formState: { errors }, register } = useForm({
        defaultValues: {
            firstName: '',
            lastName: ''
        }
    });
    const onSubmit = data => console.log(data);


    return (
        <SafeAreaView style={{ backgroundColor: 'white', flex: 1, }} >
            <TopBar backarrow progress={0.7} />
            <ScrollView className="flex container px-7">
                <TitleSubtitle title={'Add a personal touch'} subtitle={"To enhance your travel journey, we'd love to know more about you."} />
                <View className="container">
                    <View style={styles.imageContainer}>
                        <View>
                            <Image style={[styles.image, {
                                padding: 20
                            }]} source={require('../../assets/images/icon.png')} />
                            <Image style={styles.imageEditIcon} source={require('../../assets/images/edit-icon.png')} />
                        </View>
                    </View>
                    <Text style={styles.label}>First Name</Text>
                    <View>
                        <Controller
                            control={control}
                            rules={{
                                required: true,
                            }}
                            render={({ field: { onChange, onBlur, value } }) => (
                                <TextInput
                                    onBlur={onBlur}
                                    onChangeText={onChange}
                                    value={value}
                                    style={styles.input}
                                />

                            )}
                            name="firstName"
                        />
                    </View>
                    {errors.firstName && <Text style={styles.error}>This is required.</Text>}
                    <Text style={styles.label}>Email</Text>
                    <View>
                        <MaterialIcons name="alternate-email" size={16} color="#8f8f8f" style={{ position: "absolute", left: 15, bottom: 37, zIndex: 1 }} />
                        <Controller
                            control={control}
                            rules={{
                                maxLength: 100,
                            }}
                            render={({ field: { onChange, onBlur, value } }) => (
                                <TextInput
                                    onBlur={onBlur}
                                    onChangeText={onChange}
                                    value={value}
                                    style={styles.input}
                                    className="px-10"
                                />
                            )}
                            name="email"
                        />
                    </View>
                    <Text style={styles.label}>Nationality</Text>
                    <View>
                        <Controller
                            control={control}
                            render={({ field: { onChange, onBlur, value } }) => (
                                <View style={[styles.input]} >
                                    <CountryPickerComponent
                                        onSelect={handleCountrySelect}
                                        value={value}
                                        onBlur={onBlur}
                                        onChangeText={onChange}
                                    />
                                </View>
                            )}
                            name="country"
                        />
                    </View>
                    {countryCode && <View style={[{ flexDirection: 'row', alignItems: "center", width:'100%' }]}>
                        <Controller
                            control={control}
                            render={({ field: { onChange, onBlur, value } }) => (
                                <View  >
                                    <TextInput style={[styles.input, { flex: 1, width: "85" }]} onBlur={onBlur}
                                        onChangeText={onChange}
                                        value={value}>+{country?.callingCode}</TextInput>
                                </View>
                            )}
                            name="countryCallingCode"
                        />
                        <Controller
                            control={control}
                            render={({ field: { onChange, onBlur, value } }) => (
                                <View style={[ { flex: 2, width: "100%", marginLeft: 5 }]}>

                                    <TextInput style={styles.input} onBlur={onBlur}
                                        onChangeText={onChange}
                                        value={value} ></TextInput>
                                </View>
                            )}
                            name="phoneNumber"
                        />
                    </View>}


                    {/* <Button title="Submit" onPress={handleSubmit(onSubmit)} /> */}
                </View>
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
    },

    imageContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",

    },
    imageEditIcon: {
        position: "absolute",
        height: 25,
        width: 25,
        right: 20,
        bottom: 35,
        borderRadius: 100,

    },
    image: {
        height: 150,
        width: 150,
        marginBottom: 15,
        borderRadius: 100,
        // borderWidth:2,
        borderColor: '#f1f1f1',
        // padding: 20
    },
    input: {
        justifyContent: "center",
        // backgroundColor: '#f9f9f9',
        borderColor: '#f1f1f1', // Light gray background
        borderWidth: 1,
        borderRadius: 15, // Rounded corners
        paddingHorizontal: 17,
        marginBottom: 20,
        fontSize: 15,
        fontWeight: 500,
        height: 50,
    },
    label: {
        fontSize: 13,
        marginBottom: 5,
        color: 'black', // Adjust the color as needed
    },
    error: {
        color: 'red',
        fontSize: 12,
    },
})

export default PersonalTouch