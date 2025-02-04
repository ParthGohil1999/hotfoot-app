import { View, Text, StyleSheet } from 'react-native'
import React from 'react'

const TitleSubtitle = ({ title, subtitle }) => {
    return (
        <View>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.subtitle}>
                {subtitle}
            </Text>
        </View>
    )
}

const styles = StyleSheet.create({

    title: {
        fontSize: 30,
        color: 'black',
        fontWeight: 700,
        marginTop: 20,
    },

    subtitle: {
        fontSize: 15,
        color: 'black',
        fontWeight: 350,
        lineHeight: 20,
        marginVertical: 25
    },
})

export default TitleSubtitle