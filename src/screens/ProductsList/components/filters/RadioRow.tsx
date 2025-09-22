import { TouchableOpacity, View, Text, StyleSheet } from "react-native";
import { getCairoFont } from "../../../../ultis/getFont";


type ConditionValue = 'any' | 'new' | 'used';


const RadioRow = ({
    label,
    value,
    condition,
    setCondition
  }: {
    label: string;
    value: any;
    condition: ConditionValue
    setCondition: (value) => any
  }) => {
    const selected = condition === value;
    return (
      <TouchableOpacity
        onPress={() => setCondition(value)}
        style={styles.radioRow}
        activeOpacity={0.8}
      >
        <View style={[styles.radioOuter, selected && styles.radioOuterSelected]}>
          {selected && <View style={styles.radioInner} />}
        </View>
        <Text style={[styles.radioLabel, getCairoFont('600')]}>{label}</Text>
      </TouchableOpacity>
    );
  };

const styles = StyleSheet.create({
    radioRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
      },
      radioOuter: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#CBD5E1', // slate-300
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10,
      },
      radioOuterSelected: {
        borderColor: '#007bff',
      },
      radioInner: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#007bff',
      },
      radioLabel: {
        fontSize: 15,
        color: '#152032',
      },
})

export default RadioRow;