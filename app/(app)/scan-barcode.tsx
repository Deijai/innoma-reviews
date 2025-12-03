// app/(app)/scan-barcode.tsx
import { Ionicons } from '@expo/vector-icons';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Platform,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../hooks/useTheme';

export default function ScanBarcodeScreen() {
    const { theme } = useTheme();
    const router = useRouter();
    const [hasPermission, setHasPermission] = useState<boolean | null>(null);
    const [scanned, setScanned] = useState(false);
    const [lastCode, setLastCode] = useState<string | null>(null);

    useEffect(() => {
        (async () => {
            const { status } = await BarCodeScanner.requestPermissionsAsync();
            setHasPermission(status === 'granted');
        })();
    }, []);

    function handleClose() {
        router.back();
    }

    const handleBarCodeScanned = ({ data }: { data: string }) => {
        setScanned(true);
        setLastCode(data);
        // Aqui, no futuro, vamos usar esse código para buscar/registrar livro via API/Firebase
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#000' }}>
            {/* Header */}
            <View
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingHorizontal: 16,
                    paddingTop: Platform.OS === 'android' ? 8 : 0,
                    paddingBottom: 8,
                    backgroundColor: 'rgba(0,0,0,0.5)',
                }}
            >
                <TouchableOpacity
                    onPress={handleClose}
                    style={{
                        width: 32,
                        height: 32,
                        borderRadius: 999,
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: 'rgba(0,0,0,0.6)',
                    }}
                >
                    <Ionicons name="close" size={18} color="#FFFFFF" />
                </TouchableOpacity>
                <View style={{ marginLeft: 8 }}>
                    <Text
                        style={{
                            fontSize: 16,
                            fontWeight: '700',
                            color: '#FFFFFF',
                        }}
                    >
                        Escanear código de barras
                    </Text>
                    <Text
                        style={{
                            fontSize: 12,
                            color: '#E5E7EB',
                        }}
                    >
                        Aponte a câmera para o código do livro.
                    </Text>
                </View>
            </View>

            {/* Conteúdo */}
            {hasPermission === null ? (
                <View
                    style={{
                        flex: 1,
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: '#000',
                    }}
                >
                    <ActivityIndicator size="large" color="#FFFFFF" />
                    <Text style={{ color: '#FFFFFF', marginTop: 8 }}>
                        Solicitando permissão da câmera...
                    </Text>
                </View>
            ) : hasPermission === false ? (
                <View
                    style={{
                        flex: 1,
                        alignItems: 'center',
                        justifyContent: 'center',
                        paddingHorizontal: 24,
                        backgroundColor: '#000',
                    }}
                >
                    <Text
                        style={{
                            fontSize: 16,
                            fontWeight: '700',
                            color: '#FFFFFF',
                            marginBottom: 8,
                        }}
                    >
                        Sem acesso à câmera
                    </Text>
                    <Text
                        style={{
                            fontSize: 14,
                            color: '#E5E7EB',
                            textAlign: 'center',
                        }}
                    >
                        Você precisa permitir o acesso à câmera nas configurações para
                        utilizar o scanner.
                    </Text>
                </View>
            ) : (
                <View style={{ flex: 1 }}>
                    <BarCodeScanner
                        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
                        style={{ flex: 1 }}
                    />

                    {/* Overlay com último código lido */}
                    <View
                        style={{
                            position: 'absolute',
                            left: 0,
                            right: 0,
                            bottom: 0,
                            paddingHorizontal: 16,
                            paddingVertical: 16,
                            backgroundColor: 'rgba(0,0,0,0.6)',
                        }}
                    >
                        {lastCode ? (
                            <>
                                <Text
                                    style={{
                                        fontSize: 13,
                                        color: '#E5E7EB',
                                        marginBottom: 4,
                                    }}
                                >
                                    Último código lido:
                                </Text>
                                <Text
                                    style={{
                                        fontSize: 14,
                                        fontWeight: '700',
                                        color: '#FFFFFF',
                                        marginBottom: 12,
                                    }}
                                    numberOfLines={2}
                                >
                                    {lastCode}
                                </Text>
                                <View style={{ flexDirection: 'row', gap: 10 }}>
                                    <TouchableOpacity
                                        onPress={() => setScanned(false)}
                                        style={{
                                            flex: 1,
                                            paddingVertical: 10,
                                            borderRadius: 999,
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            backgroundColor: '#FFFFFF',
                                        }}
                                    >
                                        <Text
                                            style={{
                                                fontSize: 14,
                                                fontWeight: '600',
                                                color: '#111827',
                                            }}
                                        >
                                            Escanear novamente
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </>
                        ) : (
                            <Text
                                style={{
                                    fontSize: 13,
                                    color: '#E5E7EB',
                                }}
                            >
                                Aponte para o código de barras do livro para capturar.
                            </Text>
                        )}
                    </View>
                </View>
            )}
        </SafeAreaView>
    );
}
