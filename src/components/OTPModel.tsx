import React, { useEffect, useRef, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, TextInput,  Keyboard, Alert, } from "react-native";
import Modal from "react-native-modal";
import LoadingSpinner from "./Loading";

export default function OTPModal({ makeOTPVisible, setMakeOTPVisible }: any) {

    const length = 6;


    const [otp, setOtp] = useState(new Array(length).fill(''));
    const [loading, setLoading] = useState(false);
    const [cooldown, setCooldown] = useState(60);
    const inputs = useRef<any>([]);

    useEffect(() => {
        if (cooldown === 0) return;
    
        const timer = setInterval(() => {
          setCooldown((prev) => prev - 1);
        }, 1000);
    
        return () => clearInterval(timer);
      }, [cooldown]);
    
      const handleOtpFilled = async (code: string) => {
        setLoading(true);
        // const res = await verifyOTP({
        //     email,
        //     code
        // })
    
        if ('error' in res) {
          setLoading(false);
          Alert.alert('Error', res.message.error);
          return;
        }
      };
    
      const handleChange = (text: string, index: number) => {
        if (/[^0-9]/.test(text)) return;
      
        const newOtp = [...otp];
        newOtp[index] = text;
      
        // Move forward & clear next value if editing mid-sequence
        for (let i = index + 1; i < length; i++) {
          newOtp[i] = '';
        }
      
        setOtp(newOtp);
      
        // Focus next if not at end
        if (text !== '' && index < length - 1) {
          inputs.current[index + 1]?.focus();
        }
      
        // If completed again
        if (newOtp.every(char => char !== '')) {
          handleOtpFilled?.(newOtp.join(''));
          Keyboard.dismiss();
        }
      };
    
      const handleKeyPress = (e: any, index: number) => {
        if (e.nativeEvent.key === 'Backspace' && otp[index] === '' && index > 0) {
          inputs.current[index - 1]?.focus();
        }
      };
    
      const handleResend = async () => {
        setLoading(true);
        setOtp(new Array(length).fill(''));
        setCooldown(60);
        // await resendOTP(email);
        setLoading(false);
      };
    
  return (
    <Modal
      isVisible={makeOTPVisible}
      onBackdropPress={() => setMakeOTPVisible(false)}
      animationIn="slideInUp"
      animationOut="slideOutDown"
      style={{ margin: 0 }} // Important: removes default margin so it fills the screen
    >
      <View style={styles.fullScreen}>
      <View style={styles.wrapper}>

      <TouchableOpacity
            onPress={() => setMakeOTPVisible(false)}
            style={styles.closeButton}
          >
            <Text style={styles.closeButtonText}>×</Text>
            {/* Or use icon: <Ionicons name="close" size={30} color="black" /> */}
          </TouchableOpacity>


      {loading && <LoadingSpinner overlay /> }
      <Text style={styles.title}>Enter OTP</Text>
      <Text style={styles.subtitle}>A one time password has been sent to your email address ,Remember don't share this OTP with anyone!</Text>

      <View style={styles.container}>
        {otp.map((digit, index) => (
          <TextInput
            key={index}
            ref={(ref) => {
              inputs.current[index] = ref;
            }}
            onFocus={() => {
                const newOtp = [...otp];
                newOtp[index] = '';
                setOtp(newOtp);
            }}
            value={digit}
            onChangeText={(text) => handleChange(text, index)}
            onKeyPress={(e) => handleKeyPress(e, index)}
            style={styles.input}
            keyboardType="number-pad"
            maxLength={1}
            returnKeyType="done"
          />
        ))}
      </View>

      <View style={styles.resendWrapper}>
        {cooldown > 0 ? (
          <Text style={styles.cooldownText}>Resend in {cooldown}s</Text>
        ) : (
          <TouchableOpacity onPress={handleResend}>
            <Text style={styles.resendText}>Resend OTP</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  fullScreen: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    padding: 20,
  },
  confirmButton: {
    backgroundColor: "#007BFF",
    padding: 12,
    borderRadius: 8,
  },
  confirmText: { color: "#fff", textAlign: "center", fontWeight: "bold" },
  wrapper: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    textAlign: 'center',
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 4,
  },
  subtitle: {
    textAlign: 'center',
    fontSize: 14,
    color: '#555',
    marginBottom: 20,
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    marginBottom: 20,
  },
  input: {
    width: 48,
    height: 58,
    backgroundColor: '#f2f2f2',
    borderRadius: 12,
    textAlign: 'center',
    fontSize: 20,
    color: '#333',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  resendWrapper: {
    alignItems: 'center',
    marginTop: 10,
  },
  cooldownText: {
    color: '#999',
    fontSize: 14,
  },
  resendText: {
    color: '#007bff',
    fontSize: 14,
    fontWeight: '500',
  },
  closeButton: {
    position: 'absolute',
    top: 55,
    left: 0,
    zIndex: 10,
    padding: 10,
  },
  closeButtonText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
});
