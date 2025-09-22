import { Pressable, Image, StyleSheet, Text, TouchableHighlight } from "react-native"
import { getCairoFont } from "../../../ultis/getFont"
import { t } from "i18next"
import { useNavigation } from "@react-navigation/native"

export const EmptyCart = () => {

    const nav: any = useNavigation()

    return (
        <Pressable style={styles.container} onPress={() => nav.navigate('Home')}>
            <Image style={styles.image} source={require('../../../assets/empty_cart_2.png')} />
            <TouchableHighlight style={styles.button}>
            <Text style={[styles.text, getCairoFont('700')]}>{t('contshop')}</Text>
            </TouchableHighlight>
            
        </Pressable>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FAFAFA',
        paddingBottom: 10
    },
    image: {
        width: 150,
        height: 150
    },
    text: {
        fontSize: 15,
        color: '#fff',
        letterSpacing: 2
    },
    button: {
        backgroundColor: 'black',
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 5,
        paddingBottom: 5,
        marginBottom: 10,
    }
})

export default EmptyCart