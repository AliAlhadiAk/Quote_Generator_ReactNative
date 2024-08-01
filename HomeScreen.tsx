import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import tw from 'tailwind-react-native-classnames';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/FontAwesome5';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';
import Tts from 'react-native-tts';
import * as Clipboard from 'expo-clipboard';
import Share from 'react-native-share';
import Snackbar from 'react-native-snackbar';

const HomeScreen: React.FC = () => {
    const [author, setAuthor] = useState<string>('');
    const [quote, setQuote] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [snackbarVisible, setSnackbarVisible] = useState<boolean>(false);

    const randomQuote = async () => {
        try {
            setIsLoading(true);
            const response = await axios.get('https://api.forismatic.com/api/1.0/?method=getQuote&format=json&lang=en');
            setAuthor(response.data.quoteAuthor);
            setQuote(response.data.quoteText);
            setIsLoading(false);
        } catch (error) {
            console.error('Error fetching quote:', error);
            setIsLoading(false);
        }
    };

    useEffect(() => {
        randomQuote();
    }, []);

    const speakNow = () => {
        if (Tts) {
            Tts.stop();
            Tts.speak(`${quote} by ${author}`);
        } else {
            console.error('Tts is not initialized');
        }
    };



    const shareQuote = async () => {
        try {
            await Share.open({
                title: 'Share Quote',
                message: `${quote} — ${author}`,
                // Optional: Include other properties like `url`, `social` if needed
            });
            // Provide feedback after successful share
            Alert.alert('Success', 'Quote shared successfully!');
        } catch (error) {
            console.error('Error sharing:', error);
            Alert.alert('Error', 'There was an issue sharing the quote.');
        }
    };

    return (
        <View style={tw`flex-1 justify-center items-center bg-blue-700`}>
            <StatusBar style='light'/>
            <View style={[{ width: wp(90) }, tw`rounded-xl bg-white p-5`]}>
                <Text style={tw`text-center text-2xl font-semibold mb-5`}>
                    Quote of the Day
                </Text>
                <Icon name="quote-left" style={tw`-mb-3`} size={20} color="#000" />
                {
                    isLoading ? (
                        <Text style={tw`text-center text-xl`}>Loading ...</Text>
                    ) : (
                        <Text style={{
                            color: "#000",
                            lineHeight: 26,
                            fontSize: hp(2.2),
                            letterSpacing: 1.1,
                            fontWeight: '400',
                            textAlign: 'center',
                            marginBottom: hp(3),
                            paddingHorizontal: 30
                        }}>
                            {quote}
                        </Text>
                    )
                }
                <FontAwesome5 name="quote-right" style={tw`text-right -mt-4 mb-4`} size={20} color="#000" />
                <Text style={[tw`text-right`, { fontSize: hp(2.1), fontWeight: '300', fontStyle: 'italic' }]}>
                    --- {author}
                </Text>
                <TouchableOpacity onPress={randomQuote} style={[tw`bg-indigo-600 rounded-3xl`, { padding: hp(2), marginVertical: 20 }]}>
                    <Text style={[{ fontSize: hp(2) }, tw`text-white text-center`]}>New Quote</Text>
                </TouchableOpacity>

                <View style={[tw`flex-row justify-around`]}>
                    <TouchableOpacity onPress={speakNow} style={tw`border border-indigo-400 rounded-full p-3 flex items-center justify-center`}>
                        <FontAwesome name="volume-up" size={22} color="#4F46E5" />
                    </TouchableOpacity>

                    <TouchableOpacity  style={tw`border border-indigo-400 rounded-full p-3 flex items-center justify-center`}>
                        <FontAwesome5 name="copy" size={22} color="#4F46E5" />
                    </TouchableOpacity>

                    <TouchableOpacity onPress={shareQuote} style={tw`border border-indigo-400 rounded-full p-3 flex items-center justify-center`}>
                        <FontAwesome name="share-alt" size={22} color="#4F46E5" />
                    </TouchableOpacity>
                </View>
            </View>

  
        </View>
    );
};

export default HomeScreen;
